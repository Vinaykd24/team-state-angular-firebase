import { Action } from "@ngrx/store";

export const SET_AUTHENTICATED = "[Auth] Set Authenticated";
export const GET_USER_ROLE = "[Auth] Get User Role";
export const SET_UNAUTHENTICATED = "[Auth] Set Unauthenticated";

export class SetAuthenticated implements Action {
  readonly type = SET_AUTHENTICATED;
}

export class GetUserRole implements Action {
  readonly type = GET_USER_ROLE;
  constructor(public payload: string) {}
}

export class SetUnauthenticated implements Action {
  readonly type = SET_UNAUTHENTICATED;
}

export type AuthActions = SetAuthenticated | SetUnauthenticated | GetUserRole;
