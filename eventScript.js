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
  for (var i = 0; i < names.length; i++)
  {
    firebase.database().ref('guestList/' + names[i]).set({
      name: names[i],
      Inside: "No",
      TimeIn: "n/a",
      TimeOut: "n/a",
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
  var nameg = document.getElementById("checkInName").value;
  if(nameg==null){
    alert("Please Enter a guest name!")
  }
  firebase.database().ref("guestList/"+nameg).once('value', function(snapshot){
    //Creates a new guest if they aren't on the list uploaded by the user
    if(snapshot.val() == "")
    {
      firebase.database().ref("guestList/"+nameg).set({
        name: nameg,
        Inside: "No",
        TimeIn: "n/a",
        TimeOut: "n/a",
      })

      //Checking people back in that have already been inside
      firebase.database().ref("guestList/"+nameg).once('value', function(snapshot){
        if(snapshot.val().Inside != "Yes")
      {
        if(snapshot.val().TimeIn != "n/a" && snapshot.val().TimeOut !="n/a")
        {
          firebase.database().ref("guestList/"+nameg).update({
            Inside: "Yes",
            TimeBackIn: getTime(),
            TimeBackOut: "n/a",
          })
        }
        else
        {
          firebase.database().ref("guestList/"+nameg).update({
          Inside: "Yes",
          TimeIn: getTime(),})
        }   
      }    
      alerts(nameg, true)
      document.getElementById("checkInName").value="";
      clickCounter();
    })}

    //Checks in user already on the guest list
    if(snapshot.val().Inside != "Yes")
      {
        if(snapshot.val().TimeIn != "n/a" && snapshot.val().TimeOut !="n/a")
        {
          firebase.database().ref("guestList/"+nameg).update({
            Inside: "Yes",
            TimeBackIn: getTime(),
            TimeBackOut: "n/a",
          })
        }
        else
        {
          firebase.database().ref("guestList/"+nameg).update({
          Inside: "Yes",
          TimeIn: getTime(),})
        }   
      }     
      alerts(nameg, true)
    document.getElementById("checkInName").value="";
    })
    }


//------------------------- Check Out ------------------------------------------------------------

function setTextOut(name){
  document.getElementById("checkOutName").value = name;
}

document.getElementById("checkOutBtn").onclick = function(){
  var namel = document.getElementById("checkOutName").value;
  firebase.database().ref("guestList/"+namel).once('value', function(snapshot){
    if(snapshot.val().Inside != "No")
    {
      if(snapshot.val().TimeIn != "n/a" && snapshot.val().TimeOut !="n/a")
        {
          firebase.database().ref("guestList/"+namel).update({
            Inside: "No",
            TimeBackOut: getTime(),
          })
        }
        else
        {
          firebase.database().ref("guestList/"+namel).update({
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
var ref = database.ref("guestList/")
ref.on('value', gotData, errData)

function gotData(data){
  //Momentarily clears both UI lists so items can be added w/o duplicates
  document.getElementById("names").innerHTML = "";
  document.getElementById("namesInside").innerHTML = "";
  

  var scores = data.val();
  var keys = Object.keys(scores);

  var ul = document.getElementById("names");
  var ulInside = document.getElementById("namesInside");

  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    var a =document.createElement("a");
    var li = document.createElement("li");

    a.textContent= names;
    li.appendChild(a);
    ul.appendChild(li);
    a.setAttribute('id', names);
    a.setAttribute('onclick', 'setTextIn(id)');
  }
  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    if(inside == "Yes"){
      var a = document.createElement("a");
      var li = document.createElement("li")

      a.textContent = names;
      li.appendChild(a);
      ulInside.appendChild(li);
      a.setAttribute('id', names);
      a.setAttribute('onclick', 'setTextOut(id)');
    }
    
  }
}

function errData(err){
    console.log('Error!');
    console.log(err);
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

