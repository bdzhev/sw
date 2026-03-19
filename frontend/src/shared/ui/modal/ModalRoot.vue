<script setup lang="ts">
import { computed, provide, ref } from 'vue';

import type { ModalContext } from './ModalRoot.types';
import type { ModalRootProps } from './ModaRoot.props';

const props = defineProps<ModalRootProps>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

/**
 * Uncontrolled mode inner state.
 */
const _isOpen = ref(props.defaultOpen);

const isOpen = computed({
  get() {
    return props.isControlled ? props.open : _isOpen.value;
  },
  set(val: boolean) {
    if (props.isControlled) {
      emit('update:open', val);
    } else {
      _isOpen.value = val;
    }
  },
});

const toggleModal = (val: boolean) => {
  isOpen.value = val;

  props.onToggle?.();
};

provide<ModalContext>('modalContext', {
  toggleModal,
  isOpen,
  shouldCloseOnOutsideClick: !props.disableOutsideClickClose,
  onModalOpen: props?.onModalOpen,
});
</script>

<template>
  <slot />
</template>
