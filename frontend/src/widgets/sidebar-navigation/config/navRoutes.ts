import { Settings, Home } from 'lucide-vue-next';

export const navRoutes = [
  {
    label: 'Home',
    url: '/app',
    icon: Home,
    name: 'app_home',
  },
  {
    label: 'Settings',
    url: '/app/settings',
    icon: Settings,
    name: 'app_settings',
  },
];
