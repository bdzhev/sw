# useSheetAutosave

The character sheet's autosave controller. Every inline edit on the sheet — hp, ability
scores, proficiency toggles, spell slots, conditions, death saves — goes through here,
and nothing else writes the `character_sheets` row.

The contract this implements lives in the vault:
`character-sheet/save_strategy.md`. Why it is shaped the way it is:
`character-sheet/grills/autosave-controller.md`. This file is how it operates.

## Why a store and not a composable

Two of its triggers fire when the sheet is already gone: the flush on route leave, and
the retry ladder after a failed request. A composable scoped to the sheet would be
unmounted at that point, and any `onScopeDispose` cleanup would cancel exactly the
flush that matters. So it is an app-level Pinia store, keyed by one attached character
at a time, living above the route.

## Invariants

Four, and the sheet depends on all of them:

1. **Sole writer.** Nothing outside this store writes `character_sheets`. Explicit-save
   forms — the settings page — write the `characters` row and nothing else. A
   whole-form submit into the autosave channel would be a stale-object writer.
2. **Absolute values, never deltas.** A patch says `{ hpCurrent: 5 }`, never `-5`, so
   a resend is idempotent and a lost flush costs nothing.
3. **Single-flight.** One request out at a time. A slow older response can therefore
   never land after a newer one and overwrite it.
4. **The query cache _is_ the working copy.** There is no second dirty copy layered on
   top, so there is nothing to drift.

## The lifecycle

```
attach(id, sheet)          adopt a fetched row; replay a buffered patch if it matches
   ↓
patchSheet(patch)          merge into pendingPatch
   ├─ mergeCachedSheet     echo into the cache immediately (this is the working copy)
   ├─ scheduleBufferWrite  arm the localStorage mirror, ≤1 write per 250ms
   └─ scheduleFlush        2s debounce, 12s max-wait   (or flush now, if `immediate`)
   ↓
flush()                    single-flight; pendingPatch → inFlightPatch → PATCH
   ↓
ack                        adopt the server row UNDER anything queued meanwhile
   ├─ clearBuffer          the ack is what makes the mirror redundant
   └─ saveState 'saved' → 'idle' after 1.5s
```

`mergeCachedSheet` is not an optimisation. The cached sheet is what every field renders
from, so without the echo a controlled input re-reads the pre-edit server value on blur
and appears to have thrown away what was typed.

**The ack merges under, not over.** `adoptAckedSheet` writes
`{ ...ackedSheet, ...pendingPatch }`. The response is authoritative for the fields it
carried, but anything the player queued while it was in flight is newer. Adopting the
row alone makes the field visibly snap back to its pre-edit value for one whole round
trip before the follow-up flush corrects it — obvious on a slow connection while a
stepper is held. It is the same "under anything newer" rule the failure path applies
when it re-queues a payload; both directions need it.

## Two durability layers, doing different jobs

|                         | what it is for                         | lifetime      |
| ----------------------- | -------------------------------------- | ------------- |
| the TanStack cache      | the working copy every field **reads** | the session   |
| the localStorage buffer | the crash net for unsaved **writes**   | until the ack |

The buffer stores `{ characterId, baseSeq, patch }`, where `baseSeq` is the
`lastWriteSeq` of the server row the patch was derived from. That field is the entire
point of the record:

> On mount, fetch the row. If the row is **newer** than the buffer's base, discard the
> buffer whole — server wins, no merge, no prompt. Replay only a buffer whose base
> matches the fetched row.

Without it, a laptop's buffer that predates a `POST /rest` from the phone would
resurrect pre-rest hp, which is the exact thing the atomic actions exist to prevent.
`takeBufferFor` in `../sheet-buffer` is that rule, whole.

**Clearing the buffer is the flush's job, on ack.** It used to be nobody's: the
post-ack cache write bumped the character, `useSheetShell`'s `watch` re-ran `attach`,
and the staleness check removed the buffer as a side effect — which also meant a
`localStorage` read and a `JSON.parse` on _every_ patch. `attach` is now a no-op for
the character it is already attached to, so if you ever move `clearBuffer` back out of
the flush, the buffer becomes immortal and a stale patch stays replayable.

## Flush triggers

| trigger                     | why it exists                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 2s idle debounce            | the common case: a value settles, then goes                                                                                     |
| 12s max-wait                | constant nudging must not defer a flush forever. Bounds debounce _deferral_, not in-flight duration — single-flight still waits |
| `immediate`                 | single-shot edits with no follow-up write to carry them: conditions, death saves, inspiration                                   |
| route leave                 | `detach()`, so leaving the sheet does not sit on an edit                                                                        |
| `visibilitychange` → hidden | on iOS this is the only teardown signal that reliably fires, and this app is for phones at a table                              |
| `pagehide`                  | tab close and refresh, via `keepalive`                                                                                          |

The `immediate` distinction is about self-healing, not importance. Repeated fields (hp,
counters, slots) resend an absolute value on the next tick, so a lost flush costs
nothing. A condition add has no next tick — background the tab and it is simply gone.

Teardown cannot use `navigator.sendBeacon`: it is POST-only, with no method argument,
and every target here is a PATCH. `fetch(…, { keepalive: true })` is the working
equivalent, and it is best-effort — the buffer is the real net, which is why
`flushOnTeardown` mirrors it synchronously first.

## When a write fails

Retry with backoff, four attempts, 500ms doubling. The rule that matters:

> The retry re-reads the current working copy at send time. It never resends the
> payload that failed.

`flush`'s `catch` merges the failed fields back **under** whatever is pending, so a
newer edit always wins. This is why `useUpdateSheet` sets **`retry: false`** — TanStack
retries with the variables captured when `mutate` was called, which is precisely the
stale payload this avoids. Do not turn it on.

An edit landing mid-ladder restarts `attempt` at zero, so `MAX_RETRIES` caps a _quiet_
failing endpoint rather than an actively-edited one. That is deliberate: a player still
typing has not given up.

`stopBadgeTimer` is called by the sheet on unmount and clears **only** the saved-badge
timer. The retry timer deliberately survives — outliving the route is the whole reason
this is a store. Only `attach`ing a different character cancels a retry.

## What is deliberately not reactive

`pendingPatch`, `inFlightPatch`, `isFrozen`, `characterId` and the five timer handles
are plain closure variables, not `ref`s. Nothing outside the store reads them, and a
`ref` deep-proxied every patch object that passed through. That mattered because of the
edit rate: reka's `usePressedHold` fires on press, again at 400ms, then **every 60ms**,
so a held stepper queues about seventeen patches a second.

Only `saveState` and `isDirty` (exposed as `hasUnsavedChanges`) are reactive, because
the `StatusBar` renders them.

`setPending` is the sole writer of the pending slot. It keeps `isDirty` in step, and it
also keeps the slot readable after an `await`: assigning it directly makes TypeScript's
control-flow analysis believe it is still whatever this function last set it to, which
narrows a later `if (pendingPatch)` to `never` even though another edit may well have
landed while the request was out.

## runServerAction

The shared choreography for the three atomic actions — rest, level-up, setup: flush
pending, freeze so autosave cannot race the write, POST, adopt the full state that
comes back, clear the dirty slot and the buffer.

**It has never executed.** Nothing calls it and no action endpoint exists yet. `rest`
is the first thing that will run it, and should verify it rather than trust it.

## Neighbours

- `../sheet-cache` — the three ways the cache is touched
- `../sheet-buffer` — the localStorage mirror and the hydrate rule
- `../useUpdateSheet` — the sheet PATCH as a thin mutation
- `@shared/api/characters` — all transport, including the `keepalive` teardown write
- `@widgets/character-sheet/model/sheet-shell` — the only caller of `attach`/`detach`
  and the owner of the teardown listeners
