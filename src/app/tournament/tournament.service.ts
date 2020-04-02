import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Observable, zip, combineLatest } from "rxjs";
import * as _ from "lodash";
import { Tournament } from "../models/tournament.model";
import "firebase/firestore";
import { map } from "rxjs/operators";
import { MatchService } from "../match/match.service";
import { Store } from "@ngrx/store";
import { State } from "../app.reducer";
import * as fromMatchDetailsReducer from "../match/store/match-details.reducer";
import * as fromMatchReducer from "../match/store/match.reducer";
import * as fromPlayerReducer from "../player/store/player.reducer";
import { MatchDetails } from "../models/match-details.model";
import { Match } from "../models/match.model";
import { PlayerService } from "../player/player.service";

@Injectable({
  providedIn: "root"
})
export class TournamentService {
  tournamentsCollection: AngularFirestoreCollection<Tournament>;
  tournamentDoc: AngularFirestoreDocument<Tournament>;
  tournaments: Observable<Tournament[]>;
  tournament: Observable<Tournament>;

  constructor(
    private afs: AngularFirestore,
    private matchService: MatchService,
    private playerService: PlayerService,
    private store: Store<State>
  ) {
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

  getTournamentDetails(id: string) {
    return zip(
      this.store.select(fromMatchReducer.getAvailableMatches),
      this.store.select(fromMatchDetailsReducer.getAvailableMatchDetails)
    ).pipe(
      map(([matches, matchDetails]) => {
        let loadedMatches = matches
          .slice()
          .filter(match => match.tourId === id);
        return loadedMatches.map(data => {
          let tourMatches = matchDetails.filter(
            _data => _data.matchId === data.id
          );
          return {
            ...data,
            tour: matchDetails.filter(_data => _data.matchId === data.id)
          };
        });
      })
    );
  }

  newTournament(tournament: Tournament) {
    this.tournamentsCollection.add(tournament);
  }
}
