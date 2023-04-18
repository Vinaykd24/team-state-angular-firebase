import { Component, OnInit } from "@angular/core";
import { PlayerService } from "../player/player.service";
import { Store } from "@ngrx/store";
import { State } from "../app.reducer";
import * as fromPlayerReducer from "../player/store/player.reducer";
import * as playerActions from "../player/store/player.actions";
import * as matchActions from "../match/store/match.actions";
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
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  topBatsmanList: TopPlayer[];
  topBowlerList: TopPlayer[];
  topBowlerAvgList: TopPlayer[];
  topBattingAvgList: TopPlayer[];
  matches$: Observable<Match[]>;
  matchDetails$: Observable<MatchDetails[]>;
  selectedSeason: any = new Date().getFullYear();
  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private store: Store<State>
  ) {
    this.store
      .select(fromMatchReducer.getSelectedSeason)
      .subscribe((season) => {
        if (season !== null) {
          this.selectedSeason = season;
        }
      });
    this.store
      .select(fromPlayerReducer.getAvailablePlayers)
      .subscribe((data) => this.fetchTopBatsman(data));

    this.fetchPlayers();
    this.fetchMatches();
    this.fetchSeasonMatches();
    this.fetchMatchDetails();
    console.log(this.selectedSeason);
  }

  ngOnInit(): void {
    this.store.select(fromMatchReducer.getAvailableMatches);
    this.store.select(fromMatchReducer.getSelectedMatch);
    this.matchDetails$ = this.store.select(
      fromMatchDetailsReducer.getAvailableMatchDetails
    );
    this.initiateSeason();
  }

  fetchPlayers() {
    this.playerService.getPlayerMatchDetails(this.selectedSeason);
  }
  fetchTopBatsman(list: TopPlayer[]) {
    this.topBatsmanList = this.playerService
      .getTopBatsmanList(list)
      .slice(0, 5);
    this.topBowlerList = this.playerService.getTopBowlingList(list).slice(0, 5);
    this.topBowlerAvgList = this.playerService
      .getTopBowlingAvgList(list)
      .slice(0, 5);
    this.topBattingAvgList = this.playerService
      .getTopBattingAvgList(list)
      .slice(0, 5);
  }
  fetchMatches() {
    this.matchService.getMatches();
  }
  fetchSeasonMatches() {
    this.matchService.getSeasonMatches(this.selectedSeason);
  }
  fetchMatchDetails() {
    this.matchService.getMatchDetails();
  }
  fetchTeamDetails() {
    this.matchService.getTeamDetails();
  }
  selectSeason(e: any) {
    if (e.target.value === "current") {
      this.selectedSeason = new Date().getFullYear();
    } else {
      this.selectedSeason = e.target.value;
    }
    this.store.dispatch(new matchActions.SetSeason(this.selectedSeason));
    this.fetchPlayers();
    this.fetchMatches();
    this.fetchSeasonMatches();
    this.fetchMatchDetails();
    this.fetchTeamDetails();
  }
  initiateSeason() {
    this.selectedSeason = new Date().getFullYear();
    this.store.dispatch(new matchActions.SetSeason(this.selectedSeason));
    this.fetchPlayers();
    this.fetchMatches();
    this.fetchSeasonMatches();
    this.fetchMatchDetails();
    this.fetchTeamDetails();
  }
}
