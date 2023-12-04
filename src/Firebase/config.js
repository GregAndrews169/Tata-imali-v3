// Import the required Firebase services
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDf6xmvNH3wGTz8TzmRuOCBCg9odkis2w4",
  authDomain: "tata-imali-xrpl-c289a.firebaseapp.com",
  databaseURL: "https://tata-imali-xrpl-c289a-default-rtdb.firebaseio.com",
  projectId: "tata-imali-xrpl-c289a",
  storageBucket: "tata-imali-xrpl-c289a.appspot.com",
  messagingSenderId: "426197014926",
  appId: "1:426197014926:web:c7375179e84b588fc66cdf"
};

  

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize Realtime Database - used to store loan requests in real time database
const database = firebaseApp.database();

// Initialize Authentication - used to store user sign ups
const auth = firebaseApp.auth();

// Initialize Firestore - used to store userType info assocaited with each user
const firestore = firebaseApp.firestore();

export { database, auth, firestore };


