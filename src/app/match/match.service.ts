import { Injectable } from "@angular/core";
import { Match } from "../models/match.model";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatchDetails } from "../models/match-details.model";
import { Store } from "@ngrx/store";
import { State } from "./store/match.reducer";
import * as matchActions from "./store/match.actions";
import * as matchDetailsActions from "./store/match-details.actions";

@Injectable({
  providedIn: "root"
})
export class MatchService {
  matchesCollection: AngularFirestoreCollection<Match>;
  matchDoc: AngularFirestoreDocument<Match>;
  matches: Observable<Match[]>;
  match: Observable<Match>;
  matchDetailsCollection: AngularFirestoreCollection<MatchDetails>;
  matchDetailsDoc: AngularFirestoreDocument<MatchDetails>;
  matchDetails: Observable<MatchDetails[]>;
  matchDetail: Observable<MatchDetails>;

  constructor(private afs: AngularFirestore, private store: Store<State>) {
    this.matchesCollection = this.afs.collection("matches");
    this.matchDetailsCollection = this.afs.collection("matchDetails");
  }

  getMatches() {
    //Get Matches with ID
    this.matchesCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Match;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((matches: Match[]) => {
        this.store.dispatch(new matchActions.GetAvailableMatches(matches));
      });
  }

  getMatchDetails() {
    //Get Matches with ID
    this.matchDetailsCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Match;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((matchDetails: MatchDetails[]) => {
        this.store.dispatch(
          new matchDetailsActions.GetAvailableMatchDetails(matchDetails)
        );
      });
  }

  newMatch(match: Match) {
    this.matchesCollection.add(match);
  }
}
