import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Tournament } from "../models/tournament.model";
import "firebase/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TournamentService {
  tournamentsCollection: AngularFirestoreCollection<Tournament>;
  tournamentDoc: AngularFirestoreDocument<Tournament>;
  tournaments: Observable<Tournament[]>;
  tournament: Observable<Tournament>;

  constructor(private afs: AngularFirestore) {
    this.tournamentsCollection = this.afs.collection("tournaments");
  }

  getTournaments(): Observable<Tournament[]> {
    //Get tournaments with ID
    this.tournaments = this.tournamentsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Tournament;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.tournaments;
  }

  newTournament(tournament: Tournament) {
    this.tournamentsCollection.add(tournament);
  }
}
