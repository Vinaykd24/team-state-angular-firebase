import { Component, OnInit, Input } from "@angular/core";
import { TopPlayer } from "src/app/models/top-player.model";

@Component({
  selector: "app-player-stats",
  templateUrl: "./player-stats.component.html",
  styleUrls: ["./player-stats.component.css"]
})
export class PlayerStatsComponent implements OnInit {
  @Input() player: TopPlayer;

  constructor() {}

  ngOnInit(): void {}

  getBattingStrikeRate(player: TopPlayer) {
    return ((player.totalRuns * 100) / player.totalBalls).toFixed(2) || 0;
  }
  getBowlingStrikeRate(player: TopPlayer) {
    return ((player.totalBalls * 6) / player.totalWickets).toFixed(2) || 0;
  }
  getBattingAvg(player: TopPlayer) {
    return (player.totalRuns / player.isOut).toFixed(2) || 0;
  }
  getBowlingAvg(player: TopPlayer) {
    return (player.totalRunsGiven / player.totalWickets).toFixed(2) || 0;
  }
  getBowlingEco(player: TopPlayer) {
    return (player.totalRunsGiven / player.totalOvers).toFixed(2) || 0;
  }
}
