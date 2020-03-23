import { Component, OnInit, OnDestroy } from "@angular/core";
import { Tournament } from "src/app/models/tournament.model";
import { TournamentService } from "src/app/tournament/tournament.service";
import { Player } from "src/app/models/player.model";
import { PlayerService } from "src/app/player/player.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Match } from "src/app/models/match.model";
import { MatchService } from "../match.service";

@Component({
  selector: "app-add-match",
  templateUrl: "./add-match.component.html",
  styleUrls: ["./add-match.component.css"]
})
export class AddMatchComponent implements OnInit, OnDestroy {
  private subcription: Subscription = new Subscription();
  tournametList: Tournament[] = [];
  playerList: Player[] = [];
  constructor(
    private tournamentService: TournamentService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private router: Router
  ) {
    this.subcription.add(
      this.tournamentService
        .getTournaments()
        .subscribe(data => (this.tournametList = data))
    );
    this.subcription.add(
      this.playerService
        .getPlayers()
        .subscribe(data => (this.playerList = data))
    );
  }

  ngOnInit(): void {}

  onSubmit({ value, valid }: { value: Match; valid: boolean }) {
    this.matchService.newMatch(value);
    this.router.navigate(["/add-match-details"]);
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}
