import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyDLkrgRyR96_2A_2cTzStqt1BOpHpSZq6o',
        authDomain: 'ng-recipe-book-a41a5.firebaseapp.com'
      });
    }
  }
}
