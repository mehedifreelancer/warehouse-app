// services/auth/login.service.ts

import type { AxiosResponse } from "axios";
import api from "../../config/api/api-config";
import type {
  LoginApiResponse,
  LoginPayload,
} from "../../types/auth/signin.types";

export const signIn = (
  payload: LoginPayload
): Promise<AxiosResponse<LoginApiResponse>> =>
  api
    .post<LoginApiResponse>("/auth/get-token/", payload, {skipAuth: true})
    .then((res) => res)
    .catch((err) => {
      console.error("Login failed:", err);
      throw err;
    });
