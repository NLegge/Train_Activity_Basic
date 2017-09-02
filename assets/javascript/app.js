// Initialize Firebase
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

  var trainName = "";
  var destination = "";
  var trainTime = 0;
  var frequency = 0;
  var nextTrain = 0;
  var minAway = 0;

  $(".btn").on("click", function(event){
  	event.preventDefault();
  	trainName = $("#trainName").val().trim();
  	destination = $("#destination").val().trim();
  	trainTime = $("#trainTime").val().trim();
  	frequency = $("#frequency").val().trim();
  	database.ref().push({
  	trainName: trainName,
  	destination: destination,
  	trainTime: trainTime,
  	frequency: frequency,
  	});
  });

  database.ref().on("child_added", function(childSnapshot) {
    frequency = childSnapshot.val().frequency;
    trainTime = childSnapshot.val().trainTime;
    var trainTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    var remainder = diffTime % frequency;
    var minAway = frequency - remainder;
    var nextCalc = moment().add(minAway, "minutes");
    nextTrain =  moment(nextCalc).format("HH:mm");
    $('tbody').append("<tr><td class='name'>" + childSnapshot.val().trainName + 
  	"</td><td class='dest'>" + childSnapshot.val().destination + 
  	"</td><td class='freq'>" + childSnapshot.val().frequency + 
  	"</td><td class='next'>" + nextTrain +
  	"</td><td class='min'>" + minAway +
  	"</td></tr>");
  	$("#trainName").val("");
  	$("#destination").val("");
  	$("#trainTime").val("");
  	$("#frequency").val("");
  }, 
  function(errorObject) {
  	console.log("Errors handled: " + errorObject.code);
  });
  
