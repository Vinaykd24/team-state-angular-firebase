import { Component, OnInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatchDetails } from "src/app/models/match-details.model";

@Component({
  selector: "app-player-performance",
  templateUrl: "./player-performance.component.html",
  styleUrls: ["./player-performance.component.css"]
})
export class PlayerPerformanceComponent implements OnInit {
  @Input() playerPerformance: MatchDetails[];
  constructor() {}

  ngOnInit(): void {}
}
