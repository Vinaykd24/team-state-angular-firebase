import { Action, createFeatureSelector, createSelector } from "@ngrx/store";

import {
  AuthActions,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  GET_USER_ROLE,
  SET_USER,
} from "./auth.actions";
import { User } from "src/app/models/user.model";

export interface State {
  isAuthenticated: boolean;
  user: User;
  // userRole: string;
}

const initialState: State = {
  isAuthenticated: false,
  user: null,
  // userRole: ""
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false,
        user: null,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    // case GET_USER_ROLE:
    //   return {
    //     ...state,
    //     userRole: action.payload
    //   };
    default: {
      return state;
    }
  }
}

export const getAuthState = createFeatureSelector<State>("auth");

export const getIsAuth = (state: State) => state.isAuthenticated;

export const getUser = createSelector(
  getAuthState,
  (state: State) => state.user
);
