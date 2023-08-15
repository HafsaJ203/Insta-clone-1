import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';



const firebaseConfig = {
    apiKey: "AIzaSyCLfYiigvh9MJT5VvTLnwZbLGKpB9OIxTs",
    authDomain: "insta-clone-8c743.firebaseapp.com",
    projectId: "insta-clone-8c743",
    storageBucket: "insta-clone-8c743.appspot.com",
    messagingSenderId: "246203493589",
    appId: "1:246203493589:web:79ff616bdc903ef978065c",
    measurementId: "G-XBRF05ZRP2"
};

// Initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// For db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };