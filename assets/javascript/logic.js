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
$("#submit").on("click", function (event) {
    event.preventDefault();
    console.log("entered @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // Grabs user input
    let trainName = $("#trainName").val().trim();
    let trainDest = $("#trainDest").val().trim();
    let trainFreq = $("#trainFreq").val().trim();
    let trainTime = $("#trainTime").val().trim(); //TODO: VALIDATE TIME IS FUTURE AND PROPERLY FORMATED

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

        // Logs everything to console
        // console.log(newTrain.name);
        // console.log(newTrain.dest);
        // console.log(newTrain.time);
        // console.log(newTrain.freq);

        // Clears all of the text-boxes
        document.getElementById('trainForm').reset();
    } else {      
        console.log("the time entered has incorrect format");
        alert("you entered an invalid time format");
    }
  });

  // 3. Create Firebase event for adding a train to the database 
  // // so that we can populate the html with new train 
  // database.ref("/trains").on("child_added", function(childSnapshot) {
  //   //console.log(childSnapshot.val());

  //   console.log("entered @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

  //   // Store everything into a variable.
  //   let trainName = childSnapshot.val().name;
  //   let trainDest = childSnapshot.val().dest;
  //   let trainTime  = childSnapshot.val().time;
  //   let trainFreq = childSnapshot.val().freq;

  //   // Train Info
  //   // console.log(trainName);
  //   // console.log(trainDest);
  //   // console.log(trainTime);
  //   // console.log(trainFreq);

  //   // format the time appropiately
  //   // let timedate = trainTime.split('T'); //["2017-06-01", "08:30"]
  //   // let formattedTime1 = timedate[0] +" "+timedate[1];
  //   // console.log(moment(formattedTime1,"X"));


  //   // Calculate the next trains arrival and how many minutes away it is
  //   let response = getTrainTime(trainTime,trainFreq)

  //   // Create the new row
  //   var newRow = $("<tr>").append(
  //     $("<td>").text(trainName),
  //     $("<td>").text(trainDest),
  //     $("<td>").text(trainFreq),
  //     $("<td>").text(response[0]),
  //     $("<td>").text(response[1]),
  //   );

  //   // Append the new row to the table
  //   $("#train-table > tbody").append(newRow);
  // });

  function validateTime() {

    // toISOString() will give current UTC Date. 
    // So to get the current local time we have to get getTimezoneOffset() 
    // and subtract it from current time
    // document.getElementById('dt').max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    //<input type="date" min='1899-01-01' id="dt" />


    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("datefield").setAttribute("max", today);
  }



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
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016

  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
