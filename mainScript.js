//Initialize Database
const firebaseConfig = {
    apiKey: "AIzaSyCKnIn4SsMC74rTGqekjSw8OvLwWe88bbI",
    authDomain: "party-smart-tcod.firebaseapp.com",
    databaseURL: "https://party-smart-tcod.firebaseio.com",
    projectId: "party-smart-tcod",
    storageBucket: "party-smart-tcod.appspot.com",
    messagingSenderId: "332152048668",
    appId: "1:332152048668:web:9adf5fb209d803b8d4e3d9"
  };
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();


firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log("logged in")
    }
});

function newEvent(){
    localStorage.setItem('eventName', "");
}