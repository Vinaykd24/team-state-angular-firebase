import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/models/tournament.model";
import { TournamentService } from "../tournament.service";
import { Router } from "@angular/router";
import { Season } from "src/app/models/season.model";

@Component({
  selector: "app-add-tournament",
  templateUrl: "./add-tournament.component.html",
  styleUrls: ["./add-tournament.component.css"],
})
export class AddTournamentComponent implements OnInit {
  seasons: Array<Season>;
  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.seasons = this.createSeason();
  }
  onSubmit({ value, valid }: { value: Tournament; valid: boolean }) {
    value.isWon = value.isWon !== true ? false : true;
    this.tournamentService.newTournament(value);
    this.router.navigate(["/add-match"]);
  }

  createSeason(): Season[] {
    const currentYear = new Date().getFullYear();
    const seasons: Array<Season> = [];
    for (let i = 0; i < 7; i++) {
      const year = currentYear - i;
      const value = `${year}-${(year + 1).toString().substr(-2)}`;
      seasons.push({ id: (i + 1).toString(), value });
    }
    return seasons;
  }
}
