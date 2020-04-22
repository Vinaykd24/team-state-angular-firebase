import { Component, OnInit } from "@angular/core";
import { PlayerService } from "src/app/player/player.service";
import { TopPlayer } from "src/app/models/top-player.model";
import { Store } from "@ngrx/store";
import { State } from "src/app/app.reducer";
import * as fromPlayerReducer from "../../player/store/player.reducer";
import * as fromMatchReducer from "../../match/store/match.reducer";
import * as matchActions from "../../match/store/match.actions";
import { Observable } from "rxjs";
import * as _ from "lodash";

@Component({
  selector: "app-tournament-stats",
  templateUrl: "./tournament-stats.component.html",
  styleUrls: ["./tournament-stats.component.scss"],
})
export class TournamentStatsComponent implements OnInit {
  topBatsman: TopPlayer;
  topBowler: TopPlayer;
  topSixHitter: TopPlayer;
  data: any;
  players: any;
  selectedSeason: any = new Date().getFullYear();
  constructor(
    private playerService: PlayerService,
    private store: Store<State>
  ) {
    this.store
      .select(fromMatchReducer.getSelectedSeason)
      .subscribe((season) => {
        if (season !== null) {
          this.selectedSeason = season;
        }
      });
  }

  ngOnInit(): void {
    this.store
      .select(fromPlayerReducer.getAvailablePlayers)
      .subscribe((data) => {
        this.topBatsman = _.orderBy(data, ["totalRuns"], ["desc"])[0];
        this.topBowler = _.orderBy(data, ["totalWickets"], ["desc"])[0];
        this.topSixHitter = _.orderBy(data, ["totalSixes"], ["desc"])[0];
      });
    this.store.select(fromMatchReducer.getSelectedMatch);
    // this.fetchPlayers();
    this.store
      .select(fromMatchReducer.getSelectedSeason)
      .subscribe((season) => {
        this.playerService
          .getTourDetails(this.selectedSeason)
          .subscribe((data) => (this.data = data));
      });
  }

  // fetchPlayers() {
  //   this.playerService.getPlayerMatchDetails();
  // }
}
