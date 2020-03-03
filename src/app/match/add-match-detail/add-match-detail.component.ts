import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlayerService } from "src/app/player/player.service";
import { MatchService } from "../match.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Match } from "src/app/models/match.model";
import { Player } from "src/app/models/player.model";

@Component({
  selector: "app-add-match-detail",
  templateUrl: "./add-match-detail.component.html",
  styleUrls: ["./add-match-detail.component.css"]
})
export class AddMatchDetailComponent implements OnInit, OnDestroy {
  private subcription: Subscription = new Subscription();
  matchtesList: Match[] = [];
  playerList: Player[] = [];

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private router: Router
  ) {
    this.subcription.add(
      this.playerService
        .getPlayers()
        .subscribe(players => (this.playerList = players))
    );
    this.subcription.add(
      this.matchService
        .getMatches()
        .subscribe(matches => (this.matchtesList = matches))
    );
  }

  ngOnInit(): void {}
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit({ value, valid }: { value: Match; valid: boolean }) {
    this.matchService.newMatch(value);
    this.router.navigate(["/matchDetails"]);
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}
