import { Component, Input, OnInit } from "@angular/core";
import { Player } from "src/app/models/player.model";
import { TopPlayer } from "src/app/models/top-player.model";

@Component({
  selector: "app-player-card",
  templateUrl: "./player-card.component.html",
  styleUrls: ["./player-card.component.css"],
})
export class PlayerCardComponent implements OnInit {
  @Input() player: any;

  constructor() {}

  ngOnInit(): void {}
}
