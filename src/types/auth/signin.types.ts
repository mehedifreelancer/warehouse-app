// types/auth.types.ts

// Payload sent to the login API
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Data returned from the API inside the `data` field
export interface LoginResponse {
  name: string;
  accessToken: string;
  tokenType: string;
}

// Full response structure from the API
export interface LoginApiResponse {
  data: {
    data: LoginResponse;
    message: string;
  };
  status: number;
}
