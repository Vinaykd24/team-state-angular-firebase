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
import { Player } from "../models/player.model";
import { TopPlayer } from "../models/top-player.model";

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

  getTourMatchDetails(playerList: any, players): any {
    const result = _(playerList)
      .groupBy("playerId")
      .map((objs, key) => ({
        player: players.find(player => player.id === key),
        fifties: objs.filter(player => player.runs >= 50).length || 0,
        centuries: objs.filter(player => player.runs >= 100).length || 0,
        isOut: objs.filter(player => player.isOut).length || 0,
        totalMatches: objs.length || 0,
        totalRuns: _.sumBy(objs, "runs") || 0,
        totalBalls: _.sumBy(objs, "balls") || 0,
        totalFours: _.sumBy(objs, "fours") || 0,
        totalSixes: _.sumBy(objs, "sixes") || 0,
        totalOvers: _.sumBy(objs, "overs") || 0,
        totalMaidens: _.sumBy(objs, "maidens") || 0,
        totalRunsGiven: _.sumBy(objs, "runsGiven") || 0,
        totalWickets: _.sumBy(objs, "wickets") || 0
      }))
      .value();
    return {
      players: result,
      topRunsGetter: _.orderBy([...result], "totalRuns", "desc"),
      topWktsGetter: _.orderBy([...result], "totalWickets", "desc"),
      totalSixes: _.sumBy([...result], "totalSixes") || 0,
      totalFours: _.sumBy([...result], "totalFours") || 0
    };
  }

  getTournamentDetails() {
    return zip(
      this.getTournaments(),
      this.playerService.getPlayers(),
      this.store.select(fromMatchReducer.getAvailableMatches),
      this.store.select(fromMatchDetailsReducer.getAvailableMatchDetails)
    ).pipe(
      map(([tournaments, allPlayers, matches, matchDetails]) => {
        let transformedTournaments = [];
        _(tournaments)
          .groupBy("id")
          .map((tourObjs, tourKey) => {
            let tourMatches = [];

            let loadedMatches = matches
              .slice()
              .filter(match => match.tourId === tourKey);
            const merge = _.map(loadedMatches, "id");
            for (let i = 0; i < matchDetails.length; i++) {
              if (merge.includes(matchDetails[i].matchId)) {
                tourMatches.push(matchDetails[i]);
              }
            }
            const result = {
              tourId: tourKey,
              tourInfo: tourObjs[0],
              totalMatches: loadedMatches,
              tourDetails: this.getTourMatchDetails(tourMatches, allPlayers)
            };
            transformedTournaments.push(result);
          })
          .value();
        return transformedTournaments;
      })
    );
  }

  newTournament(tournament: Tournament) {
    this.tournamentsCollection.add(tournament);
  }
}
