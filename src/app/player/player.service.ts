import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";
import { Player } from "../models/player.model";
import { Observable, combineLatest, zip, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import "firebase/firestore";
import * as _ from "lodash";
import { TopPlayer } from "../models/top-player.model";
import { MatchService } from "../match/match.service";
import { MatchDetails } from "../models/match-details.model";
import { Store } from "@ngrx/store";
import { State } from "./store/player.reducer";
import * as playerActions from "./store/player.actions";
import * as fromMatchDetails from "../match/store/match-details.reducer";
@Injectable()
export class PlayerService {
  playersCollection: AngularFirestoreCollection<Player>;
  playerDoc: AngularFirestoreDocument<Player>;
  players: Observable<Player[]>;
  player: Observable<Player>;
  playerMatchDetails$: Observable<TopPlayer[]>;
  private playerSubs: Subscription[] = [];

  constructor(
    private afs: AngularFirestore,
    private matchService: MatchService,
    private store: Store<State>
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

  getBestScore(playerList: MatchDetails[]): number {
    return (playerList = [...playerList].sort((runs1, runs2) => {
      if (runs1.runs > runs2.runs) return -1;
      if (runs1.runs < runs2.runs) return 1;
    }))[0].runs;
  }

  getBestBowling(playerList: MatchDetails[]): number {
    return (playerList = [...playerList].sort((wickets1, wickets2) => {
      if (wickets1.wickets > wickets2.wickets) return -1;
      if (wickets1.wickets < wickets2.wickets) return 1;
    }))[0].wickets;
  }

  getPlayerMatchDetails() {
    const matchDetails$ = this.store.select(
      fromMatchDetails.getAvailableMatchDetails
    );
    zip(
      this.getPlayers(),
      this.afs.collection<MatchDetails>("matchDetails").valueChanges()
    )
      .pipe(
        map(([players, matchDetails]) => {
          const result = _(matchDetails)
            .groupBy("playerId")
            .map((objs, key) => ({
              player: players.find(player => player.id === key),
              fifties: objs.filter(player => player.runs >= 50).length || 0,
              centuries: objs.filter(player => player.runs >= 100).length || 0,
              isOut: objs.filter(player => player.isOut).length || 0,
              bestScore: this.getBestScore(objs) || 0,
              bestBowling: this.getBestBowling(objs) || 0,
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
      )
      .subscribe(
        (players: TopPlayer[]) => {
          this.store.dispatch(new playerActions.GetAvailablePlayers(players));
        },
        error => {
          console.log("Error while loading the players");
        }
      );
  }

  getSinglePlayerDetails(id: string) {
    this.store.dispatch(new playerActions.GetSelectedPlayer(id));
  }
}
