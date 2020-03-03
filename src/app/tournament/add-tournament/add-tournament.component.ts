import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/tournament.model";
import { TournamentService } from "../tournament.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-tournament",
  templateUrl: "./add-tournament.component.html",
  styleUrls: ["./add-tournament.component.css"]
})
export class AddTournamentComponent implements OnInit {
  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  onSubmit({ value, valid }: { value: Tournament; valid: boolean }) {
    this.tournamentService.newTournament(value);
    this.router.navigate(["/"]);
  }
}
