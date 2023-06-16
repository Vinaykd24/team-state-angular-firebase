import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatchListComponent } from "./calendar.component";
import { MatchFixture } from "../models/match-fixture.model";

describe("YourComponent", () => {
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  let component: MatchListComponent;
  let fixture: ComponentFixture<MatchListComponent>;

  beforeEach(() => {
    const firestoreMock = jasmine.createSpyObj("AngularFirestore", [
      "collection",
      "doc",
      "update",
    ]);
    TestBed.configureTestingModule({
      imports: [AngularFireModule],
      providers: [{ provide: AngularFirestore, useValue: firestoreMock }],
    });
    firestoreSpy = TestBed.inject(
      AngularFirestore
    ) as jasmine.SpyObj<AngularFirestore>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit("should update availability for a match when player is available", () => {
    const fixture1 = {
      id: "match_id",
      matchVenue: "Petro Canada",
      matchTime: "morning",
      opTeam: "ABC 1",
      matchDate: new Date().toDateString(),
      tourId: "abc",
    };
    const user = { displayName: "John Doe" };

    // Set the user mock
    (window as any).user = user;

    // Set isAvailable to true
    component.updateAvailability(fixture1, true);

    // Verify the Firestore method calls and arguments
    // expect(firestoreSpy.collection).toHaveBeenCalledWith<MatchFixture>('fixtures');
    expect(firestoreSpy.doc).toHaveBeenCalledWith("fixtures/match_id");
    expect(
      firestoreSpy.collection("fixtures").doc().update
    ).toHaveBeenCalledWith({
      playersAvailable: jasmine.arrayContaining(["John Doe"]),
      playersUnavailable: jasmine.arrayContaining(["John Doe"]),
    });
  });

  fit("should update availability for a match when player is unavailable", () => {
    const fixture1 = {
      id: "match_id",
      matchVenue: "Petro Canada",
      matchTime: "morning",
      opTeam: "ABC 1",
      matchDate: new Date().toDateString(),
      tourId: "abc",
    };
    const user = { displayName: "John Doe" };

    // Set the user mock
    (window as any).user = user;

    // Set isAvailable to false
    component.updateAvailability(fixture1, false);

    // Verify the Firestore method calls and arguments
    // expect(firestoreSpy.collection).toHaveBeenCalledWith<MatchFixture>(
    //   "fixtures"
    // );
    expect(firestoreSpy.doc).toHaveBeenCalledWith("fixtures/match_id");
    expect(
      firestoreSpy.collection("fixtures").doc().update
    ).toHaveBeenCalledWith({
      playersAvailable: jasmine.arrayContaining(["John Doe"]),
      playersUnavailable: jasmine.arrayContaining(["John Doe"]),
    });
  });
});
