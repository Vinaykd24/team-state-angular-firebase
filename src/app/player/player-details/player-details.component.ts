import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { State } from "../../app.reducer";
import * as fromPlayerReducer from "../../player/store/player.reducer";
import { Observable } from "rxjs";
import { TopPlayer } from "src/app/models/top-player.model";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"]
})
export class PlayerDetailsComponent implements OnInit {
  player: TopPlayer;
  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store
      .select(fromPlayerReducer.getSelectedPlayer)
      .subscribe(loadedPlayer => (this.player = loadedPlayer));
  }
}
