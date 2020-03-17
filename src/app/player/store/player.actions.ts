import { Action } from "@ngrx/store";
import { TopPlayer } from "src/app/models/top-player.model";

export const GET_AVAILABLE_PLAYERS = "[Players] Get Available Players";
export const GET_TOP_BATSMAN = "[Welcome] Get Top Batsman";
export const GET_SELECTED_PLAYERS = "[Players] Get Selected Player";

export class GetAvailablePlayers implements Action {
  readonly type = GET_AVAILABLE_PLAYERS;

  constructor(public payload: TopPlayer[]) {}
}

export class GetTopBatsman implements Action {
  readonly type = GET_TOP_BATSMAN;

  constructor(public payload: TopPlayer[]) {}
}

export class GetSelectedPlayer implements Action {
  readonly type = GET_SELECTED_PLAYERS;

  constructor(public payload: string) {}
}

export type PlayerActions =
  | GetAvailablePlayers
  | GetSelectedPlayer
  | GetTopBatsman;
