import { Action } from "@ngrx/store";
import { User } from "src/app/models/user.model";

export const SET_AUTHENTICATED = "[Auth] Set Authenticated";
export const GET_USER_ROLE = "[Auth] Get User Role";
export const SET_UNAUTHENTICATED = "[Auth] Set Unauthenticated";
export const SET_USER = "[Auth] Set User";
export const SET_IS_ADMIN = "[Auth] Set Is Admin";

export class SetAuthenticated implements Action {
  readonly type = SET_AUTHENTICATED;
}

export class GetUserRole implements Action {
  readonly type = GET_USER_ROLE;
  constructor(public payload: string) {}
}

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) {}
}

export class SetIsAdmin implements Action {
  readonly type = SET_IS_ADMIN;
  constructor(public payload: boolean) {}
}

export class SetUnauthenticated implements Action {
  readonly type = SET_UNAUTHENTICATED;
}

export type AuthActions =
  | SetAuthenticated
  | SetUnauthenticated
  | GetUserRole
  | SetUser
  | SetIsAdmin;
