import firebase from "firebase";

const config = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PID,
    storageBucket: process.env.REACT_APP_SB,
    messagingSenderId: process.env.REACT_APP_SID,
    appId: process.env.REACT_APP_APPID,
    measurementId:process.env.REACT_APP_MID
};

// init app
firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.firestore();


