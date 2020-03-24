import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlayerService } from "src/app/player/player.service";
import { MatchService } from "../match.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Match } from "src/app/models/match.model";
import { Player } from "src/app/models/player.model";
import { Store } from "@ngrx/store";
import { State } from "src/app/app.reducer";
import * as fromMatchReducer from "../store/match.reducer";
import { MatchDetails } from "src/app/models/match-details.model";
import { NgForm } from "@angular/forms";
import * as _ from "lodash";

@Component({
  selector: "app-add-match-detail",
  templateUrl: "./add-match-detail.component.html",
  styleUrls: ["./add-match-detail.component.css"]
})
export class AddMatchDetailComponent implements OnInit, OnDestroy {
  private subcription: Subscription = new Subscription();
  matchtesList: Match[] = [];
  playerList: Player[] = [];
  isMatchSelected: boolean = false;
  _matchId: string;
  tempMatchDetails: MatchDetails[] = [];

  constructor(
    private playerService: PlayerService,
    private matchService: MatchService,
    private router: Router,
    private store: Store<State>
  ) {
    this.subcription.add(
      this.playerService
        .getPlayers()
        .subscribe(players => (this.playerList = players))
    );
    // this.subcription.add(
    //   this.matchService
    //     .getMatches()
    //     .subscribe(matches => (this.matchtesList = matches))
    // );
    this.store
      .select(fromMatchReducer.getAvailableMatches)
      .subscribe(matches => (this.matchtesList = matches));
  }

  ngOnInit(): void {}
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
    if (this.step === 2) {
      const result = _(this.tempMatchDetails)
        .groupBy("playerId")
        .map(g =>
          _.mergeWith({}, ...g, (obj, src) =>
            _.isArray(obj) ? obj.concat(src) : undefined
          )
        )
        .value();
      this.tempMatchDetails = result;
    }
  }

  prevStep() {
    this.step--;
  }

  onSubmit({ value, valid }: { value: MatchDetails; valid: boolean }) {
    // value.matchId = this._matchId;
    this.tempMatchDetails = this.tempMatchDetails.filter(
      player => player.playerId !== undefined
    );
    console.log(this.tempMatchDetails);
    this.matchService.newMatchDetails(this.tempMatchDetails);
    this.tempMatchDetails = [];
    this.isMatchSelected = false;
    this.router.navigate(["/matches"]);
  }
  onBattingSubmit(battingForm: NgForm) {
    let battingData: MatchDetails = {};
    battingData.matchId = this._matchId;
    battingData.playerFirstName = battingForm.value.playerId.playerFirstName;
    battingData.playerLastName = battingForm.value.playerId.playerLastName;
    battingData.playerId = battingForm.value.playerId.id;
    battingData.runs = battingForm.value.runs;
    battingData.balls = battingForm.value.balls;
    battingData.fours = battingForm.value.fours;
    battingData.sixes = battingForm.value.sixes;
    battingData.isOut =
      battingForm.value.isOut === null ? false : battingForm.value.isOut;
    // this.matchService.newMatchDetails(value);
    // this.router.navigate(["/matchDetails"]);

    this.tempMatchDetails.push(battingData);
    battingForm.resetForm();
  }
  onBowlingSubmit(bowlingForm: NgForm) {
    let bowlingData: MatchDetails = {};
    bowlingData.matchId = this._matchId;
    bowlingData.playerFirstName = bowlingForm.value.playerId.playerFirstName;
    bowlingData.playerLastName = bowlingForm.value.playerId.playerLastName;
    bowlingData.playerId = bowlingForm.value.playerId.id;
    bowlingData.overs = bowlingForm.value.overs;
    bowlingData.maidens = bowlingForm.value.maidens;
    bowlingData.runsGiven = bowlingForm.value.runsGiven;
    bowlingData.wickets = bowlingForm.value.wickets;
    // this.matchService.newMatchDetails(value);
    // this.router.navigate(["/matchDetails"]);
    this.tempMatchDetails.push(bowlingData);
    bowlingForm.resetForm();
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
    this.tempMatchDetails = [];
  }

  selectMatch(event) {
    this.isMatchSelected = true;
    this._matchId = event.value;
    console.log(event.value);
  }
}
