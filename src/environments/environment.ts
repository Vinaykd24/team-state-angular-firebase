// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: "AIzaSyAYSr_Fi81UcrhloHYK8mBFoW03xIrodIo",
  authDomain: "teamstats-5b227.firebaseapp.com",
  databaseURL: "https://teamstats-5b227.firebaseio.com",
  projectId: "teamstats-5b227",
  storageBucket: "teamstats-5b227.appspot.com",
  messagingSenderId: "798479054512",
  appId: "1:798479054512:web:7f53f0b0d1275649f1ad75",
};

// Your web app's Firebase configuration
const firebaseConfigStars = {
  apiKey: "AIzaSyCt8fmbHUjdO6Cl06eZicq2_AS1zRUQYuU",
  authDomain: "stars-forever-457cf.firebaseapp.com",
  projectId: "stars-forever-457cf",
  storageBucket: "stars-forever-457cf.appspot.com",
  messagingSenderId: "554842243290",
  appId: "1:554842243290:web:ce73b28296f0f6f281e5e3",
};
export const environment = {
  production: false,
  firebase: firebaseConfigStars,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
