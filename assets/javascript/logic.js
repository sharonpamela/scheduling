// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyD289sGibZ-CP_vaKC0i_fEcWJsivI9dGk",
  authDomain: "scheduling-a73f8.firebaseapp.com",
  databaseURL: "https://scheduling-a73f8.firebaseio.com",
  projectId: "scheduling-a73f8",
  storageBucket: "",
  messagingSenderId: "847054533508"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#submitButton").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    let trainName = $("#trainName").val().trim();
    let trainDest = $("#trainDest").val().trim();
    let trainFreq = $("#trainFreq").val().trim();
    let trainTime = $("#trainTime").val().trim();

    let timeIsValid = /^([0-5]\d):([0-5]\d)$/.test(trainTime); 
    console.log(timeIsValid);


    if (timeIsValid === true){
        // Creates local "temporary" object for holding train data
        let newTrain = {
            name: trainName,
            dest: trainDest,
            time: trainTime,
            freq: trainFreq
        };

        // Uploads train data to the database
        database.ref("/trains").push(newTrain);

        // Show alert
        document.querySelector('.alert').style.display = 'block';

        // Hide alert after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').style.display = 'none';
        },3000);

        // Clears all of the text-boxes
        document.getElementById('trainForm').reset();
    } else {      
        console.log("the time entered has incorrect format");
        // Show time alert
        document.querySelector('#alertTime').style.display = 'block';
        // Hide alert after 3 seconds
        setTimeout(function(){
            document.querySelector('#alertTime').style.display = 'none';
        },6000);
    }
  });

  // 3. Create Firebase event for adding a train to the database 
  database.ref("/trains").on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    let trainName = childSnapshot.val().name;
    let trainDest = childSnapshot.val().dest;
    let trainTime  = childSnapshot.val().time;
    let trainFreq = childSnapshot.val().freq;

    // Calculate the next trains arrival and how many minutes away it is
    let response = getTrainTime(trainTime,trainFreq)

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(response[0]),
      $("<td>").text(response[1]),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });

  function getTrainTime(trainTime, trainFreq) {

    // Assumptions
    let tFrequency = trainFreq;

    // Time of first train
    let firstTime = trainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    let firstTimeConverted = moment("03:40", "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log("freq: " + tFrequency);
    console.log("reminder: " + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    return ([nextTrain, tMinutesTillTrain]);
  }
