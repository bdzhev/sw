const BASE_QUERY_PART = "characters";

export const characterQueries = {
  characters: () => {
    return [BASE_QUERY_PART, "characters"];
  },
  character: (id?: string) => {
    return [BASE_QUERY_PART, id];
  },
  addCharacter: () => {
    return [BASE_QUERY_PART, "addCharacter"];
  },
};
