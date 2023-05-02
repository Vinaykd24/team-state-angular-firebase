import { Component, OnInit, OnDestroy } from "@angular/core";
import { Tournament } from "src/app/models/tournament.model";
import { TournamentService } from "src/app/tournament/tournament.service";
import { Player } from "src/app/models/player.model";
import { PlayerService } from "src/app/player/player.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Match } from "src/app/models/match.model";
import { MatchService } from "../match.service";
import { MatchFixture } from "src/app/models/match-fixture.model";

@Component({
  selector: "app-add-match-fixture",
  templateUrl: "./add-match-fixture.component.html",
  styleUrls: ["./add-match-fixture.component.css"],
})
export class AddMatchFixtureComponent implements OnInit, OnDestroy {
  private subcription: Subscription = new Subscription();
  tournametList: Tournament[] = [];
  playerList: Player[] = [];
  optionList = [
    {
      name: "Morning Game",
      value: "morning",
    },
    {
      name: "Afternoo Game",
      value: "afternoon",
    },
  ];
  constructor(
    private tournamentService: TournamentService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private router: Router
  ) {
    this.subcription.add(
      this.tournamentService
        .getTournaments()
        .subscribe((data) => (this.tournametList = data))
    );
    this.subcription.add(
      this.playerService
        .getPlayers()
        .subscribe((data) => (this.playerList = data))
    );
  }

  ngOnInit(): void {}

  onSubmit({ value, valid }: { value: MatchFixture; valid: boolean }) {
    console.log(value);

    this.matchService.newMatchFixture(value);
    value.matchDate = "";
    value.matchVenue = "";
    value.opTeam = "";
    value.tourId = "";
    // this.router.navigate(["/add-match-details"]);
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}
