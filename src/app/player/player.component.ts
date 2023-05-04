import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlayerService } from "./player.service";
import { Subscription, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromPlayerReducer from "../player/store/player.reducer";
import * as fromMatchDetailsReducer from "../match/store/match-details.reducer";
import * as fromMatchReducer from "../match/store/match.reducer";
import * as fromAuthReducer from "../auth/store/auth.reducer";
import { State } from "../app.reducer";
import { TopPlayer } from "../models/top-player.model";
import { Router } from "@angular/router";
import { Player } from "../models/player.model";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"],
})
export class PlayerComponent implements OnInit, OnDestroy {
  plyrSub: Subscription[] = [];
  players$: Observable<TopPlayer[]>;
  allPlayers$: Observable<Player[]>;
  isMatchesPlayed$: Observable<boolean>;
  allPlayersGroupByBattingStyle$: any;
  isAdmin$: Observable<boolean>;

  constructor(
    private playerService: PlayerService,
    private store: Store<State>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.players$ = this.store.select(fromPlayerReducer.getAvailablePlayers);
    this.allPlayers$ = this.store.select(fromPlayerReducer.getAllPlayers);
    this.isMatchesPlayed$ = this.store.select(
      fromMatchReducer.getIsMatchesPlayed
    );
    this.allPlayersGroupByBattingStyle$ = this.store.select(
      fromPlayerReducer.getAllPlayersGroupByBattingStyle
    );
    this.isAdmin$ = this.store.select(fromAuthReducer.getIsAdmin);
    // this.fetchPlayers();
  }

  // fetchPlayers() {
  //   this.playerService.getPlayerMatchDetails();
  // }

  ngOnDestroy(): void {
    this.plyrSub.forEach((subs) => subs.unsubscribe());
  }

  clickPlayerEventHandler(player: TopPlayer) {
    this.router.navigate(["/playerDetails", player.player.id], {
      state: player,
    });
  }
}
