$(document).ready(function () {
    $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    $('a.docs').click(function (e) {
        e.preventDefault;
        chrome.runtime.sendMessage({
            type: 'openIndex'
        });
    });
});