<script setup lang="ts">
import { useForm } from 'vee-validate';
import { provide } from 'vue';

import { Button } from '@shared/ui/button';

import { formContextKey } from '../../config/stats';
import { demoStatsSchema } from '../../model/stats';
import { FormBody } from '../form-body';
import { FormHeader } from '../form-header';
import type { StatsFormProps } from './StatsForm.types';

const props = defineProps<StatsFormProps>();

const form = useForm({
  initialValues: props.initialValues,
  validationSchema: demoStatsSchema,
});

const { meta } = form;

const onSubmit = form.handleSubmit((values) => {
  props.onFormSubmit(values);
});

provide(formContextKey, form);
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormHeader />

    <FormBody />

    <div class="px-5 pb-5 md:px-8 md:pb-6">
      <Button
        type="submit"
        :is-disabled="!meta.valid || !meta.dirty"
        size="md"
        width="fullOnMobile"
        class="min-h-11 md:min-h-0"
      >
        Calc my stats
      </Button>
    </div>
  </form>
</template>
