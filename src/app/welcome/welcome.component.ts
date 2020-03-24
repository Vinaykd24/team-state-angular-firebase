import { Component, OnInit } from "@angular/core";
import { PlayerService } from "../player/player.service";
import { Store } from "@ngrx/store";
import { State } from "../app.reducer";
import * as fromPlayerReducer from "../player/store/player.reducer";
import * as playerActions from "../player/store/player.actions";
import * as fromMatchReducer from "../match/store/match.reducer";
import * as fromMatchDetailsReducer from "../match/store/match-details.reducer";
import { TopPlayer } from "../models/top-player.model";
import { Observable } from "rxjs";
import { Match } from "../models/match.model";
import { MatchDetails } from "../models/match-details.model";
import { MatchService } from "../match/match.service";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {
  topBatsmanList: TopPlayer[];
  topBowlerList: TopPlayer[];
  matches$: Observable<Match[]>;
  matchDetails$: Observable<MatchDetails[]>;
  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private store: Store<State>
  ) {
    this.store
      .select(fromPlayerReducer.getAvailablePlayers)
      .subscribe(data => this.fetchTopBatsman(data));
    this.fetchPlayers();
    this.fetchMatches();
    this.fetchMatchDetails();
  }

  ngOnInit(): void {
    this.matches$ = this.store.select(fromMatchReducer.getAvailableMatches);
    this.matchDetails$ = this.store.select(
      fromMatchDetailsReducer.getAvailableMatchDetails
    );
  }

  fetchPlayers() {
    this.playerService.getPlayerMatchDetails();
  }
  fetchTopBatsman(list: any[]) {
    this.topBatsmanList = this.playerService
      .getTopBatsmanList(list)
      .slice(0, 5);
    this.topBowlerList = this.playerService.getTopBowlingList(list).slice(0, 5);
    console.log(this.topBatsmanList, this.topBowlerList);
  }
  fetchMatches() {
    this.matchService.getMatches();
  }
  fetchMatchDetails() {
    this.matchService.getMatchDetails();
  }
}
