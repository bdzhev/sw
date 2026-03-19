<script lang="ts" setup>
import { User } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

import { Button } from '@shared/ui/button';
import {
  TooltipRoot,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@shared/ui/tooltip';

import { useSignOut } from '../../../model/useSignOut';

const { signOut } = useSignOut();
</script>

<template>
  <TooltipRoot placement="right-end" portal-to="body">
    <TooltipTrigger>
      <Button
        size="sm"
        variant="transparent"
        class="relative w-full"
        equal-padding
      >
        <User :size="20" />
      </Button>
    </TooltipTrigger>

    <TooltipPortal>
      <TooltipContent>
        <div class="flex flex-col gap-2">
          <Button
            variant="transparent"
            size="sm"
            @click="signOut"
            class="w-full"
          >
            Sign out
          </Button>

          <RouterLink to="/app/settings">
            <Button variant="transparent" size="sm" class="w-full">
              Edit profile
            </Button>
          </RouterLink>
        </div>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
