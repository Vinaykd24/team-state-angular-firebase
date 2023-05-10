import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatchService } from "../match/match.service";
import { Observable } from "rxjs";
import { MatchFixture } from "../models/match-fixture.model";
import { firestore } from "firebase";
import { AngularFirestore } from "@angular/fire/firestore";
import * as fromAuthhReducer from "../auth/store/auth.reducer";
import { Store } from "@ngrx/store";
import { User } from "../models/user.model";
import * as firebase from "firebase";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "app-match-list",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class MatchListComponent implements OnInit {
  expandedElement: MatchFixture | null;
  dataSource: MatTableDataSource<MatchFixture>;
  displayedColumns: string[] = [
    "matchDate",
    "matchVenue",
    "matchTime",
    "availability",
  ];
  @ViewChild(MatSort) sort: MatSort;

  matchFixtures$: Observable<MatchFixture[]>;
  user: User;
  columnsToDisplay = [
    "matchDate",
    "opponentTeamVenue",
    "matchVenue",
    "matchTime",
    "availability",
  ];
  constructor(
    private matchService: MatchService,
    private firestore: AngularFirestore,
    private store: Store<fromAuthhReducer.State>
  ) {}

  ngOnInit(): void {
    this.matchFixtures$ = this.matchService.getMatchFixtures();
    this.matchService.getMatchFixtures().subscribe((matchFixtures) => {
      const updatedList = this.transformMatchData(matchFixtures);

      this.dataSource = new MatTableDataSource(updatedList);
      this.dataSource.sort = this.sort;
    });
    this.store
      .select(fromAuthhReducer.getUser)
      .subscribe((user) => (this.user = user));
  }
  transformMatchData(matchFixtures: MatchFixture[]): Array<MatchFixture> {
    const a = matchFixtures.map((match) => {
      if (match.matchTime === "afternoon") {
        return { ...match, matchTime: "12:00 PM" };
      } else if (match.matchTime === "morning") {
        return { ...match, matchTime: "7:00 AM" };
      } else {
        return match;
      }
    });
    return a;
  }

  updateAvailability(matchFixture: MatchFixture, isAvailable: boolean): void {
    const matchId = matchFixture.id; // Replace with the actual match ID
    // const playerId = 'your_player_id_here'; // Replace with the actual player ID
    if (this.user) {
      if (isAvailable) {
        this.firestore
          .collection<MatchFixture>("fixtures")
          .doc(matchId)
          .update({
            playersAvailable: firebase.firestore.FieldValue.arrayUnion(
              this.user.displayName
            ),
            playersUnavailable: firebase.firestore.FieldValue.arrayRemove(
              this.user.displayName
            ),
          });
      } else if (!isAvailable) {
        this.firestore
          .collection<MatchFixture>("fixtures")
          .doc(matchId)
          .update({
            playersAvailable: firebase.firestore.FieldValue.arrayRemove(
              this.user.displayName
            ),
            playersUnavailable: firebase.firestore.FieldValue.arrayUnion(
              this.user.displayName
            ),
          });
      }
    }
  }

  toDateTime(timestamp: firebase.firestore.Timestamp): Date {
    return timestamp.toDate();
  }
}
