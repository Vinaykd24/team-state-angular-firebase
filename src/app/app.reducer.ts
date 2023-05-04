import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from "@ngrx/store";

import * as fromAuth from "./auth/store/auth.reducer";
import * as fromUi from "./shared/ui.reducer";
import * as fromPlayer from "./player/store/player.reducer";
import * as fromMatch from "./match/store/match.reducer";
import * as fromMatchDetails from "../app/match/store/match-details.reducer";

export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
  players: fromPlayer.State;
  matches: fromMatch.State;
  matchDetails: fromMatchDetails.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
  players: fromPlayer.playerReducer,
  matches: fromMatch.matchReducer,
  matchDetails: fromMatchDetails.matchDetailsReducer,
};

export const getUiState = createFeatureSelector<fromUi.State>("ui");
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>("auth");
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);
export const getIsAdminRoot = createSelector(
  getAuthState,
  fromAuth.getAuthState
);
