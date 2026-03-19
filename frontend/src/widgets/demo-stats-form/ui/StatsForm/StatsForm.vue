<script setup lang="ts">
import { useForm } from 'vee-validate';
import { provide } from 'vue';

import { Button } from '@shared/ui/button';

import { formContextKey } from '../../config/stats';
import { demoStatsSchema } from '../../model/stats';
import { FormBody } from '../FormBody';
import { FormHeader } from '../FormHeader';

import type { StatsFormProps } from './StatsForm.props';

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

    <Button type="submit" :is-disabled="!meta.valid || !meta.dirty" size="md">
      Calc my stats
    </Button>
  </form>
</template>
