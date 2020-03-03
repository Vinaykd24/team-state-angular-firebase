import { Injectable } from "@angular/core";
import { Match } from "../models/match.model";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MatchService {
  matchesCollection: AngularFirestoreCollection<Match>;
  matchDoc: AngularFirestoreDocument<Match>;
  matches: Observable<Match[]>;
  match: Observable<Match>;

  constructor(private afs: AngularFirestore) {
    this.matchesCollection = this.afs.collection("players");
  }

  getMatches(): Observable<Match[]> {
    //Get Matches with ID
    this.matches = this.matchesCollection.snapshotChanges().pipe(
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

  newMatch(match: Match) {
    this.matchesCollection.add(match);
  }
}
