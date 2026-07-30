import type { RouteLocationRaw } from 'vue-router';

export interface NavLinkProps {
  link: RouteLocationRaw;
  onClick?: () => void;
}
