import { Action } from "@ngrx/store";
import { TopPlayer } from "src/app/models/top-player.model";

export const GET_AVAILABLE_PLAYERS = "[Players] Get Available Players";

export class GetAvailablePlayers implements Action {
  readonly type = GET_AVAILABLE_PLAYERS;

  constructor(public payload: TopPlayer[]) {}
}

export type PlayerActions = GetAvailablePlayers;
