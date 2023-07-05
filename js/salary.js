$(".compute").click(function(){
    $("#appi").children().remove();
    if ($("#contractual").length > 0){ // if contractual emp
        var salary = 500 * $("#days").val();
        var roundedSal = salary.toFixed(2);   
    } else{ //if regular emp
        var salary = 20000 - ( 20000 * $("#absent").val() / 22) - ( 20000 * 0.12);
        var roundedSal = salary.toFixed(2);
    }
    $("#appi").empty();
    $("#appi").append("Salary is Php " + roundedSal); //show html
})