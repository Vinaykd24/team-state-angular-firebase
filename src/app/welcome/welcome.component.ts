import { Component, OnInit } from "@angular/core";
import { PlayerService } from "../player/player.service";
import { Store } from "@ngrx/store";
import { State } from "../app.reducer";
import * as fromPlayerReducer from "../player/store/player.reducer";
import * as playerActions from "../player/store/player.actions";
import { TopPlayer } from "../models/top-player.model";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {
  topBatsmanList: TopPlayer[];
  topBowlerList: TopPlayer[];
  constructor(
    private playerService: PlayerService,
    private store: Store<State>
  ) {
    this.store
      .select(fromPlayerReducer.getAvailablePlayers)
      .subscribe(data => this.fetchTopBatsman(data));
    this.fetchPlayers();
  }

  ngOnInit(): void {
    console.log(this.topBatsmanList);
  }

  fetchPlayers() {
    this.playerService.getPlayerMatchDetails();
  }
  fetchTopBatsman(list: any[]) {
    this.topBatsmanList = this.playerService
      .getTopBatsmanList(list)
      .slice(0, 5);
    this.topBowlerList = this.playerService.getTopBowlingList(list).slice(0, 5);
    console.log(this.topBatsmanList);
  }
}
