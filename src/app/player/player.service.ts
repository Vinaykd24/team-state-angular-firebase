import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Player } from "../models/player.model";
import { Observable, combineLatest, zip } from "rxjs";
import { map } from "rxjs/operators";
import "firebase/firestore";
import * as _ from "lodash";
import { TopPlayer } from "../models/top-player.model";
import { MatchService } from "../match/match.service";
@Injectable()
export class PlayerService {
  playersCollection: AngularFirestoreCollection<Player>;
  playerDoc: AngularFirestoreDocument<Player>;
  players: Observable<Player[]>;
  player: Observable<Player>;
  playerMatchDetails$: Observable<any[]>;

  constructor(
    private afs: AngularFirestore,
    private matchService: MatchService
  ) {
    this.playersCollection = this.afs.collection("players");
  }

  getPlayers(): Observable<Player[]> {
    //Get players with ID
    this.players = this.playersCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Player;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.players;
  }

  newPlayer(player: Player) {
    this.playersCollection.add(player);
  }

  getPlayerMatchDetails(): Observable<TopPlayer[]> {
    this.playerMatchDetails$ = zip(
      this.getPlayers(),
      this.matchService.getMatchDetails()
    ).pipe(
      map(([players, matchDetails]) => {
        const result = _(matchDetails)
          .groupBy("playerId")
          .map((objs, key) => ({
            player: players.find(player => player.id === key),
            fifties: objs.filter(player => player.runs >= 50).length || 0,
            centuries: objs.filter(player => player.runs >= 100).length || 0,
            isOut: objs.filter(player => player.isOut).length || 0,
            bestScore: 0,
            bestBowling: 0,
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
        return result;
      })
    );
    return this.playerMatchDetails$;
  }
}
