
$(document).ready(function(){

    $("#start-btn").click(function(){
        $(this).hide();
        $("#clock").switchClass("clock-btn", "clock-timer", 1000, function(){
            $("#game-box").show();
            $("#timer").show(200);
            $(".ticking").show();
        });
        
    })

});