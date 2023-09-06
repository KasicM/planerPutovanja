import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDKM6q4A4JayK6A0jrIVkBQC765PNFbrgs",
    authDomain: "planerputovanja-6870a.firebaseapp.com",
    databaseURL: "https://planerputovanja-6870a.firebaseio.com",
    projectId: "planerputovanja-6870a",
    storageBucket: "planerputovanja-6870a.appspot.com",
    messagingSenderId: "173754354616",
    appId: "1:173754354616:android:437845f474bbbc22349d4d"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();


export default firebase;