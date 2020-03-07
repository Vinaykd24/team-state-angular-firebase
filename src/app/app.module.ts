import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "./maretial.module";
import { SignupComponent } from "./auth/signup/signup.component";
import { LoginComponent } from "./auth/login/login.component";
import { PlayerComponent } from "./player/player.component";
import { AddPlayerComponent } from "./player/add-player/add-player.component";
import { MatchComponent } from "./match/match.component";
import { AddMatchComponent } from "./match/add-match/add-match.component";
import { TournamentComponent } from "./tournament/tournament.component";
import { AddTournamentComponent } from "./tournament/add-tournament/add-tournament.component";
import { AddMatchDetailComponent } from "./match/add-match-detail/add-match-detail.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "../environments/environment";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PlayerService } from "./player/player.service";
import { MatchService } from "./match/match.service";
import { TournamentService } from "./tournament/tournament.service";
import { PlayerStatsComponent } from "./player/player-stats/player-stats.component";
import { MatchDetailsComponent } from "./match/match-details/match-details.component";
import { StoreModule } from "@ngrx/store";

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    PlayerComponent,
    AddPlayerComponent,
    MatchComponent,
    AddMatchComponent,
    TournamentComponent,
    AddTournamentComponent,
    AddMatchDetailComponent,
    PlayerStatsComponent,
    MatchDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FlexLayoutModule,
    FormsModule
  ],
  providers: [PlayerService, MatchService, TournamentService],
  bootstrap: [AppComponent]
})
export class AppModule {}
