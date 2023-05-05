import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "../../app.reducer";
import * as fromPlayerReducer from "../../player/store/player.reducer";
import { Observable } from "rxjs";
import { TopPlayer } from "src/app/models/top-player.model";
import { PlayerService } from "../player.service";
import { MatchDetails } from "src/app/models/match-details.model";
import { Chart } from "angular-highcharts";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
})
export class PlayerDetailsComponent implements OnInit, AfterViewInit {
  player: TopPlayer;
  playerId: string;
  playerPerformance$: Observable<MatchDetails[]>;
  playerPerformanceDetails: MatchDetails[];
  chart: Chart;
  _data: any;
  constructor(
    private store: Store<State>,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
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
    this.playerPerformance$.subscribe(
      (data) => (this.playerPerformanceDetails = data)
    );
  }

  ngAfterViewInit() {
    if (this.playerPerformanceDetails) {
      this.chart = new Chart({
        chart: {
          type: "xy",
        },
        title: {
          text: `${this.player.player.playerFirstName}'s Bowlling Graph`,
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          title: {
            text: "Wickets/Runs",
          },
        },
        xAxis: {
          title: {
            text: "Total Matches",
          },
        },
        series: [
          {
            name: "Wickets Taken",
            type: "column",
            data: this.playerPerformanceDetails.map((item) =>
              item.wickets ? item.wickets : 0
            ),
          } as any,
          {
            name: "Runs Given",
            type: "column",
            data: this.playerPerformanceDetails.map((item) =>
              item.runsGiven ? item.runsGiven : 0
            ),
          } as any,
          {
            name: "Bowling Economy",
            type: "spline",
            data: this.playerPerformanceDetails.map(
              (item) => item.runsGiven / item.overs
            ),
          } as any,
        ],
      });
      this.cdr.detectChanges();
    }
  }
}
