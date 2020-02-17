import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { PlayerComponent } from "./player/player.component";
import { MatchComponent } from "./match/match.component";
import { TournamentComponent } from "./tournament/tournament.component";

const routes: Routes = [
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "players", component: PlayerComponent },
  { path: "matches", component: MatchComponent },
  { path: "tournaments", component: TournamentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
