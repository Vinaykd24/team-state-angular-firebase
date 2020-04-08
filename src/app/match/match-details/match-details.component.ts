import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatchService } from "../match.service";
import { MatchDetails } from "src/app/models/match-details.model";
import { Observable } from "rxjs";
import { Match } from "src/app/models/match.model";

@Component({
  selector: "app-match-details",
  templateUrl: "./match-details.component.html",
  styleUrls: ["./match-details.component.css"],
})
export class MatchDetailsComponent implements OnInit {
  matchDetails: MatchDetails[];
  battingDetails: MatchDetails[];
  bowlingDetails: MatchDetails[];
  selectedMatch: Match;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService
  ) {
    this.route.data.subscribe((data) => {
      this.matchDetails = data.matchDetails;
    });
    this.selectedMatch = history.state;
    this.battingDetails = this.matchDetails.filter(
      (player) => player.balls > 0
    );
    this.bowlingDetails = this.matchDetails.filter(
      (player) => player.overs > 0
    );
  }

  ngOnInit(): void {}
}
