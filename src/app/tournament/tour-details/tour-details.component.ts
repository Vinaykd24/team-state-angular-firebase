import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tour-details",
  templateUrl: "./tour-details.component.html",
  styleUrls: ["./tour-details.component.scss"]
})
export class TourDetailsComponent implements OnInit {
  tourDetails: any;

  constructor() {
    this.tourDetails = history.state;
  }

  ngOnInit(): void {}
}
