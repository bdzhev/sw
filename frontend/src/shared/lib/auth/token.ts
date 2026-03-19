let accessToken: string | null = null;

export const getToken = () => accessToken;
export const setToken = (token: string) => { accessToken = token; };
export const clearToken = () => { accessToken = null; };
