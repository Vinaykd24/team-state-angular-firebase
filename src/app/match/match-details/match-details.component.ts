import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatchService } from "../match.service";
import { MatchDetails } from "src/app/models/match-details.model";
import { Observable } from "rxjs";

@Component({
  selector: "app-match-details",
  templateUrl: "./match-details.component.html",
  styleUrls: ["./match-details.component.css"]
})
export class MatchDetailsComponent implements OnInit {
  // matchDetails$: Observable<MatchDetails[]>;
  _data: any;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService
  ) {
    this.route.data.subscribe(data => console.log(data));
    console.log(history.state);
  }

  ngOnInit(): void {}
}
