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
      console.log("logged in");
      logOut.classList.remove('hide');
      logIn.classList.add('hide');
      newEventBtn.classList.remove('hide');
      eventName = localStorage.getItem('eventName');
      var ref = firebase.database().ref("users/" + user.uid + "/events/")
      ref.on('value', gotData, errData)
  }
  else{
      logOut.classList.add('hide');
      logIn.classList.remove('hide');
      newEventBtn.classList.add('hide');
  }
});




//------------------------------------------- UI List Funtions -------------------------------------

//Actively read data from firebase to print to UI


function gotData(data){
  //Momentarily clears both UI lists so items can be added w/o duplicates
  document.getElementById("events").innerHTML = "";
  

  var scores = data.val();
  var keys = Object.keys(scores);

  var ul = document.getElementById("events");

  for ( var i=0; i < keys.length; i++){
    var createDate = "Tues 10/12/2020"
    var names = keys[i];

    var a =document.createElement("a");
    var li = document.createElement("li");

    a.textContent= names + " " + createDate;
    li.appendChild(a);
    ul.appendChild(li);
    a.setAttribute('id', names);
    a.setAttribute('onclick', 'launchEvent(id)');
    a.setAttribute('href', 'event.html')
  }
  }

function errData(err){
    console.log('Error!');
    console.log(err);
  }

  function launchEvent(eventName){
    localStorage.setItem('eventName', eventName);
  }

//Search List function
  function checkInList() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("checkIn");
    filter = input.value.toUpperCase();
    ul = document.getElementById("names");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
