export interface UserDto {
  id: string;
  username: string;
  email: string;
  name: string;
  roles?: string[];
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface RoleResponse {
  id: string;
  name: string;
}
