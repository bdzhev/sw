import type { LucideProps } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';

export interface RouteButtonProps {
  url: string;
  label: string;
  name: string;
  icon: FunctionalComponent<LucideProps>;
  isExpanded: boolean;
}
