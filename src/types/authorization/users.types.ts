export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
}

export type UsersResponse = User[];

export interface CreateUserPayload {
  username: string;
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
}

export interface UpdateUserPayload {
  username?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_staff?: boolean;
}