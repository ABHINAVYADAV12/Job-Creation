import {getApp,getApps,initializeApp} from "firebase/app"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyBZSeAoXl8eX56XDF2v8a9CjHnSG0QDvtg",
    authDomain: "job-portal-b2ec9.firebaseapp.com",
    projectId: "job-portal-b2ec9",
    storageBucket: "job-portal-b2ec9.appspot.com",
    messagingSenderId: "996892435739",
    appId: "1:996892435739:web:3cd77027f9492d3f9f9fbe"
 };
 const app=getApps.length>0?getApp(): initializeApp(firebaseConfig)
 const storage=getStorage(app)
 export{storage}