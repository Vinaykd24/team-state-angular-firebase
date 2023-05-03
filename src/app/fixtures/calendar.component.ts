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

@Component({
  selector: "app-match-list",
  templateUrl: "./calendar.component.html",
  styles: [
    `
      .example-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
      }
      .example-full-width {
        width: 100%;
      }
      table {
        width: 100%;
      }

      tr.example-detail-row {
        height: 0;
      }

      tr.example-element-row:not(.example-expanded-row):hover {
        background: whitesmoke;
      }

      tr.example-element-row:not(.example-expanded-row):active {
        background: #efefef;
      }

      .example-element-row td {
        border-bottom-width: 0;
      }

      .example-element-detail {
        overflow: hidden;
        display: flex;
      }

      .example-element-diagram {
        min-width: 80px;
        border: 2px solid black;
        padding: 8px;
        font-weight: lighter;
        margin: 8px 0;
        height: 104px;
      }

      .example-element-symbol {
        font-weight: bold;
        font-size: 40px;
        line-height: normal;
      }

      .example-element-description {
        padding: 16px;
      }

      .example-element-description-attribution {
        opacity: 0.5;
      }
    `,
  ],
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
  dataSource2 = ELEMENT_DATA;
  // columnsToDisplay = ["name", "weight", "symbol", "position"];
  // expandedElement: PeriodicElement | null;
  expandedElement: MatchFixture | null;
  dataSource: MatTableDataSource<MatchFixture>;
  displayedColumns: string[] = [
    "matchDate",
    "matchVenue",
    "matchTime",
    "availability",
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  matchFixtures$: Observable<MatchFixture[]>;
  user: User;
  columnsToDisplay = [
    "matchDate",
    "opponentTeamVenue",
    "matchVenue",
    "matchTime",
    "availability",
  ];
  constructor(
    private matchService: MatchService,
    private firestore: AngularFirestore,
    private store: Store<fromAuthhReducer.State>
  ) {}

  ngOnInit(): void {
    this.matchFixtures$ = this.matchService.getMatchFixtures();
    this.matchService.getMatchFixtures().subscribe((matchFixtures) => {
      this.dataSource = new MatTableDataSource(matchFixtures);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.store
      .select(fromAuthhReducer.getUser)
      .subscribe((user) => (this.user = user));
  }

  updateAvailability(matchFixture: MatchFixture): void {
    const matchId = matchFixture.id; // Replace with the actual match ID
    // const playerId = 'your_player_id_here'; // Replace with the actual player ID
    if (this.user) {
      this.firestore
        .collection<MatchFixture>("fixtures")
        .doc(matchId)
        .update({
          playersAvailable: firebase.firestore.FieldValue.arrayUnion(
            this.user.displayName
          ),
        });
    }
  }

  toDateTime(timestamp: firebase.firestore.Timestamp): Date {
    return timestamp.toDate();
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: "Hydrogen",
    weight: 1.0079,
    symbol: "H",
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: "Helium",
    weight: 4.0026,
    symbol: "He",
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: "Lithium",
    weight: 6.941,
    symbol: "Li",
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: "Beryllium",
    weight: 9.0122,
    symbol: "Be",
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: "Boron",
    weight: 10.811,
    symbol: "B",
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: "Carbon",
    weight: 12.0107,
    symbol: "C",
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: "Nitrogen",
    weight: 14.0067,
    symbol: "N",
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: "Oxygen",
    weight: 15.9994,
    symbol: "O",
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: "Fluorine",
    weight: 18.9984,
    symbol: "F",
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: "Neon",
    weight: 20.1797,
    symbol: "Ne",
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];
