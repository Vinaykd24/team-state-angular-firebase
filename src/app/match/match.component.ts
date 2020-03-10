import { Component, OnInit } from "@angular/core";
import * as fromMatchReducer from "./store/match.reducer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Match } from "../models/match.model";
import { MatchService } from "./match.service";

@Component({
  selector: "app-match",
  templateUrl: "./match.component.html",
  styleUrls: ["./match.component.css"]
})
export class MatchComponent implements OnInit {
  matches$: Observable<Match[]>;

  constructor(
    private store: Store<fromMatchReducer.State>,
    private matchService: MatchService
  ) {}

  ngOnInit(): void {
    this.matches$ = this.store.select(fromMatchReducer.getAvailableMatches);
    this.fetchMatches();
  }

  fetchMatches() {
    this.matchService.getMatches();
  }
}
