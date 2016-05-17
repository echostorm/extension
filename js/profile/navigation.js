// page routing
// TO DO: cache the dom

var nav = {
    init: function () {
        $('#col-left ul.tabs li').on('click', function () {
            var tab_id = $(this).attr('data-tab');
            $('#col-left ul.tabs li').removeClass('current');
            $('.tab-content').removeClass('current');
            $(this).addClass('current');
            if (tab_id == 'tab-1') {
                animate.rotateProfilePic();
            }
            $("#" + tab_id).addClass('current animated fadeInLeft');
        });
    },
    mobile: function () {
        $("#col-left .btn").on('click', function () {
            toggleNav();
            $('#col-left ul.tabs li').on('click', function () {
                toggleNav();
            });
        });

        function toggleNav() {
            if (!$(this).attr('data-toggled') || $(this).attr('data-toggled') == 'off') {
                $(this).attr('data-toggled', 'on');
                $("#col-left ul.tabs").show('fast');
            } else if ($(this).attr('data-toggled') == 'on') {
                $(this).attr('data-toggled', 'off');
                $("#col-left ul.tabs").hide('fast');
            }
        }
    }
}