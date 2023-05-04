import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { map, take } from "rxjs/operators";

import * as fromRoot from "../app.reducer";
import * as fromAuthState from "../auth/store/auth.reducer";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<fromAuthState.State>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromAuthState.getUser).pipe(
      map((user) => {
        if (user) {
          // Check if the user is authenticated and has the required role
          if (user.role === "admin") {
            return true;
          }
        }

        // If the user is not authenticated or does not have the required role, redirect to the login page
        this.router.navigate(["/"]);
        return false;
      })
    );

    // return this.store.select(fromAuthState.getIsAuth).pipe(take(1));
  }
}
