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
        question: "what is your favorite color?",
        choices: [
            { choice: "Red", correct: false },
            { choice: "Blue", correct: true },
            { choice: "Orange", correct: false },
            { choice: "Green", correct: false }
        ],
        image: "http://via.placeholder.com/350x150"
    },
    {
        question: "what is your quest?",
        choices: [
            { choice: "To seek the holy grail!", correct: false },
            { choice: "to make a bunch of money", correct: true },
            { choice: "To see gnomes at night", correct: false },
            { choice: "to walk on the sun", correct: false }
        ],
        image: "http://via.placeholder.com/350x150"
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