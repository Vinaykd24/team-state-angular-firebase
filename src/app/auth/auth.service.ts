import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { auth } from "firebase/app";

import { User } from "../models/user.model";
import { AuthData } from "../models/auth-data.model";
import { UiService } from "../shared/ui.service";
import * as fromRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";
import * as Auth from "./store/auth.actions";
import { PlayerService } from "../player/player.service";
import {
  AngularFirestoreDocument,
  AngularFirestore,
} from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import * as firebase from "firebase/app";

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private playerService: PlayerService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const data: User = {
          userId: user.uid,
          email: user.email,
          role: "subscriber",
          displayName: user.displayName,
          // roles: {
          //   subscriber: true
          // }
        };
        this.store.dispatch(new Auth.SetAuthenticated());
        this.store.dispatch(new Auth.SetUser(data));
        this.router.navigate(["/"]);
      } else {
        // this.playerService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(["/"]);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChanged.next(false);
        // this.updateUserData(result.user);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  async googleSignin(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const user = credential.user;
    this.updateUserData(user);
    // Save user details to Firestore collection
  }

  private updateUserData(user: firebase.User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    // userRef
    //   .valueChanges()
    //   .subscribe(data => this.store.dispatch(new Auth.GetUserRole(data.role)));
    const data: User = {
      userId: user.uid,
      email: user.email,
      role: "subscriber",
      displayName: user.displayName,
      // roles: {
      //   subscriber: true
      // }
    };
    this.store.dispatch(new Auth.SetUser(data));
    return userRef.set(data, { merge: true });
  }

  ///// Role-based Authorization //////

  canRead(user: User): boolean {
    const allowed = ["admin", "editor", "subscriber"];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ["admin", "editor"];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ["admin"];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

  logout() {
    this.afAuth.signOut();
  }
}
