import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatchService } from "../match/match.service";
import { Observable } from "rxjs";
import { MatchFixture } from "../models/match-fixture.model";
import { firestore } from "firebase";
import { AngularFirestore } from "@angular/fire/firestore";
import * as fromAuthhReducer from "../auth/store/auth.reducer";
import { Store } from "@ngrx/store";
import { User } from "../models/user.model";
import * as firebase from "firebase";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-match-list",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class MatchListComponent implements OnInit {
  expandedElement: MatchFixture | null;
  dataSource: MatTableDataSource<MatchFixture>;
  displayedColumns: string[] = [
    "matchDate",
    "matchVenue",
    "matchTime",
    "availability",
  ];
  @ViewChild(MatSort) sort: MatSort;

  matchFixtures$: Observable<MatchFixture[]>;
  user: User;
  columnsToDisplay = [
    "matchDate",
    "opponentTeamVenue",
    "matchVenue",
    "matchTime",
    "availability",
  ];
  isAdmin$: Observable<boolean>;
  isAdmin = false;
  selectedPlayerList = [];
  matchData: MatchFixture;
  isPlayingXiDecleared = false;

  questionForm: FormGroup;
  questions: any[] = [];
  filteredQuestions: any[] = [];
  showModal: boolean = false;
  currentQuestion: any;

  formQuestions: any[] = []; // Array to store added questions with additional information
  filteredBusinessQuestions: any[] = []; // Array to store added questions with additional information
  filteredClientQuestions: any[] = []; // Array to store added questions with additional information
  constructor(
    private matchService: MatchService,
    private firestore: AngularFirestore,
    private store: Store<fromAuthhReducer.State>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.matchFixtures$ = this.matchService.getMatchFixtures();
    this.isAdmin$ = this.store.select(fromAuthhReducer.getIsAdmin);
    this.matchService.getMatchFixtures().subscribe((matchFixtures) => {
      const updatedList = this.transformMatchData(matchFixtures);

      this.dataSource = new MatTableDataSource(updatedList);
      this.dataSource.sort = this.sort;
      this.matchData = updatedList[0];
      this.isPlayingXiDecleared = this.matchData.isPlayingXiReleased;
    });
    this.store
      .select(fromAuthhReducer.getUser)
      .subscribe((user) => (this.user = user));
    this.store
      .select(fromAuthhReducer.getIsAdmin)
      .subscribe((data) => (this.isAdmin = data));

    this.questionForm = this.formBuilder.group({
      title: ["", Validators.required],
      toolTipText: [""],
      category: ["business"],
      answerType: ["text"],
      canUploadDocuments: [false],
    });
  }
  transformMatchData(matchFixtures: MatchFixture[]): Array<MatchFixture> {
    const a = matchFixtures.map((match) => {
      if (match.matchTime === "afternoon") {
        return { ...match, matchTime: "12:00 PM" };
      } else if (match.matchTime === "morning") {
        return { ...match, matchTime: "7:00 AM" };
      } else if (match.matchTime === "evening") {
        return { ...match, matchTime: "5:00 PM", isDayNightMatch: true };
      } else {
        return match;
      }
    });
    return a;
  }

  updateAvailability(matchFixture: MatchFixture, isAvailable: boolean): void {
    const matchId = matchFixture.id; // Replace with the actual match ID
    // const playerId = 'your_player_id_here'; // Replace with the actual player ID
    if (this.user) {
      if (isAvailable) {
        this.firestore
          .collection<MatchFixture>("fixtures")
          .doc(matchId)
          .update({
            playersAvailable: firebase.firestore.FieldValue.arrayUnion(
              this.user.displayName
            ),
            playersUnavailable: firebase.firestore.FieldValue.arrayRemove(
              this.user.displayName
            ),
          });
      } else if (!isAvailable) {
        this.firestore
          .collection<MatchFixture>("fixtures")
          .doc(matchId)
          .update({
            playersAvailable: firebase.firestore.FieldValue.arrayRemove(
              this.user.displayName
            ),
            playersUnavailable: firebase.firestore.FieldValue.arrayUnion(
              this.user.displayName
            ),
          });
      }
    }
  }

  selectPlayingXi(
    matchFixture: MatchFixture,
    playerName: string,
    isSelected: boolean
  ): void {
    event.preventDefault();
    const matchId = matchFixture.id; // Replace with the actual match ID
    // const playerId = 'your_player_id_here'; // Replace with the actual player ID
    if (this.isAdmin) {
      if (isSelected) {
        this.firestore
          .collection<MatchFixture>("fixtures")
          .doc(matchId)
          .update({
            selectedPlayers:
              firebase.firestore.FieldValue.arrayUnion(playerName),
            droppedPlayers:
              firebase.firestore.FieldValue.arrayRemove(playerName),
          });
      } else if (!isSelected) {
        this.firestore
          .collection<MatchFixture>("fixtures")
          .doc(matchId)
          .update({
            selectedPlayers:
              firebase.firestore.FieldValue.arrayRemove(playerName),
            droppedPlayers:
              firebase.firestore.FieldValue.arrayUnion(playerName),
          });
      }
    }
  }

  disableAvilabilityCheck(matchId) {
    this.firestore.collection<MatchFixture>("fixtures").doc(matchId).update({
      disableAvilabilityCheck: true,
    });
  }

  releasePlayingXi(matchId) {
    this.firestore.collection<MatchFixture>("fixtures").doc(matchId).update({
      isPlayingXiReleased: true,
    });
  }

  selectInTeam(playerName): Array<string> {
    this.selectedPlayerList.push(playerName);
    console.log(this.selectedPlayerList);
    return this.selectedPlayerList;
  }

  toDateTime(timestamp: firebase.firestore.Timestamp): Date {
    return timestamp.toDate();
  }

  addQuestion(): void {
    if (this.questionForm.valid) {
      const newQuestion = this.questionForm.value;
      this.questions.push(newQuestion);
      this.filterQuestions();
      this.questionForm.reset();
    }
  }

  editQuestion(question: any): void {
    this.currentQuestion = question;
    this.questionForm.patchValue(question);
    this.showModal = true;
  }

  updateQuestion(): void {
    if (this.questionForm.valid && this.currentQuestion) {
      const updatedQuestion = this.questionForm.value;
      const index = this.questions.indexOf(this.currentQuestion);
      if (index > -1) {
        this.questions[index] = updatedQuestion;
        this.filterQuestions();
        this.closeModal();
      }
    }
  }

  deleteQuestion(question: any): void {
    const index = this.questions.indexOf(question);
    if (index > -1) {
      this.questions.splice(index, 1);
      this.filterQuestions();
    }
  }

  saveForm(): void {
    const formInfo = {
      formQuestions: this.questions,
      createdDate: new Date().toISOString(),
      // Add other relevant information as needed
    };
    this.formQuestions.push(formInfo);
    console.log("Form saved!");
  }

  submitForm(): void {
    console.log("Form submitted!");
  }

  filterQuestions(): void {
    this.filteredBusinessQuestions = this.questions.filter(
      (question) => question.category === "business"
    );
    this.filteredClientQuestions = this.questions.filter(
      (question) => question.category === "client"
    );
  }

  closeModal(): void {
    this.showModal = false;
    this.currentQuestion = null;
    this.questionForm.reset();
  }
}
