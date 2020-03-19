import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Player } from "src/app/models/player.model";
import { PlayerService } from "../player.service";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { State } from "../store/player.reducer";
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { Observable } from "rxjs";
import { map, finalize } from "rxjs/operators";

@Component({
  selector: "app-add-player",
  templateUrl: "./add-player.component.html",
  styleUrls: ["./add-player.component.css"]
})
export class AddPlayerComponent implements OnInit {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;

  playerRoles = [
    { id: "1", value: "Batsman" },
    { id: "2", value: "Bowler" },
    { id: "3", value: "All-rounder" }
  ];
  playerBattingStyles = [
    { id: "1", value: "Right-hand bat" },
    { id: "2", value: "Left-hand bat" }
  ];
  playerBowlingStyles = [
    { id: "1", value: "Right-arm fast" },
    { id: "2", value: "Right-arm medium fast" },
    { id: "3", value: "Right-arm offbreak" },
    { id: "4", value: "Right-arm off-spin" },
    { id: "5", value: "Right-arm legspin" },
    { id: "6", value: "Left-arm fast" },
    { id: "7", value: "Left-arm medium fast" },
    { id: "8", value: "Slow left-arm orthodox" },
    { id: "9", value: "Left-arm orthodox spin" },
    { id: "10", value: "-" }
  ];
  maxDate;
  constructor(
    private playerService: PlayerService,
    private router: Router,
    private store: Store<State>,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit({ value, valid }: { value: Player; valid: boolean }) {
    this.playerService.newPlayer(value);
    this.router.navigate(["/"]);
  }

  upload(event) {
    this.playerService.uploadFile(event);
    // create a random id
    // const randomId = Math.random()
    //   .toString(36)
    //   .substring(2);
    // // create a reference to the storage bucket location
    // this.ref = this.afStorage.ref("/images/" + randomId);
    // // the put method creates an AngularFireUploadTask
    // // and kicks off the upload
    // this.task = this.ref.put(event.target.files[0]);

    // // AngularFireUploadTask provides observable
    // // to get uploadProgress value
    // // this.uploadProgress = this.task.snapshotChanges()
    // // .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

    // // observe upload progress
    // this.uploadProgress = this.task.percentageChanges();
    // // get notified when the download URL is available
    // this.task
    //   .snapshotChanges()
    //   .pipe(finalize(() => (this.downloadURL = this.ref.getDownloadURL())))
    //   .subscribe();
    // this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }
}
