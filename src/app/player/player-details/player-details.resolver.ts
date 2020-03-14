import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { take } from "rxjs/operators";
import { PlayerService } from "../player.service";

@Injectable()
export class PlayerDetailsResolver implements Resolve<any> {
  constructor(private playerService: PlayerService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const playerData = this.playerService.getSinglePlayerDetails(
      route.paramMap.get("playerId")
    );
    return playerData;
  }
}
