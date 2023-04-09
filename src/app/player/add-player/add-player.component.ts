import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Player } from "src/app/models/player.model";
import { PlayerService } from "../player.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { State } from "../store/player.reducer";

@Component({
  selector: "app-add-player",
  templateUrl: "./add-player.component.html",
  styleUrls: ["./add-player.component.css"],
})
export class AddPlayerComponent implements OnInit {
  playerRoles = [
    { id: "1", value: "Batsman" },
    { id: "2", value: "Bowler" },
    { id: "3", value: "All-rounder" },
  ];
  playerBattingStyles = [
    { id: "1", value: "Right-hand bat" },
    { id: "2", value: "Left-hand bat" },
  ];
  playerBowlingStyles = [
    { id: "1", value: "Right-arm fast" },
    { id: "2", value: "Right-arm medium fast" },
    { id: "3", value: "Right-arm offbreak" },
    { id: "4", value: "Right-arm off-spin" },
    { id: "5", value: "Right-arm legspin" },
    { id: "6", value: "Left-arm fast" },
    { id: "7", value: "Left-arm medium fast" },
    { id: "8", value: "Slow left-arm orthodox" },
    { id: "9", value: "Left-arm orthodox spin" },
    { id: "10", value: "-" },
  ];
  maxDate;
  constructor(
    private playerService: PlayerService,
    private router: Router,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit({ value, valid }: { value: Player; valid: boolean }) {
    this.playerService.newPlayer(value);
    this.router.navigate(["/add-player"]);
  }
}
