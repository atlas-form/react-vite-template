import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/models/authModel";
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

export const registerApi = async (payload: RegisterRequest): Promise<void> => {
  await request<RegisterRequest, unknown>({
    method: "POST",
    url: "/auth/register",
    body: payload,
    group: "auth",
  });
};
