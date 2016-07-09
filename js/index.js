/* This is for the index.html file */

$(document).ready(function () {
    $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    function truncate(string) {
        if (string.length > 50)
            return string.substring(0, 50) + '...';
        else
            return string;
    };

    var template = $('#ratedItemsTpl').html();
    db.getRatedItems(function (result) {
        for (var i = 0; i < result.length; i++) {
            //console.log(result[i].isUpVote);
            if (result[i].isUpVote == true) {
                $('#ratedItems td i').addClass('fa-thumbs-o-up');
            } else {
                $('#ratedItems td i').addClass('fa-thumbs-o-down');
            }
            var recRated = {
                transID: result[i]._id,
                url: truncate(result[i].url),
                senderID: truncate(result[i].senderID),
            };
            var html = Mustache.to_html(template, recRated);
            $('#ratedItems tbody').prepend(html);
        }
        $('#ratedItems').DataTable();
    });
});