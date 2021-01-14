firebase.auth().onAuthStateChanged(function(user){
    if(user){
        console.log("logged in")
    }
});