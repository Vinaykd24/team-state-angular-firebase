import { Component, OnInit } from "@angular/core";
import * as fromMatchReducer from "./store/match.reducer";
import * as fromMatchDetailsReducer from "./store/match-details.reducer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Match } from "../models/match.model";
import { MatchService } from "./match.service";
import { MatchDetails } from "../models/match-details.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-match",
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.css"]
})
export class MatchComponent implements OnInit {
  matches$: Observable<Match[]>;
  matchDetails$: Observable<MatchDetails[]>;
  yearList = [
    { id: 1, year: "2020" },
    { id: 2, year: "2019" },
    { id: 3, year: "2018" },
    { id: 4, year: "2017" },
    { id: 5, year: "2016" },
    { id: 6, year: "2015" },
    { id: 7, year: "All Years" }
  ];
  selectedYear = "All Years";

  constructor(
    private store: Store<fromMatchReducer.State>,
    private matchService: MatchService,
    private router: Router
  ) {
    this.fetchMatches();
    this.fetchMatchDetails();
  }

  ngOnInit(): void {
    this.matches$ = this.store.select(fromMatchReducer.getAvailableMatches);
    this.matchDetails$ = this.store.select(
      fromMatchDetailsReducer.getAvailableMatchDetails
    );
  }

  fetchMatches() {
    this.matchService.getMatches();
  }
  fetchMatchDetails() {
    this.matchService.getMatchDetails();
  }
  clickMatchEventHandler(match: Match) {
    // this.router.navigateByUrl(`/matchDetails/${matchId}`);
    this.router.navigate(["/matchDetails", match.id], { state: match });
  }

  onYearSelection() {
    console.log(this.selectedYear);
    this.matches$ = this.matchService.getMatchesByYear(this.selectedYear);
  }
}
