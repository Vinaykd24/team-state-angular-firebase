import { Component, OnInit } from "@angular/core";
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

export interface Match {
  title: string;
  date: Date;
  location: string;
  isAvailable: boolean;
}
selectedDate: Date;

@Component({
  selector: "app-match-list",
  templateUrl: "./calendar.component.html",
  styles: [
    `
      .example-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
      }
      .example-full-width {
        width: 100%;
      }
    `,
  ],
})
export class MatchListComponent implements OnInit {
  matchFixtures$: Observable<MatchFixture[]>;
  user: User;
  constructor(
    private matchService: MatchService,
    private firestore: AngularFirestore,
    private store: Store<fromAuthhReducer.State>
  ) {}

  ngOnInit(): void {
    this.matchFixtures$ = this.matchService.getMatchFixtures();
    this.store
      .select(fromAuthhReducer.getUser)
      .subscribe((user) => (this.user = user));
  }

  matches: Match[] = [
    {
      title: "Match 1",
      date: new Date("2023-05-01T14:30:00Z"),
      location: "Stadium A",
      isAvailable: false,
    },
    {
      title: "Match 2",
      date: new Date("2023-05-05T19:00:00Z"),
      location: "Stadium B",
      isAvailable: false,
    },
    {
      title: "Match 3",
      date: new Date("2023-05-10T18:00:00Z"),
      location: "Stadium C",
      isAvailable: false,
    },
  ];

  submitAvailability(value: boolean, match) {
    alert("Availability submitted!");
  }

  updateAvailability(matchFixture: MatchFixture): void {
    const matchId = matchFixture.id; // Replace with the actual match ID
    // const playerId = 'your_player_id_here'; // Replace with the actual player ID
    if (this.user) {
      this.firestore
        .collection<Match>("fixtures")
        .doc(matchId)
        .update({
          playersAvailable: firebase.firestore.FieldValue.arrayUnion(
            this.user.displayName
          ),
        });
    }
  }

  toDateTime(timestamp: firebase.firestore.Timestamp): Date {
    return timestamp.toDate();
  }
}
