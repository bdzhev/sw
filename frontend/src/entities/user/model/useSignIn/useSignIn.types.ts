export interface SignInPayload {
  username: string;
  password: string;
}

export interface UseSignInOptions {
  onSuccess?: () => void;
}
