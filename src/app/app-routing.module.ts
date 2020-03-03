import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { PlayerComponent } from "./player/player.component";
import { MatchComponent } from "./match/match.component";
import { TournamentComponent } from "./tournament/tournament.component";
import { AddPlayerComponent } from "./player/add-player/add-player.component";
import { AddMatchComponent } from "./match/add-match/add-match.component";
import { AddTournamentComponent } from "./tournament/add-tournament/add-tournament.component";
import { AddMatchDetailComponent } from "./match/add-match-detail/add-match-detail.component";

const routes: Routes = [
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "players", component: PlayerComponent },
  { path: "add-player", component: AddPlayerComponent },
  { path: "matches", component: MatchComponent },
  { path: "add-match", component: AddMatchComponent },
  { path: "add-match-details", component: AddMatchDetailComponent },
  { path: "tournaments", component: TournamentComponent },
  { path: "add-tournament", component: AddTournamentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
