import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./maretial.module";
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PlayerComponent } from './player/player.component';
import { AddPlayerComponent } from './player/add-player/add-player.component';
import { MatchComponent } from './match/match.component';
import { AddMatchComponent } from './match/add-match/add-match.component';
import { TournamentComponent } from './tournament/tournament.component';
import { AddTournamentComponent } from './tournament/add-tournament/add-tournament.component';
import { AddMatchDetailComponent } from './match/add-match-detail/add-match-detail.component';

@NgModule({
  declarations: [AppComponent, SignupComponent, LoginComponent, PlayerComponent, AddPlayerComponent, MatchComponent, AddMatchComponent, TournamentComponent, AddTournamentComponent, AddMatchDetailComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
