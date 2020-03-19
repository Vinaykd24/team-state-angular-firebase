import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { reducers } from "./app.reducer";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { UiService } from "./shared/ui.service";
import { MatchDetailsResolver } from "./match/match-details/match-details.resolver";
import { HeaderComponent } from "./navigation/header/header.component";
import { SideNavComponent } from "./navigation/side-nav/side-nav.component";
import { AuthService } from "./auth/auth.service";
import { TournamentStatsComponent } from "./match/tournament-stats/tournament-stats.component";
import { PlayerDetailsComponent } from "./player/player-details/player-details.component";
import { PlayerDetailsResolver } from "./player/player-details/player-details.resolver";
import { PlayerPerformanceComponent } from "./player/player-performance/player-performance.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AngularFireStorageModule } from "@angular/fire/storage";
import "firebase/storage";

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
    MatchDetailsComponent,
    HeaderComponent,
    SideNavComponent,
    TournamentStatsComponent,
    PlayerDetailsComponent,
    PlayerPerformanceComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    PlayerService,
    MatchService,
    TournamentService,
    UiService,
    MatchDetailsResolver,
    PlayerDetailsResolver,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
