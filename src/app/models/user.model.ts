export interface Roles {
  subscriber?: boolean;
  admin?: boolean;
}

export interface User {
  email: string;
  userId: string;
  role?: string;
  displayName?: string;
  roles?: Roles;
}
