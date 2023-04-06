import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatchDetails } from "src/app/models/match-details.model";
import { Chart } from "angular-highcharts";
import { TopPlayer } from "src/app/models/top-player.model";

@Component({
  selector: "app-player-performance",
  templateUrl: "./player-performance.component.html",
  styleUrls: ["./player-performance.component.css"],
})
export class PlayerPerformanceComponent implements OnInit, AfterViewInit {
  @Input() playerPerformance: MatchDetails[];
  @Input() player: TopPlayer;
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
    "wickets",
  ];
  dataSource = new MatTableDataSource<MatchDetails>();
  chart: Chart;
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log(this.playerPerformance);
    console.log(this.player.player.playerFirstName);

    this.dataSource.data = this.playerPerformance;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.chart = new Chart({
      chart: {
        type: "xy",
      },
      title: {
        text: `${this.player.player.playerFirstName}'s Bowlling Graph`,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: "Wickets/Runs",
        },
      },
      series: [
        {
          name: "Wickets Taken",
          type: "column",
          data: this.playerPerformance.map((item) =>
            item.wickets ? item.wickets : 0
          ),
        } as any,
        {
          name: "Runs Given",
          type: "column",
          data: this.playerPerformance.map((item) =>
            item.runsGiven ? item.runsGiven : 0
          ),
        } as any,
        {
          name: "Bowling Economy",
          type: "spline",
          data: this.playerPerformance.map(
            (item) => item.runsGiven / item.overs
          ),
        } as any,
      ],
    });
    this.cdr.detectChanges();
  }
}
