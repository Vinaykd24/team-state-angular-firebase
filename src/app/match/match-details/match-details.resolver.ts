import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { MatchService } from "../match.service";

@Injectable()
export class MatchDetailsResolver implements Resolve<any> {
  constructor(private matchService: MatchService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.matchService.getSingleMatchDetails(
      route.paramMap.get("matchId")
    );
  }
}
