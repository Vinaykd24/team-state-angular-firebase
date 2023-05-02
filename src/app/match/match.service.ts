import { Injectable } from "@angular/core";
import { Match } from "../models/match.model";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatchDetails } from "../models/match-details.model";
import { Store } from "@ngrx/store";
import { State } from "./store/match.reducer";
import * as fromMatchDetailsReducer from "./store/match-details.reducer";
import * as matchActions from "./store/match.actions";
import * as matchDetailsActions from "./store/match-details.actions";
import { TeamDetail } from "../models/team.model";
import { MatchFixture } from "../models/match-fixture.model";

@Injectable({
  providedIn: "root",
})
export class MatchService {
  matchesCollection: AngularFirestoreCollection<Match>;
  fixturesCollection: AngularFirestoreCollection<MatchFixture>;
  matchFixtureCollection: AngularFirestoreCollection<MatchFixture>;
  matchFixtures: Observable<MatchFixture[]>;
  matchDoc: AngularFirestoreDocument<Match>;
  matches: Observable<Match[]>;
  match: Observable<Match>;
  matchDetailsCollection: AngularFirestoreCollection<MatchDetails>;
  matchDetailsDoc: AngularFirestoreDocument<MatchDetails>;
  matchDetails: Observable<MatchDetails[]>;
  matchDetail: Observable<MatchDetails>;
  teamCollection: AngularFirestoreCollection<TeamDetail>;
  teamDetailsDoc: AngularFirestoreDocument<TeamDetail>;
  teamDetails: Observable<TeamDetail>;

  constructor(private afs: AngularFirestore, private store: Store<State>) {
    this.matchesCollection = this.afs.collection("matches", (ref) =>
      ref.orderBy("matchDate", "desc")
    );
    this.fixturesCollection = this.afs.collection("fixtures", (ref) =>
      ref.orderBy("matchDate", "desc")
    );
    this.matchDetailsCollection = this.afs.collection("matchDetails");
    this.teamCollection = this.afs.collection("teamDetails", (ref) =>
      ref.orderBy("teamName")
    );
    this.teamDetailsDoc = this.afs.doc<TeamDetail>("teamDetails/teamId1");
    this.teamDetails = this.teamDetailsDoc.valueChanges();
  }
  getMatches() {
    //Get Matches with ID
    this.matchesCollection
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
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

  getMatchFixtures(): Observable<MatchFixture[]> {
    //Get tournaments with ID
    this.matchFixtures = this.fixturesCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as MatchFixture;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.matchFixtures;
  }

  getTeamDetails() {
    this.teamDetails.subscribe((teamData: TeamDetail) => {
      this.store.dispatch(new matchActions.GetTeamDetails(teamData));
    });
  }

  getMatchesWithId() {
    //Get Matches with ID
    return this.matchesCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
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
        map((actions) =>
          actions.map((a) => {
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
      .collection<MatchDetails>("matchDetails", (ref) =>
        ref.where("matchId", "==", id)
      )
      .valueChanges();
  }

  newMatch(match: Match) {
    this.matchesCollection.add(match);
  }

  newMatchFixture(matchFixture: MatchFixture): void {
    this.fixturesCollection.add(matchFixture);
  }

  newMatchDetails(matchDetails: MatchDetails[]) {
    matchDetails.map((playerDetails) => {
      this.matchDetailsCollection.add(playerDetails);
    });
  }

  getMatchesByYear(year: string) {
    let query: AngularFirestoreCollection;
    if (year !== "All Years") {
      let startDate = new Date(year + "-01-01");
      let endDate = new Date(year + "-12-31");
      query = this.afs.collection<Match>("matches", (ref) =>
        ref.where("matchDate", ">", startDate).where("matchDate", "<", endDate)
      );
    } else {
      query = this.matchesCollection;
    }

    this.matches = query.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Match;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.matches;
  }

  getCurrentSeasonMatches(year?: any) {
    let query: AngularFirestoreCollection;
    // const year = new Date().getFullYear();
    if (year !== "all") {
      let startDate = new Date(year - 1 + "-10-01");
      let endDate = new Date(year + "-06-30");
      query = this.afs.collection<Match>("matches", (ref) =>
        ref.where("matchDate", ">", startDate).where("matchDate", "<", endDate)
      );
    } else {
      query = this.matchesCollection;
    }

    this.matches = query.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Match;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.matches;
  }
  getSeasonMatches(year?: any) {
    let query: AngularFirestoreCollection;
    // const year = new Date().getFullYear();
    if (year !== "all") {
      let startDate = new Date(year - 1 + "-10-01");
      let endDate = new Date(year + "-06-30");
      query = this.afs.collection<Match>("matches", (ref) =>
        ref.where("matchDate", ">", startDate).where("matchDate", "<", endDate)
      );
    } else {
      query = this.matchesCollection;
    }

    query
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Match;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((matches: Match[]) => {
        this.store.dispatch(new matchActions.GetSelectedSeasonMatches(matches));
      });
  }
}
