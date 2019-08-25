$(document).ready(function () {

  $("#image1").hide();
  $("#image2").hide();
  $("#start").on('click', triviaDetails.startGame);
  $(document).on('click', '.option', triviaDetails.guessChecker);

})

var triviaDetails = {
  // trivia properties and setup tallies
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 10,
  timerOn: false,
  timerId: '',
  // questions options and answers
  questions: {
    q1: "What is Batmans real name?",
    q2: "Batman is also referred to as the Caped what?",
    q3: "Batman operates in what fictional city?",
    q4: "Who is Batmans side-kick?",
    q5: "Who is Batman’s archenemy?",
    q6: "While Batman does not possess any superpowers, he is well versed in?",
    q7: "What is the name of Batman's Butler/Best Friend?"
  },
  options: {
    q1: ["Bruce Jenner", "Bruce Wayne", "Bruce Bruce", "Bruce Banner"],
    q2: ["Hero", "Bat", "Crusader", "Detective"],
    q3: ["Metropalis", "Gotham City", "Atlantis", "Bludhaven"],
    q4: ["Nightwing", "Bat Girl", "Alfred", "Robin"],
    q5: ["The Joker", "Two-Face", "Cat Woman", "The Penguin"],
    q6: ["Languages", "Martial Arts", "Manipulation", "Charm"],
    q7: ['Jim Gordon', 'Lucius Fox', 'Harvey Dent', 'Alfred Pennyworth']
  },
  answers: {
    q1: "Bruce Wayne",
    q2: "Crusader",
    q3: "Gotham City",
    q4: "Robin",
    q5: "The Joker",
    q6: "Martial Arts",
    q7: "Alfred Pennyworth"
  },

  // Function to start the game
  startGame: function () {
    // reset game results
    triviaDetails.currentSet = 0;
    triviaDetails.correct = 0;
    triviaDetails.incorrect = 0;
    triviaDetails.unanswered = 0;
    clearInterval(triviaDetails.timerId);

    // show the game section
    $('#game').show();

    //  empty results 
    $('#results').html('');

    // remove start button once game starts
    $('#start').hide();

    // show the remaining time
    $('#remaining-time').show();

    $("#image1").hide();

    $("#image2").hide();

    // ask the first question
    triviaDetails.nextQuestion();

  },
  // method to loop through and display questions and options 
  nextQuestion: function () {

    // set timer to 10 seconds each question
    triviaDetails.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(triviaDetails.timer);
    $("#image1").hide();
    $("#image2").hide();

    // this will prevent the timer from starting too soon once switching to the next question n- wati 1 second
    if (!triviaDetails.timerOn) {
      triviaDetails.timerId = setInterval(triviaDetails.timerRunning, 1000);
    }

    // gets all the questions then indexes the current questions
    var questionContent = Object.values(triviaDetails.questions)[triviaDetails.currentSet];
    $('#triviaQuestion').text(questionContent);

    // an array of all the user options for the current question
    var questionOptions = Object.values(triviaDetails.options)[triviaDetails.currentSet];

    // tie the answer options to the buttons
    $.each(questionOptions, function (index, key) {
      $('#options').append($('<button class="option btn btn-info btn-lg" style="color: yellow; background:black; border: 1px solid black">' + key + '</button>'));
    })

  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning: function () {
    // if timer still has time left and there are still questions left to ask
    if (triviaDetails.timer > -1 && triviaDetails.currentSet < Object.keys(triviaDetails.questions).length) {
      $('#timer').text(triviaDetails.timer);
      triviaDetails.timer--;
      if (triviaDetails.timer === 4) {
        $('#timer').addClass('last-seconds');
      }
    }
    // the time has run out and increment unanswered, tally the result
    else if (triviaDetails.timer === -1) {
      triviaDetails.unanswered++;
      triviaDetails.result = false;
      clearInterval(triviaDetails.timerId);
      resultId = setTimeout(triviaDetails.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was ' + Object.values(triviaDetails.answers)[triviaDetails.currentSet] + '</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if (triviaDetails.currentSet === Object.keys(triviaDetails.questions).length) {

      // adds results of game to the page and display them on the last screen 
      $('#results')
        .html('<h3>Thank you for playing!</h3>' +
          '<p>Correct: ' + triviaDetails.correct + '</p>' +
          '<p>Incorrect: ' + triviaDetails.incorrect + '</p>' +
          '<p>Unaswered: ' + triviaDetails.unanswered + '</p>' +
          '<p>Start Over!</p>');

      // hide game sction
      $('#game').hide();

      // show start button to start game over
      $('#start').show();
    }

  },
  // funtion to track the guess being made and determine if correct or incorrect
  guessChecker: function () {

    // timer ID for gameResult setTimeout
    var resultId;

    // set the correct anwer to the current question and set of answers
    var currentAnswer = Object.values(triviaDetails.answers)[triviaDetails.currentSet];

    // check if the guess matches the correct answer and tally the correct answer
    if ($(this).text() === currentAnswer) {
      triviaDetails.correct++;
      $("#image1").show();
      clearInterval(triviaDetails.timerId);
      resultId = setTimeout(triviaDetails.guessResult, 3000);
      $('#results').html('<h3>Boom! You are correct!</h3>');

    }
    // else tally the incorrect answer
    else {
      triviaDetails.incorrect++;
      $('#image2').show();
      clearInterval(triviaDetails.timerId);
      resultId = setTimeout(triviaDetails.guessResult, 3000);
      $('#results').html('<h3>Pow! Sorry that is incorrect: ' + currentAnswer + ' was the correct answer!</h3>');

    }

  },
  // method to remove previous question results and options
  guessResult: function () {

    // move onto to next question and options
    triviaDetails.currentSet++;

    // remove any of the options and results
    $('.option').remove();
    $('#results h3').remove();

    // start the next question
    triviaDetails.nextQuestion();
  }
}