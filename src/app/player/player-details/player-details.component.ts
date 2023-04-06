import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Chart } from "angular-highcharts";
import { State } from "../../app.reducer";
import * as fromPlayerReducer from "../../player/store/player.reducer";
import { Observable } from "rxjs";
import { TopPlayer } from "src/app/models/top-player.model";
import { PlayerService } from "../player.service";
import { MatchDetails } from "src/app/models/match-details.model";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
})
export class PlayerDetailsComponent implements OnInit {
  player: TopPlayer;
  playerId: string;
  playerPerformance$: Observable<MatchDetails[]>;
  playerPerformanceDetails: MatchDetails[];
  _data: any;
  allWkts = [];
  constructor(
    private store: Store<State>,
    private playerService: PlayerService
  ) {
    this.store
      .select(fromPlayerReducer.getSelectedPlayer)
      .subscribe((loadedPlayer) => {
        this.player = loadedPlayer;
        this.playerPerformance$ =
          this.playerService.getSelectedPlayerPerformance(
            loadedPlayer.player.id
          );
      });
  }

  ngOnInit(): void {
    this.playerPerformance$.subscribe((data) => {
      this.playerPerformanceDetails = data;
      this.allWkts = data?.map((item) => item.wickets);
      console.log("Player Details ", this.allWkts);
    });
  }
  chart = new Chart({
    chart: {
      type: "line",
    },
    title: {
      text: "Linechart",
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: "Line 1",
        data: this.allWkts,
      } as any,
    ],
  });
}
