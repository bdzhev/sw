<script setup lang="ts">
import { BedDouble, ChevronsUp } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from '@shared/ui/tooltip';

const REST_HINT = 'Short and long rests arrive in a later update.';
const LEVEL_UP_HINT = 'Levelling up arrives in a later update.';
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <h2 class="text-sm font-semibold text-primary uppercase">Actions</h2>

    <div class="flex flex-col gap-2 sm:flex-row">
      <TooltipRoot>
        <!-- A disabled button swallows pointer events, so the span is the trigger. -->
        <TooltipTrigger as="span" tabindex="0" class="inline-flex w-full sm:w-fit">
          <Button is-disabled width="full" class="min-h-11">
            <BedDouble :size="18" class="mr-2" />
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
            <ChevronsUp :size="18" class="mr-2" />
            Level up
          </Button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent class="max-w-64">{{ LEVEL_UP_HINT }}</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </div>
  </section>
</template>
