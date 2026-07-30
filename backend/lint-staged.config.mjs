// Order is deliberate: oxlint --fix first, oxfmt --write last, so the formatter
// gets the final word on style.
//
// The last entry is a function, so lint-staged calls it once for the whole
// matched group instead of once per file, and appends no filenames: TypeScript
// needs whole-program context, so the project is checked as a unit.
export default {
  '*.ts': [
    'oxlint --fix --max-warnings=0',
    'oxfmt --write',
    () => {
      return 'tsc --noEmit';
    },
  ],
  '*.{json,md,yml,yaml}': 'oxfmt --write',
};
