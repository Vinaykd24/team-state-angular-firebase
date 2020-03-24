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
import * as fromMatchDetailsReducer from "./store/match-details.reducer";
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

  getMatchesWithId() {
    //Get Matches with ID
    return this.matchesCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Match;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
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

  getSingleMatchDetails(id: string): Observable<MatchDetails[]> {
    //Get Single Match Details
    // const matchDetails$ = this.store.select(
    //   fromMatchDetailsReducer.getAvailableMatchDetails
    // );
    // console.log(id);
    // matchDetails$.subscribe(loadedMatDetlsData => {
    //   loadedMatDetlsData
    //     .slice()
    //     .find(matchDetails => matchDetails.matchId === id);
    // });
    return this.afs
      .collection<MatchDetails>("matchDetails", ref =>
        ref.where("matchId", "==", id)
      )
      .valueChanges();
  }

  newMatch(match: Match) {
    this.matchesCollection.add(match);
  }

  newMatchDetails(matchDetails: MatchDetails[]) {
    matchDetails.map(playerDetails => {
      this.matchDetailsCollection.add(playerDetails);
    });
  }

  getMatchesByYear(year: string) {
    let query: AngularFirestoreCollection;
    if (year !== "All Years") {
      let startDate = new Date(year + "-01-01");
      let endDate = new Date(year + "-12-31");
      query = this.afs.collection<Match>("matches", ref =>
        ref.where("matchDate", ">", startDate).where("matchDate", "<", endDate)
      );
    } else {
      query = this.matchesCollection;
    }

    this.matches = query.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Match;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.matches;
  }
}
