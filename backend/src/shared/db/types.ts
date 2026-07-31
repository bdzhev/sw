export enum CharacterStat {
  Str = 'str',
  Dex = 'dex',
  Wis = 'wis',
  Int = 'int',
  Cha = 'cha',
}

export type QuizResults = Record<string, CharacterStat>;
