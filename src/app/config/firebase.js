import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnYNyelkcDrxyqjcWlxyffLI2g6GKNy9A",
  authDomain: "revents-467f5.firebaseapp.com",
  databaseURL: "https://revents-467f5.firebaseio.com",
  projectId: "revents-467f5",
  storageBucket: "revents-467f5.appspot.com",
  messagingSenderId: "62268165926",
  appId: "1:62268165926:web:a1e462dc4dd94bd0"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;