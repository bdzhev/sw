<script setup lang="ts">
import { Separator } from '@shared/ui/separator';

import { SkeletonBlock } from './skeleton-block';

/**
 * Mirrors the sheet's own structure — the same two full-bleed bands, the same
 * breakpoint switches, the same block sizes — so the page resolves in place
 * instead of reflowing. The previous version was two inset rectangles standing
 * in for a full-bleed header, which moved twice: once vertically, once sideways.
 *
 * A fragment, not a wrapper: `CharacterSheet` renders this inside its own
 * `gap-4` column, so the bands must be siblings there like the real ones.
 *
 * The body mirrors the **main** tab. That is where every entry point lands, and
 * its shape — two cards side by side from md, then one wide section — is close
 * enough to the other four that a deep link does not look wrong.
 */
const ABILITY_ROWS = Array.from({ length: 6 }, (_, index) => {
  return index;
});

const TABS = Array.from({ length: 5 }, (_, index) => {
  return index;
});

const STAT_FIELDS = Array.from({ length: 5 }, (_, index) => {
  return index;
});

const PAIRED_CARDS = [0, 1];
</script>

<template>
  <span class="sr-only">Loading the character sheet…</span>

  <!-- header band -->
  <div
    aria-hidden="true"
    class="page-x-bleed flex flex-col gap-4 border-b border-border bg-bg-secondary py-4 md:py-6"
  >
    <div class="flex flex-wrap items-center gap-x-2 gap-y-4 md:flex-nowrap md:gap-x-4">
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <SkeletonBlock class="size-11 shrink-0 rounded-sm" />

        <div class="flex min-w-0 flex-col gap-1">
          <SkeletonBlock class="h-8 w-40 rounded-sm" />

          <SkeletonBlock class="h-5 w-32 rounded-sm" />
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-1">
        <SkeletonBlock class="size-11 rounded-sm" />

        <SkeletonBlock class="size-11 rounded-sm" />
      </div>

      <div class="grid w-full grid-cols-5 gap-1 md:w-fit md:shrink-0 md:gap-2">
        <div
          v-for="field in STAT_FIELDS"
          :key="field"
          class="flex min-w-0 flex-col gap-1 md:w-20"
        >
          <SkeletonBlock class="h-4 w-10 rounded-sm" />

          <SkeletonBlock class="h-11 w-full rounded-md md:h-9" />
        </div>
      </div>
    </div>

    <SkeletonBlock class="h-6 w-32 rounded-full" />
  </div>

  <!-- tab bar -->
  <div aria-hidden="true" class="page-x-bleed flex gap-1 border-b border-border">
    <SkeletonBlock v-for="tab in TABS" :key="tab" class="my-2 h-7 w-16 rounded-sm" />
  </div>

  <!-- main tab -->
  <div aria-hidden="true" class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div class="grid gap-4 md:grid-cols-2 md:gap-6">
      <div
        v-for="card in PAIRED_CARDS"
        :key="card"
        class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
      >
        <SkeletonBlock class="h-5 w-32 rounded-sm" />

        <ul class="flex flex-col">
          <li
            v-for="row in ABILITY_ROWS"
            :key="row"
            class="flex items-center gap-3 border-t border-border py-2 first:border-t-0 first:pt-0"
          >
            <SkeletonBlock class="mr-auto h-4 w-10 rounded-sm" />

            <SkeletonBlock class="h-11 w-16 shrink-0 rounded-md md:h-9" />

            <SkeletonBlock class="h-6 w-10 shrink-0 rounded-sm" />
          </li>
        </ul>
      </div>
    </div>

    <div
      class="flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-4 md:gap-6 md:p-6"
    >
      <div class="flex flex-col gap-4 md:flex-row md:gap-6">
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <SkeletonBlock class="h-5 w-24 rounded-sm" />

          <SkeletonBlock class="h-11 w-full rounded-md md:h-9" />
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <SkeletonBlock class="h-5 w-28 rounded-sm" />

          <SkeletonBlock class="h-11 w-40 rounded-md md:h-9" />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div class="flex flex-col gap-3">
        <SkeletonBlock class="h-5 w-20 rounded-sm" />

        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <SkeletonBlock class="h-11 w-full rounded-sm sm:w-28" />

          <SkeletonBlock class="h-11 w-full rounded-sm sm:w-32" />
        </div>
      </div>
    </div>
  </div>
</template>
