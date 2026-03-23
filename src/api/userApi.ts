import { request } from "./base";
import type { UserInfo } from "@/models/userModel";

export const meApi = async (): Promise<UserInfo> => {
  const response = await request<undefined, UserInfo>({
    method: "GET",
    url: "/user/me",
    group: "auth",
  });
  return response;
};
