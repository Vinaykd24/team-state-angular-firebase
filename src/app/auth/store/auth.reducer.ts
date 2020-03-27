import { Action } from "@ngrx/store";

import {
  AuthActions,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  GET_USER_ROLE
} from "./auth.actions";

export interface State {
  isAuthenticated: boolean;
  userRole: string;
}

const initialState: State = {
  isAuthenticated: false,
  userRole: ""
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        isAuthenticated: true
      };
    case SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false
      };
    case GET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
