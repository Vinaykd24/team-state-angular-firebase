import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/tournament.model";
import { TournamentService } from "../tournament.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-tournament",
  templateUrl: "./add-tournament.component.html",
  styleUrls: ["./add-tournament.component.css"],
})
export class AddTournamentComponent implements OnInit {
  seasons = [
    { id: "1", value: "2019-20" },
    { id: "2", value: "2018-19" },
    { id: "3", value: "2017-18" },
    { id: "4", value: "2016-17" },
    { id: "5", value: "2015-16" },
    { id: "6", value: "2014-15" },
    { id: "7", value: "2013-14" },
  ];
  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  onSubmit({ value, valid }: { value: Tournament; valid: boolean }) {
    value.isWon = value.isWon !== true ? false : true;
    this.tournamentService.newTournament(value);
    this.router.navigate(["/add-match"]);
  }
}
