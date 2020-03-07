import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlayerService } from "./player.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit, OnDestroy {
  plyrSub: Subscription[] = [];
  players = [];

  constructor(private playerService: PlayerService) {
    this.playerService
      .getPlayerMatchDetails()
      .subscribe(data => console.log(data));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.plyrSub.forEach(subs => subs.unsubscribe());
  }
}
