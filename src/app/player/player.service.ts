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
import * as fromPlayerReducer from "./store/player.reducer";
import * as fromMatchDetails from "../match/store/match-details.reducer";
import { Match } from "../models/match.model";
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
    this.playersCollection = this.afs.collection("players", ref =>
      ref.orderBy("playerFirstName", "desc")
    );
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

  getBestScore(playerList: any[]) {
    return (playerList = [...playerList].sort((runs1, runs2) => {
      if (runs1.runs > runs2.runs) return -1;
      if (runs1.runs < runs2.runs) return 1;
    }));
  }

  getBestBowling(playerList: any[]) {
    return (playerList = [...playerList].sort((wickets1, wickets2) => {
      if (wickets1.wickets > wickets2.wickets) return -1;
      if (wickets1.wickets < wickets2.wickets) return 1;
    }));
  }

  getPlayerMatchDetails() {
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
              bestScore: this.getBestScore(objs)[0].runs || 0,
              bestBowling: this.getBestBowling(objs)[0].wickets || 0,
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
  getTourDetails() {
    return zip(
      this.afs.collection<MatchDetails>("matchDetails").valueChanges(),
      this.afs
        .collection<MatchDetails>("matchDetails", ref =>
          ref.orderBy("wickets", "desc")
        )
        .valueChanges(),
      this.afs.collection<Match>("matches").valueChanges()
    ).pipe(
      map(([matchDetails, topWkts, matches]) => {
        const result = _(matchDetails)
          .groupBy("id")
          .map((objs, key) => ({
            topRunsGetter: this.getBestScore(objs)[0],
            topWktsGetter: topWkts[0],
            topInng: _.orderBy(matches, ["homeTeamScore"], ["desc"])[0], // Use Lodash to sort array by 'name'
            fifties: objs.filter(player => player.runs >= 50).length || 0,
            centuries: objs.filter(player => player.runs >= 100).length || 0,
            winPercentage: this.calculateWinningPercentage(matches) || 0,
            totalRuns: _.sumBy(objs, "runs") || 0,
            totalFours: _.sumBy(objs, "fours") || 0,
            totalSixes: _.sumBy(objs, "sixes") || 0,
            totalWickets: _.sumBy(objs, "wickets") || 0
          }))
          .value();
        return result[0];
      })
    );
  }

  calculateWinningPercentage(matches: Match[]): string {
    const totalMatches = matches.length;
    const totalWins =
      matches.filter(match => match.homeTeamWon === true).length || 0;
    return ((totalWins / totalMatches) * 100).toFixed(2);
  }

  getSinglePlayerDetails(id: string) {
    this.store.dispatch(new playerActions.GetSelectedPlayer(id));
  }

  getSelectedPlayerPerformance(id: string) {
    // this.store.dispatch(
    //   new matchDetailsActions.GetSelectedPlayerPerformance(id)
    // );
    return zip(
      this.matchService.getMatchesWithId(),
      this.afs
        .collection<MatchDetails>("matchDetails", ref =>
          ref.where("playerId", "==", id)
        )
        .valueChanges()
    ).pipe(
      map(([matches, matchDetails]) => {
        return matchDetails.map(matDtls => {
          return {
            ...matDtls,
            opTeam: matches.find(match => match.id === matDtls.matchId).opTeam
          };
        });
      })
    );
  }

  getTopBatsmanList(playerList: any[]) {
    return [...playerList].sort((value1, value2) => {
      if (value1.totalRuns > value2.totalRuns) return -1;
      if (value1.totalRuns < value2.totalRuns) return 1;
    });
  }

  getTopBowlingList(playerList: any[]) {
    return [...playerList].sort((value1, value2) => {
      if (value1.totalWickets > value2.totalWickets) return -1;
      if (value1.totalWickets < value2.totalWickets) return 1;
    });
  }
}
