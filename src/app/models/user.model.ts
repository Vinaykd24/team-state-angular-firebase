export interface Roles {
  subscriber?: boolean;
  admin?: boolean;
}

export interface User {
  email: string;
  userId: string;
  role?: string;
  roles?: Roles;
}
