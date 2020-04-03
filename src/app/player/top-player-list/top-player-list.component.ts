import { Component, OnInit, Input } from "@angular/core";
import { TopPlayer } from "src/app/models/top-player.model";

@Component({
  selector: "app-top-player-list",
  templateUrl: "./top-player-list.component.html",
  styleUrls: ["./top-player-list.component.scss"]
})
export class TopPlayerListComponent implements OnInit {
  @Input() topPlayerList: TopPlayer | any;
  @Input() statsType: string;

  constructor() {}

  ngOnInit(): void {}
}
