import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
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
import * as matchActions from "../match/store/match.actions";
import * as fromPlayerReducer from "./store/player.reducer";
import * as fromMatchDetails from "../match/store/match-details.reducer";
import * as fromMatchReducer from "../match/store/match.reducer";
import { Match } from "../models/match.model";
@Injectable()
export class PlayerService {
  playersCollection: AngularFirestoreCollection<Player>;
  playerDoc: AngularFirestoreDocument<Player>;
  players: Observable<Player[]>;
  player: Observable<Player>;
  playerMatchDetails$: Observable<TopPlayer[]>;
  private playerSubs: Subscription[] = [];
  hasMatchDetails: boolean;

  constructor(
    private afs: AngularFirestore,
    private matchService: MatchService,
    private store: Store<State>
  ) {
    this.playersCollection = this.afs.collection("players", (ref) =>
      ref.orderBy("playerFirstName", "desc")
    );
  }

  getPlayers(): Observable<Player[]> {
    //Get players with ID
    this.players = this.playersCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
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

  _getBestScore(playerList: any[]) {
    return _.maxBy(playerList, "runs").runs;
  }

  getBestBowling(playerList: any[]) {
    return (playerList = [...playerList].sort((wickets1, wickets2) => {
      if (wickets1.wickets > wickets2.wickets) return -1;
      if (wickets1.wickets < wickets2.wickets) return 1;
    }));
  }

  getPlayerMatchDetails(year?: number) {
    zip(
      this.getPlayers(),
      this.afs.collection<MatchDetails>("matchDetails").valueChanges(),
      this.matchService.getCurrentSeasonMatches(year)
    )
      .pipe(
        map(([players, matchDetails, matches]) => {
          // this.matchService.getSeasonMatches(year);
          if (matchDetails.length === 0 && matches.length === 0) {
            this.store.dispatch(new matchActions.setIsMatchesPlayed(false));
          }
          if (matchDetails.length === 0 && matches.length === 0) {
            this.hasMatchDetails = false;
          }
          this.store.dispatch(new playerActions.GetAllayers(players));
          let currentSeasonMatchDetails = [];
          const merge = _.map(matches, "id");
          for (let i = 0; i < matchDetails.length; i++) {
            if (merge.includes(matchDetails[i].matchId)) {
              currentSeasonMatchDetails.push(matchDetails[i]);
            }
          }
          const result = _(currentSeasonMatchDetails)
            .groupBy("playerId")
            .map((objs, key) => ({
              player: players.find((player) => player.id === key),
              isCaptain: players.find((player) => player.id === key).isCaptain,
              fifties: objs.filter((player) => player.runs >= 50).length || 0,
              centuries:
                objs.filter((player) => player.runs >= 100).length || 0,
              isOut: objs.filter((player) => player.isOut).length || 0,
              bestScore: this.getBestScore(objs)[0].runs || 0,
              bestBowling: this.getBestBowling(objs)[0].wickets || 0,
              totalMatches: objs.length || 0,
              totalInns: objs.filter((player) => player.overs >= 1).length || 0,
              totalBatInns:
                objs.filter((player) => player.runs >= 0 || player.balls >= 0)
                  .length || 0,
              totalRuns: _.sumBy(objs, "runs") || 0,
              totalBalls: _.sumBy(objs, "balls") || 0,
              totalFours: _.sumBy(objs, "fours") || 0,
              totalSixes: _.sumBy(objs, "sixes") || 0,
              totalOvers: _.sumBy(objs, "overs") || 0,
              totalMaidens: _.sumBy(objs, "maidens") || 0,
              totalRunsGiven: _.sumBy(objs, "runsGiven") || 0,
              totalWickets: _.sumBy(objs, "wickets") || 0,
            }))
            .value();
          return result;
        })
      )
      .subscribe(
        (players: TopPlayer[]) => {
          players.forEach((player) => {
            player.player.playerDob = player.player.playerDob.toDate();
          });
          players = _.orderBy(
            players,
            function (item) {
              return item.player.playerFirstName;
            },
            ["asc"]
          );
          let sortedPlayers = _.sortBy(players, function (item) {
            return item.player.isCaptain ? 0 : 1;
          });
          this.store.dispatch(
            new playerActions.GetAvailablePlayers(sortedPlayers)
          );
        },
        (error) => {
          console.log("Error while loading the players");
        }
      );
  }
  getTournamentDetails(id: string) {
    return zip(
      this.store.select(fromMatchReducer.getAvailableMatches),
      this.store.select(fromMatchDetails.getAvailableMatchDetails)
    ).pipe(
      map(([matches, matchDetails]) => {
        let tourMatches = [];
        let loadedMatches = matches
          .slice()
          .filter((match) => match.tourId === id);
        const merge = _.map(loadedMatches, "id");
        for (let i = 0; i < matchDetails.length; i++) {
          if (merge.includes(matchDetails[i].matchId)) {
            tourMatches.push(matchDetails[i]);
          }
        }
        // return tourMatches;
        const result = _(tourMatches)
          .groupBy("playerId")
          .map((objs, key) => ({
            playerFirstName: objs[0].playerFirstName,
            playerLastName: objs[0].playerLastName,
            playerId: objs[0].playerId,
            fifties: objs.filter((player) => player.runs >= 50).length || 0,
            centuries: objs.filter((player) => player.runs >= 100).length || 0,
            isOut: objs.filter((player) => player.isOut).length || 0,
            bestScore: _(objs).maxBy("runs").runs,
            bestBowling: this.getBestBowling(objs)[0].wickets || 0,
            totalInns: objs.filter((player) => player.overs >= 1).length || 0,
            totalBatInns:
              objs.filter((player) => player.runs >= 0 || player.balls >= 0)
                .length || 0,
            totalMatches: objs.length || 0,
            totalRuns: _.sumBy(objs, "runs") || 0,
            totalBalls: _.sumBy(objs, "balls") || 0,
            totalFours: _.sumBy(objs, "fours") || 0,
            totalSixes: _.sumBy(objs, "sixes") || 0,
            totalOvers: _.sumBy(objs, "overs") || 0,
            totalMaidens: _.sumBy(objs, "maidens") || 0,
            totalRunsGiven: _.sumBy(objs, "runsGiven") || 0,
            totalWickets: _.sumBy(objs, "wickets") || 0,
          }))
          .value();
        return {
          players: result,
          matches: loadedMatches,
          topRunsGetter: _.orderBy([...result], "totalRuns", "desc"),
          topWktsGetter: _.orderBy([...result], "totalWickets", "desc"),
          totalSixes: _.sumBy([...result], "totalSixes") || 0,
          totalFours: _.sumBy([...result], "totalFours") || 0,
        };
      })
    );
  }

  getPlayerMatchDetailsByTour(id: string) {
    zip(
      this.getPlayers(),
      this.afs.collection<MatchDetails>("matchDetails").valueChanges(),
      this.store.select(fromMatchReducer.getAvailableMatches)
    ).pipe(
      map(([players, matchDetails, matches]) => {
        const result = _(matchDetails)
          .groupBy("playerId")
          .map((objs, key) => ({
            player: players.find((player) => player.id === key),
            fifties: objs.filter((player) => player.runs >= 50).length || 0,
            centuries: objs.filter((player) => player.runs >= 100).length || 0,
            isOut: objs.filter((player) => player.isOut).length || 0,
            bestScore: this.getBestScore(objs)[0].runs || 0,
            bestBowling: this.getBestBowling(objs)[0].wickets || 0,
            totalMatches: objs.length || 0,
            totalInns: objs.filter((player) => player.overs >= 1).length || 0,
            totalBatInns:
              objs.filter((player) => player.runs >= 0 || player.balls >= 0)
                .length || 0,
            totalRuns: _.sumBy(objs, "runs") || 0,
            totalBalls: _.sumBy(objs, "balls") || 0,
            totalFours: _.sumBy(objs, "fours") || 0,
            totalSixes: _.sumBy(objs, "sixes") || 0,
            totalOvers: _.sumBy(objs, "overs") || 0,
            totalMaidens: _.sumBy(objs, "maidens") || 0,
            totalRunsGiven: _.sumBy(objs, "runsGiven") || 0,
            totalWickets: _.sumBy(objs, "wickets") || 0,
          }))
          .value();
        return result;
      })
    );
  }
  getTourDetails(year: any) {
    return combineLatest(
      this.afs.collection<MatchDetails>("matchDetails").valueChanges(),
      this.matchService.getCurrentSeasonMatches(year)
    ).pipe(
      map(([matchDetails, matches]) => {
        let currentSeasonMatchDetails = [];
        const merge = _.map(matches, "id");
        for (let i = 0; i < matchDetails.length; i++) {
          if (merge.includes(matchDetails[i].matchId)) {
            currentSeasonMatchDetails.push(matchDetails[i]);
          }
        }
        const result = _(currentSeasonMatchDetails)
          .groupBy("id")
          .map((objs, key) => ({
            // topRunsGetter: this.getBestScore(objs)[0],
            topRunsGetter: _.maxBy(objs, "runs"),
            topWktsGetter: _.maxBy(objs, "wickets"),
            topInng: _.orderBy(matches, ["homeTeamScore"], ["desc"])[0], // Use Lodash to sort array by 'name'
            fifties: objs.filter((player) => player.runs >= 50).length || 0,
            centuries: objs.filter((player) => player.runs >= 100).length || 0,
            winPercentage: this.calculateWinningPercentage(matches) || 0,
            runDifference: this.calculateRunDifference(matches) || 0,
            totalRuns: _.sumBy(objs, "runs") || 0,
            totalFours: _.sumBy(objs, "fours") || 0,
            totalSixes: _.sumBy(objs, "sixes") || 0,
            totalWickets: _.sumBy(objs, "wickets") || 0,
          }))
          .value();
        return result[0];
      })
    );
  }

  calculateWinningPercentage(matches: Match[]): string {
    const totalMatches = matches.length;
    const totalWins =
      matches.filter((match) => match.homeTeamWon === true).length || 0;
    return ((totalWins / totalMatches) * 100).toFixed(2);
  }

  calculateRunDifference(matches: Match[]): number {
    const totalMatches = matches.length;
    const oppTeamTotalScoreAvg = _.sumBy(matches, "opTeamScore") / totalMatches;
    const homeTeamTotalScoreAvg =
      _.sumBy(matches, "homeTeamScore") / totalMatches;
    return +(homeTeamTotalScoreAvg - oppTeamTotalScoreAvg).toFixed(2);
  }

  getSinglePlayerDetails(id: string) {
    this.store.dispatch(new playerActions.GetSelectedPlayer(id));
  }

  getSelectedPlayerPerformance(id: string) {
    return zip(
      // this.matchService.getMatchesWithId(),
      // this.matchService.getCurrentSeasonMatches(),
      this.store.select(fromMatchReducer.getSelectedSeasonMatches),
      this.afs
        .collection<MatchDetails>("matchDetails", (ref) =>
          ref.where("playerId", "==", id)
        )
        .valueChanges()
    ).pipe(
      map(([matches, matchDetails]) => {
        console.log(matches);
        let currentSeasonMatchDetails = [];
        const merge = _.map(matches, "id");
        for (let i = 0; i < matchDetails.length; i++) {
          if (merge.includes(matchDetails[i].matchId)) {
            currentSeasonMatchDetails.push(matchDetails[i]);
          }
        }
        return currentSeasonMatchDetails.map((matDtls) => {
          return {
            ...matDtls,
            opTeam: matches.find((match) => match.id === matDtls.matchId)
              .opTeam,
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

  getTopBowlingAvgList(playerList: any[]) {
    const topBowlingAvgList = [...playerList].map((item) => {
      if (
        (item.totalOvers === 0 && item.totalWickets === 0) ||
        (item.totalOvers > 0 && item.totalWickets === 0)
      ) {
        return { ...item, bowlingAvg: 0 };
      } else {
        const calcBowlingAvg = item.totalRunsGiven / item.totalWickets;
        return { ...item, bowlingAvg: Math.round(calcBowlingAvg) };
      }
    });
    console.log(topBowlingAvgList);
    const filteredTopBowlingAvgList = [...topBowlingAvgList].filter(
      (player) => {
        if (player.totalMatches > 3 && player.bowlingAvg !== 0) {
          return player;
        }
      }
    );

    console.log(filteredTopBowlingAvgList);
    return [...filteredTopBowlingAvgList].sort((value1, value2) => {
      if (value1.bowlingAvg > value2.bowlingAvg) return 1;
      if (value1.bowlingAvg < value2.bowlingAvg) return -1;
    });
  }

  getTopBattingAvgList(playerList: any[]) {
    const topBattingAvgList = [...playerList].map((item) => {
      if (item.totalRuns === 0) {
        return { ...item, battingAvg: 0 };
      } else {
        const calcBattingAvg = item.totalRuns / item.isOut;
        return { ...item, battingAvg: Math.round(calcBattingAvg) };
      }
    });
    console.log(topBattingAvgList);
    const filteredTopBattingAvgList = [...topBattingAvgList].filter(
      (player) => {
        if (player.totalMatches > 3 && player.battingAvg !== 0) {
          return player;
        }
      }
    );

    console.log(filteredTopBattingAvgList);
    return [...filteredTopBattingAvgList].sort((value1, value2) => {
      if (value1.battingAvg > value2.battingAvg) return -1;
      if (value1.battingAvg < value2.battingAvg) return 1;
    });
  }
}
