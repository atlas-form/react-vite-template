export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface MeResponse {
  display_user_id?: string | null;
  username: string;
  display_name?: string | null;
  avatar?: string | null;
  email?: string | null;
  email_verified: boolean;
  disabled: boolean;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateEmailPayload {
  email?: string | null;
}

export interface UpdateProfilePayload {
  displayName?: string | null;
  avatar?: string | null;
}
