import { Component, OnInit } from "@angular/core";
import { TournamentService } from "./tournament.service";
import { PlayerService } from "../player/player.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-tournament",
  templateUrl: "./tournament.component.html",
  styleUrls: ["./tournament.component.css"]
})
export class TournamentComponent implements OnInit {
  tourDetails$: any;
  constructor(
    private tourService: TournamentService,
    private playerService: PlayerService,
    private router: Router
  ) {
    // this.playerService
    //   .getTournamentDetails("ToXyObJXfL0maMnSOIE1")
    //   .subscribe(data => console.log(data));
    this.tourDetails$ = this.tourService.getTournamentDetails();
  }

  ngOnInit(): void {}

  clickTourEventHandler(selectedTour: any) {
    this.router.navigate(["/tourDetails", selectedTour.tourInfo.id], {
      state: selectedTour
    });
  }
}
