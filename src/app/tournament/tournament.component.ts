import { Component, OnInit } from "@angular/core";
import { TournamentService } from "./tournament.service";
import { PlayerService } from "../player/player.service";

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.css"]
})
export class TournamentComponent implements OnInit {
  constructor(
    private tourService: TournamentService,
    private playerService: PlayerService
  ) {
    this.playerService
      .getTournamentDetails("ToXyObJXfL0maMnSOIE1")
      .subscribe(data => console.log(data));
  }

  ngOnInit(): void {}
}
