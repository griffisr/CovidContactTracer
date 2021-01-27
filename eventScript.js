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
  }
  else{
      logOut.classList.add('hide');
      logIn.classList.remove('hide');
      newEventBtn.classList.add('hide');
  }
});



if(localStorage.getItem('eventName') === null || localStorage.getItem('eventName')==="" || localStorage.getItem('eventName')==="new"){
  createEvent();
}

//-------------------- User Uploaded List -------------------------

//Initialize List Read file and import
var names = []
document.getElementById('inputfile') .addEventListener('change', function loadFile() 
        { 
            var fr=new FileReader(); 
            fr.onload=function(){ 

              //Loads .txt file into array and loacl variable
              names = (fr.result.split('\n')); 
              localStorage.setItem('names', JSON.stringify(names));

              //turns names into json objects
              strToObject();
            } 
            fr.readAsText(this.files[0]);
        }) 


//Helper function to turn the guest list into an array of objects to assign data to 
function strToObject()
{
  eventName = prompt("Please enter a name for your event:", "My Event")
  if(eventName == null || eventName == "")
  {
    alert("Please enter and event name!")
  }
  else{
    for (var i = 0; i < names.length; i++)
    {
      firebase.database().ref("users/"+ localStorage.getItem('userUID') + "/events/" + eventName+ '/guestList/' + names[i]).set({
        name: names[i],
        Inside: "No",
        TimeIn: "n/a",
        TimeOut: "n/a",
      })
    }
    localStorage.setItem('eventName', eventName);
    document.title = eventName;
  }
  
}

function createEvent(){
  eventName = prompt("Please enter a name for your event:", "My Event")
  if(eventName === null || eventName === "")
  {
    alert("Please enter an event name!")
    createEvent();
  }
  else
  {
    localStorage.setItem('eventName', eventName);
    document.title = eventName;
    firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/").set({
      Nobody: "empty",
  
    })
  }
  
}

//Counter
function clickCounter() {
  if (typeof(Storage) !== "undefined") {
    if (localStorage.clickcount) {
      localStorage.clickcount = Number(localStorage.clickcount)+1;
    } else {
      localStorage.clickcount = 1;
    }
    document.getElementById("result").innerHTML = "There are currently " + localStorage.clickcount + " people inside.";
  } else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
  }
}

//-------------------- Check In Funtion ---------------------------------------------
function setTextIn(name){
  document.getElementById("checkInName").value = name;
}

document.getElementById("checkInBtn").onclick = function(){
  userUID = localStorage.getItem('userUID');
  eventName = localStorage.getItem('eventName');

  //Grabs User Input for Check In
  var nameg = document.getElementById("checkInName").value;

  //If no name is entered, tells user to enter a name 
  if(nameg==null){
    alert("Please Enter a guest name!")
  }

  firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+nameg).once('value', function(snapshot){

    //Creates a new guest if they aren't on the list uploaded by the user
    if(snapshot.val() === null)
    {
      contactInfo = prompt(nameg + " is not currently on the list. Please enter either a phone number or email address for " + nameg + " to continue")
      firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+nameg).set({
        name: nameg,
        Inside: "Yes",
        TimeIn: getTime(),
        TimeOut: "n/a",
        Contact: contactInfo,})
    }

    //Check In User Already on the list
    if(snapshot.val() != null && snapshot.val().Inside === "No")
      {
        if(snapshot.val().TimeIn != "n/a" && snapshot.val().TimeOut !="n/a")
        {
          firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+nameg).update({
            Inside: "Yes",
            TimeBackIn: getTime(),
            TimeBackOut: "n/a",})
          
        }
        else
        {
          firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+nameg).update({
          Inside: "Yes",
          TimeIn: getTime(),})
        }   
      }    
      alerts(nameg, true)
      document.getElementById("checkInName").value="";
    })}
  
    
        
    
    


//------------------------- Check Out ------------------------------------------------------------

function setTextOut(name){
  document.getElementById("checkOutName").value = name;
}

document.getElementById("checkOutBtn").onclick = function(){
  eventName = localStorage.getItem('eventName');
  var namel = document.getElementById("checkOutName").value;
  firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+namel).once('value', function(snapshot){
    if(snapshot.val().Inside != "No")
    {
      if(snapshot.val().TimeIn != "n/a" && snapshot.val().TimeOut !="n/a")
        {
          firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+namel).update({
            Inside: "No",
            TimeBackOut: getTime(),
          })
        }
        else
        {
          firebase.database().ref("users/" + localStorage.getItem('userUID') + "/events/" + eventName + "/guestList/"+namel).update({
          Inside: "No",
          TimeOut: getTime(),})
        }
      
    }
    alerts(namel, false)
  document.getElementById("checkOutName").value="";
  }
)}


//---------------------- Alert once checked in and out ----------------------
  function alerts(name, Boolean){
    if(Boolean){
      console.log(name + " has been checked in!")
    }
    else{
      console.log(name + " has been checked out!")
    }
  }

  //-------------------------- Returns time ---------------------------
  function addZero(i) {
    if (i < 10) {
    i = "0" + i;
  }
  return i;
  }

  function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var currentTime = h + ":" + m + ":" + s;

    return currentTime;
}


//------------------------------------------- UI List Funtions -------------------------------------

//Actively read data from firebase to print to UI

//Gets data for currently logged in user
firebase.auth().onAuthStateChanged(function(user){
  if(user){
    localStorage.setItem('userUID', user.uid);
    eventName = localStorage.getItem('eventName');
    document.title = eventName;
    ref = database.ref("users/" + user.uid + "/events/" + eventName + "/guestList/")
    ref.on('value', gotData, errData)
  }
});


guestsNotInside = [];
guestsAreInside = [];
function gotData(data){
  eventName = localStorage.getItem('eventName');
  //Momentarily clears both UI lists so items can be added w/o duplicates
  document.getElementById("namesInside").innerHTML = "";
  guestsNotInside.length = 0;
  guestsAreInside.length = 0;
  

  var scores = data.val();
  var keys = Object.keys(scores);

  var ulInside = document.getElementById("namesInside");

  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    if(inside == "No"){
      guestsNotInside.push(names)
    }
    
  }
  var guestsInside = 0;
  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    if(inside === "Yes"){
      guestsInside ++; 
      guestsAreInside.push(names)

      var a = document.createElement("a");
      var li = document.createElement("li")

      a.textContent = names;
      li.appendChild(a);
      ulInside.appendChild(li);
      a.setAttribute('id', names);
      a.setAttribute('onclick', 'setTextOut(id)');
    }
    
  }
  //********************Add if statment to change risk level photo based on guestsInside var **********************
  if(guestsInside === 1)
  {
    document.getElementById('currentInside').innerHTML = "There is currently: " + guestsInside + " guest inside";
  }
  else{
    document.getElementById('currentInside').innerHTML = "There are currently: " + guestsInside + " guests inside";
  }
  
}

function errData(err){
    console.log('Error!');
    console.log(err);
  }

//Search List function

function insideList() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("checkOut");
  filter = input.value.toUpperCase();
  ul = document.getElementById("namesInside");
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



function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = arr[i].substr(0, val.length);
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("checkInName"), guestsNotInside);
autocomplete(document.getElementById("checkOutName"), guestsAreInside);


