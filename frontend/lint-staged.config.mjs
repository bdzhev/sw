// Order is deliberate: oxlint --fix first, oxfmt --write last.
// oxfmt owns Tailwind class order and import order, so the formatter must get
// the final word. (This is the reverse of the old prettier-then-eslint order,
// which existed because class ordering used to be an eslint fix.)
//
// The last entry is a function, so lint-staged calls it once for the whole
// matched group instead of once per file, and appends no filenames: TypeScript
// needs whole-program context, so the project is checked as a unit.
export default {
  '*.{ts,mts,tsx,vue}': [
    'oxlint --fix --max-warnings=0',
    'oxfmt --write',
    () => {
      return 'vue-tsc --build';
    },
  ],
  '*.{css,json,md,html,yml,yaml}': 'oxfmt --write',
};
