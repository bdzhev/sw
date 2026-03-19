import type { DemoStatsFormValues } from '../../model/stats';

export interface StatsFormProps {
  initialValues: DemoStatsFormValues;
  onFormSubmit: (values: DemoStatsFormValues) => void;
  onFormReset?: () => void;
}
