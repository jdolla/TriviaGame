function rand(min, max){
    return Math.floor(Math.random() * max) + min;
}

var clock = {
    self: $("#clock"),
    btn: $("#start-btn"),
    time: $("#time"),
    defTime: 10, //default time
    timer: null,

    setRounds: function(remaining){
        $("#rounds").text(remaining);
    },

    setStats: function(right, wrong){
        $("#won").text(right);
        $("#lost").text(wrong);
    },

    tick: function () {
        var seconds = parseInt($(clock.time).text());
        if (seconds > 0) {
            seconds -= 1;
            $(clock.time).html(seconds);
        }
        return seconds;
    },

    reset: function () {
        $(clock.time).html(clock.defTime);
    },

    start: function (callback) {
        $(clock.btn).hide(800);
        $(clock.self).switchClass("clock-btn", "clock-timer", 1000, function () {
            $("#timer").show(200);
            $(".ticking").show(200);
            if(callback != null){
                callback();
            }
        });
        clock.reset();
    },

    stop: function(){
        $(clock.btn).show(800);
        $(clock.self).switchClass("clock-timer", "clock-btn", 1000, function () {
            $("#timer").hide();
            $(".ticking").hide();
        });
    }
}

var questionSource = [
    {
        question: "What science fiction author coined the term 'Steam Punk'?",
        choices: [
            { choice: "K. W. Jeter", correct: true },
            { choice: "Phillip K. Dick", correct: false },
            { choice: "George R. R. Martin", correct: false },
            { choice: "Dr. Seuss", correct: false }
        ],
        image: "./assets/images/morlocks.jpg"
    },
    {
        question: "Steam Punk typically occurs in an alternate timeline in which steam powers technology instead of ___ ?",
        choices: [
            { choice: "Electricity", correct: true },
            { choice: "Internal Combustion", correct: false },
            { choice: "Solar Power", correct: false },
            { choice: "Gnomes", correct: false }
        ],
        image: "./assets/images/SteamPoweredSpaceShip.jpg"
    },
    {
        question: "This first-person shooter by 2k boston took many influences from steam punk.",
        choices: [
            { choice: "BioShock", correct: true },
            { choice: "Destiny", correct: false },
            { choice: "Half Life", correct: false },
            { choice: "Counter Strike", correct: false }
        ],
        image: "./assets/images/bioshock.jpg"
    }
]

var question = (function(src){
    var private = {
        question: "",
        choices: [],
        image: ""
    }

    private.question = src.question;
    private.choices = src.choices.slice();
    private.image = src.image;

    return {
        getQuestion: function(){
            return private.question;
        },
        getChoice: function(){
            if(private.choices.length === 0){
                return null;
            }
            else{
                var i = rand(0, private.choices.length);
                var choice = private.choices.splice(i,1)[0];
                var button = $("<button>", {"class":"choice-btn", "data-correct":choice.correct});
                $(button).text(choice.choice);
                return button;
            }
        },
        getImage: function(){
            return private.image;
        }
    }
})

var game = {
    right: 0,
    wrong: 0,
    questionBank: [],
    gameBox: $("#game-box"),
    answerBox: $("#answer-box"),
    questionBox: $("#question-box"),
    revealBox: $("#reveal-box"),
    choiceBox: $("#choice-box"),
    intervalTimer: null,

    loadQuestions: function(){
        //load the question bank
        game.questionBank = [];
        for (var i = 0; i < questionSource.length; i++){
            game.questionBank.push(
                new question(questionSource[i])
            );
        }
    },

    start: function(){
        game.loadQuestions();
        game.right = 0;
        game.wrong = 0;

        clock.reset();
        clock.setStats(0, 0);
        clock.setRounds(game.questionBank.length);

        game.nextQuestion();

        clock.start(function(){
            $(game.gameBox).show();
        });
    },

    tick: function(){
        var seconds = clock.tick();
        if(seconds === 0){
            clearInterval(game.intervalTimer);
            game.showAnswer("false");
        }
    },

    nextQuestion: function(){

        if($(game.revealBox).is(":visible")){
            $(game.revealBox).hide();
        }
        if($(game.questionBox).is(":visible")){
            $(game.questionBox).hide();
        }

        if(game.questionBank.length > 0){
            $("#choice-box").empty();
            var i = rand(0, game.questionBank.length);
            var q = game.questionBank.splice(i, 1)[0];
            $("#question").text(q.getQuestion());
        
            var c = q.getChoice();
            while (c != null){
                $("#choice-box").append(c);
                c = q.getChoice();
            }
            clock.setRounds(game.questionBank.length);
            $("#reveal-image").attr("src", q.getImage());

            $(game.questionBox).show();
            game.intervalTimer = setInterval(game.tick, 1000);

        }
        else { 
            $(game.questionBox).show();
            $(game.gameBox).hide();
            clock.stop();
        }
    },

    showAnswer: function(correct){
        
        clearInterval(game.intervalTimer);
        clock.reset();

        if(correct === 'true'){
            $(game.answerBox).html("That is the correct answer!");
            game.right++;
        }
        else {
            game.wrong++;
            var choices = $(game.choiceBox).children();
            var correctAnswer = "";
            for(var i = 0; i < choices.length; i++){
                if($(choices[i]).attr("data-correct") === 'true'){
                    correctAnswer = $(choices[i]).text();
                }
            }
            $(game.answerBox).html("The correct answer was:  " + correctAnswer);
        }
        
        $(game.questionBox).hide();
        $(game.revealBox).show();
        
        clock.setStats(game.right, game.wrong);
        
        var timeout = setTimeout(function(){
            game.nextQuestion();
        }, 3000);
    }
}

$(document).ready(function () {

    $(clock.btn).click(game.start);
    $("#retry-btn").click(game.start);

    $("#choice-box").on("click", ".choice-btn", function(){
        game.showAnswer($(this).attr("data-correct"));
    });


});