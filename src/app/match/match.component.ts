import { Component, OnInit } from "@angular/core";
import * as fromMatchReducer from "./store/match.reducer";
import * as fromMatchDetailsReducer from "./store/match-details.reducer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Match } from "../models/match.model";
import { MatchService } from "./match.service";
import { MatchDetails } from "../models/match-details.model";

@Component({
  selector: "app-match",
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.css"]
})
export class MatchComponent implements OnInit {
  matches$: Observable<Match[]>;
  matchDetails$: Observable<MatchDetails[]>;

  constructor(
    private store: Store<fromMatchReducer.State>,
    private matchService: MatchService
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
}
