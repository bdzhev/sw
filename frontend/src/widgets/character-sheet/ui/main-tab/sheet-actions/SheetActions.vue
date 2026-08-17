<script setup lang="ts">
import { BedDouble, ChevronsUp } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from '@shared/ui/tooltip';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

const REST_HINT = 'Short and long rests arrive in a later update.';
const LEVEL_UP_HINT = 'Levelling up arrives in a later update.';
</script>

<template>
  <SheetSection title="Actions" variant="plain" :heading-level="3">
    <div class="flex flex-col gap-2 sm:flex-row">
      <TooltipRoot>
        <!-- A disabled button swallows pointer events, so the span is the trigger. -->
        <TooltipTrigger as="span" tabindex="0" class="inline-flex w-full sm:w-fit">
          <Button is-disabled width="full" class="min-h-11">
            <BedDouble :size="18" class="mr-1" />
            Rest
          </Button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent class="max-w-64">{{ REST_HINT }}</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>

      <TooltipRoot>
        <TooltipTrigger as="span" tabindex="0" class="inline-flex w-full sm:w-fit">
          <Button is-disabled variant="secondary" width="full" class="min-h-11">
            <ChevronsUp :size="18" class="mr-1" />
            Level up
          </Button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent class="max-w-64">{{ LEVEL_UP_HINT }}</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </div>
  </SheetSection>
</template>
