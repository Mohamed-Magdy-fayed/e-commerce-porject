// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0yP_CesiKv9peScDcvew6PsPRTs1hua4",
    authDomain: "sprints-e-commerce.firebaseapp.com",
    projectId: "sprints-e-commerce",
    storageBucket: "sprints-e-commerce.appspot.com",
    messagingSenderId: "431577754667",
    appId: "1:431577754667:web:7e8350a938d5a098334e6e"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);