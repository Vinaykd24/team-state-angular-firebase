import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  onAddPlayerClick() {
    this.router.navigateByUrl("/add-player");
  }

  onAddTournamentClick() {
    this.router.navigateByUrl("/add-tournament");
  }

  onAddMatchClick() {
    this.router.navigateByUrl("/add-match");
  }

  onAddMatchDetailsClick() {
    this.router.navigateByUrl("/add-match-details");
  }
}
