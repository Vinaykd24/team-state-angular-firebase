import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { MatchService } from "../match.service";
import { take } from "rxjs/operators";

@Injectable()
export class MatchDetailsResolver implements Resolve<any> {
  constructor(private matchService: MatchService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const matchData = this.matchService.getSingleMatchDetails(
      route.paramMap.get("matchId")
    );
    return matchData.pipe(take(1));
  }
}
