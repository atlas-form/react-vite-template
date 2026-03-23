import type { LoginRequest, LoginResponse } from "@/models/authModel";
import { request } from "./base";

export const loginApi = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const response = await request<LoginRequest, LoginResponse>({
    method: "POST",
    url: "/auth/login",
    body: payload,
    group: "auth",
  });
  return response;
};
