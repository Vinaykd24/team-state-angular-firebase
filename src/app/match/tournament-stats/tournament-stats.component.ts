import { Component, OnInit, Input } from "@angular/core";
import { PlayerService } from "src/app/player/player.service";
import { TopPlayer } from "src/app/models/top-player.model";
import { Store } from "@ngrx/store";
import { State } from "src/app/app.reducer";
import * as fromPlayerReducer from "../../player/store/player.reducer";
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
  constructor(
    private playerService: PlayerService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.store
      .select(fromPlayerReducer.getAvailablePlayers)
      .subscribe((data) => {
        this.topBatsman = _.orderBy(data, ["totalRuns"], ["desc"])[0];
        this.topBowler = _.orderBy(data, ["totalWickets"], ["desc"])[0];
        this.topSixHitter = _.orderBy(data, ["totalSixes"], ["desc"])[0];
      });
    this.fetchPlayers();
    this.playerService.getTourDetails().subscribe((data) => (this.data = data));
  }

  fetchPlayers() {
    this.playerService.getPlayerMatchDetails();
  }
}
