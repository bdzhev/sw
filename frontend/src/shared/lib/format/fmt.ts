export const fmt = (str: string, params: Record<string, unknown>) => {
  return str.replace(/{(\w+)}/g, (_, key) => {
    return String(params[key] ?? '');
  });
};
