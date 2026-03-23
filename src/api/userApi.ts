import { request } from "./base";
import type {
  UpdateEmailPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  UserInfo,
} from "@/models/userModel";

interface MeResponse {
  display_user_id?: string | null;
  username: string;
  display_name?: string | null;
  avatar?: string | null;
  email?: string | null;
  email_verified: boolean;
  disabled: boolean;
}

export const meApi = async (): Promise<UserInfo> => {
  const response = await request<undefined, MeResponse>({
    method: "GET",
    url: "/user/me",
    group: "auth",
  });

  return {
    id: response.display_user_id ?? "",
    email: response.email ?? "",
    name: response.display_name || response.username,
    avatar: response.avatar ?? "",
  };
};

interface UpdateProfileRequestBody {
  display_name?: string | null;
  avatar?: string | null;
}

export const updatePasswordApi = async (
  payload: UpdatePasswordPayload,
): Promise<void> => {
  await request<UpdatePasswordPayload, undefined>({
    method: "PUT",
    url: "/user/password",
    body: payload,
    group: "auth",
  });
};

export const updateEmailApi = async (
  payload: UpdateEmailPayload,
): Promise<void> => {
  await request<UpdateEmailPayload, undefined>({
    method: "PUT",
    url: "/user/email",
    body: payload,
    group: "auth",
  });
};

export const updateProfileApi = async (
  payload: UpdateProfilePayload,
): Promise<void> => {
  const body: UpdateProfileRequestBody = {
    display_name: payload.displayName,
    avatar: payload.avatar,
  };

  await request<UpdateProfileRequestBody, undefined>({
    method: "PUT",
    url: "/user/profile",
    body,
    group: "auth",
  });
};

export const verifyEmailApi = async (): Promise<void> => {
  await request<undefined, undefined>({
    method: "POST",
    url: "/user/email/verify",
    group: "auth",
  });
};
