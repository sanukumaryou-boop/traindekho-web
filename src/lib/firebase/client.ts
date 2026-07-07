import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

import { firebaseConfig } from "../../../firebase.js";

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
