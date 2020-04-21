import { Component, OnInit, Input } from "@angular/core";
import { TopPlayer } from "src/app/models/top-player.model";

@Component({
  selector: "app-player-stats",
  templateUrl: "./player-stats.component.html",
  styleUrls: ["./player-stats.component.css"],
})
export class PlayerStatsComponent implements OnInit {
  @Input() player: TopPlayer;

  constructor() {}

  ngOnInit(): void {}

  convertToBalls(overs: any) {
    overs = overs.toFixed(2);
    const _over = overs.toString().split(".")[0];
    const _balls = overs.toString().split(".")[1];
    return Number(_over) * 6 + Number(_balls);
  }

  getBattingStrikeRate(player: TopPlayer) {
    if (player.totalRuns === 0) {
      return "-";
    } else {
      return ((player.totalRuns * 100) / player.totalBalls).toFixed(2) || 0;
    }
  }
  getBowlingStrikeRate(player: TopPlayer) {
    if (
      (player.totalOvers === 0 && player.totalWickets === 0) ||
      (player.totalOvers > 0 && player.totalWickets === 0)
    ) {
      return "-";
    } else {
      const convertOversToBalls = this.convertToBalls(player.totalOvers);
      return (convertOversToBalls / player.totalWickets).toFixed(2) || 0;
    }
  }
  getBattingAvg(player: TopPlayer) {
    if (player.totalRuns === 0) {
      return "-";
    } else {
      return (player.totalRuns / player.isOut).toFixed(2) || 0;
    }
  }
  getBowlingAvg(player: TopPlayer) {
    if (
      (player.totalOvers === 0 && player.totalWickets === 0) ||
      (player.totalOvers > 0 && player.totalWickets === 0)
    ) {
      return "-";
    } else {
      return (player.totalRunsGiven / player.totalWickets).toFixed(2) || 0;
    }
  }
  getBowlingEco(player: TopPlayer) {
    if (player.totalRunsGiven === 0 && player.totalWickets === 0) {
      return "-";
    } else {
      return (player.totalRunsGiven / player.totalOvers).toFixed(2) || 0;
    }
  }
}
