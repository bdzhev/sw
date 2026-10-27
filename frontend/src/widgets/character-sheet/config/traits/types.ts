import type { ResetTrigger } from '@shared/api/characters';

/**
 * A named way to spend a class resource, cost baked in. `cost: null` means the
 * price varies with what the player is doing (Twinned Spell, Lay on Hands
 * healing), so the control asks for an amount instead of assuming one.
 */
export interface ResourceSubAbility {
  name: string;
  cost: number | null;
  note?: string;
}

/**
 * One of the official class resources. `resetTrigger` is null for the four the
 * design doc never states — the app must not assert a rest rule nobody read off
 * the SRD, so those fall back to manual and the player picks.
 */
export interface KnownResource {
  key: string;
  label: string;
  resetTrigger: ResetTrigger | null;
}
