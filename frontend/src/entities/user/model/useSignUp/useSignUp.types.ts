export interface SignUpPayload {
  username: string;
  password: string;
}

export interface UseSignUpOptions {
  onSuccess?: () => void;
}
