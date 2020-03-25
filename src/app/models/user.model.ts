export interface Roles {
  subscriber?: boolean;
  admin?: boolean;
}

export interface User {
  email: string;
  userId: string;
  roles: Roles;
}
