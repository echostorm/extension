(function ($) {
    var current_width = $(window).width();
    if (current_width < 850) {
        $('#col-left ul').addClass("mobile");
    } else {
        $('#col-left ul').removeClass("mobile");
    }

    $(window).resize(function () {
        var current_width = $(window).width();
        if (current_width < 850) {
            $('#col-left ul').addClass("mobile");
        } else {
            $('#col-left ul').removeClass("mobile");
        }
    });

    $("#col-left a.btn").on("click", function () {
        alert("test");
        $("#col-left ul").toggle('fast');
    });
    $("#col-left ul li a").on("click", function () {
        if ($("#col-left ul").hasClass('mobile')) {
            $("#col-left ul").hide('fast');
        }
    });
})(jQuery);