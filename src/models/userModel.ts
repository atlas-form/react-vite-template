export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar: string;
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
