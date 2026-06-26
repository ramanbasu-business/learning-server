// BFF-to-client contract — the source of truth tsoa generates the OpenAPI spec from.
export interface RoleDto {
  id: string;
  name: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt?: string;
  roles: RoleDto[];
}

// Wire shapes returned by the core-API microservice, before the BFF composes them into UserDto.
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
