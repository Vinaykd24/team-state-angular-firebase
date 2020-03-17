import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatchDetails } from "src/app/models/match-details.model";

@Component({
  selector: "app-player-performance",
  templateUrl: "./player-performance.component.html",
  styleUrls: ["./player-performance.component.css"]
})
export class PlayerPerformanceComponent implements OnInit, AfterViewInit {
  @Input() playerPerformance: MatchDetails[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    "opTeam",
    "runs",
    "balls",
    "fours",
    "sixes",
    "overs",
    "maidens",
    "runsGiven",
    "wickets"
  ];
  dataSource = new MatTableDataSource<MatchDetails>();
  constructor() {}

  ngOnInit(): void {
    console.log(this.playerPerformance);
    this.dataSource.data = this.playerPerformance;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
