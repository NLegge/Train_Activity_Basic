  //initialize firebase
  var config = {
    apiKey: "AIzaSyADLZranfV5qwbaFf-HMlG62lcGUojpySo",
    authDomain: "trainschedule-603fc.firebaseapp.com",
    databaseURL: "https://trainschedule-603fc.firebaseio.com",
    projectId: "trainschedule-603fc",
    storageBucket: "",
    messagingSenderId: "684287901004"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  //initilize variables
  var trainName = "";
  var destination = "";
  var trainTime = 0;
  var frequency = 0;
  var nextTrain = 0;
  var minAway = 0;

  $(".btn").on("click", function(event){
  	event.preventDefault();
  	//grab values from input forms on click
  	trainName = $("#trainName").val().trim();
  	destination = $("#destination").val().trim();
  	trainTime = $("#trainTime").val().trim();
  	frequency = $("#frequency").val().trim();
  	//push values to firebase on click
  	database.ref().push({
  	trainName: trainName,
  	destination: destination,
  	trainTime: trainTime,
  	frequency: frequency,
  	});
  });
  //when new train is added...
  database.ref().on("child_added", function(childSnapshot) {
  	//pull values from Firebase
    frequency = childSnapshot.val().frequency;
    trainTime = childSnapshot.val().trainTime;
    //find difference between current time and trainTime
    var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    //find how many minutes remain when you divide the difference by the frequency  
    var remainder = diffTime % frequency;
    //the frequency minus remainder is the minAway
    var minAway = frequency - remainder;
    //add current time to minutes away to get the next train time 
    var nextCalc = moment().add(minAway, "minutes");
    //convert nextTrain to military time
    nextTrain =  moment(nextCalc).format("HH:mm");
    //write to html
    $('tbody').append("<tr><td class='name'>" + childSnapshot.val().trainName + 
  	"</td><td class='dest'>" + childSnapshot.val().destination + 
  	"</td><td class='freq'>" + childSnapshot.val().frequency + 
  	"</td><td class='next'>" + nextTrain +
  	"</td><td class='min'>" + minAway +
  	"</td></tr>");
  	//clear input form fields
  	$("#trainName").val("");
  	$("#destination").val("");
  	$("#trainTime").val("");
  	$("#frequency").val("");
  }, 
  //log errors
  function(errorObject) {
  	console.log("Errors handled: " + errorObject.code);
  });
  
