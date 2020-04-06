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
import { MatchDetailsComponent } from "./match/match-details/match-details.component";
import { MatchDetailsResolver } from "./match/match-details/match-details.resolver";
import { PlayerDetailsResolver } from "./player/player-details/player-details.resolver";
import { PlayerDetailsComponent } from "./player/player-details/player-details.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AuthGuard } from "./auth/auth.guard";
import { TourDetailsComponent } from "./tournament/tour-details/tour-details.component";

const routes: Routes = [
  { path: "signup", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "", component: WelcomeComponent },
  { path: "players", component: PlayerComponent },
  {
    path: "add-player",
    component: AddPlayerComponent,
    canActivate: [AuthGuard],
  },
  { path: "matches", component: MatchComponent },
  {
    path: "matchDetails/:matchId",
    component: MatchDetailsComponent,
    resolve: { matchDetails: MatchDetailsResolver },
  },
  {
    path: "playerDetails/:playerId",
    component: PlayerDetailsComponent,
    resolve: { matchDetails: PlayerDetailsResolver },
  },
  {
    path: "tourDetails/:tourId",
    component: TourDetailsComponent,
  },
  { path: "add-match", component: AddMatchComponent, canActivate: [AuthGuard] },
  {
    path: "add-match-details",
    component: AddMatchDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "tournaments",
    component: TournamentComponent,
  },
  {
    path: "add-tournament",
    component: AddTournamentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
