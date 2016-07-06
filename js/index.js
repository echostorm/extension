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
            var rec = {
                transID: result[i]._id,
                url: truncate(result[i].url),
                senderID: truncate(result[i].senderID),
                senderSig: truncate(result[i].senderSig)
            };
            var html = Mustache.to_html(template, rec);
            $('#ratedItems tbody').prepend(html);
        }
        $('#ratedItems').DataTable();
    });

    var creditedItemsTpl = $('#creditedItemsTpl').html();
    db.getCreditedItems(function (result) {
        for (var i = 0; i < result.length; i++) {
            var rec = {
                transID: result[i]._id,
                url: truncate(result[i].url),
                credits: result[i].credits,
                senderID: truncate(result[i].senderID),
                senderSig: truncate(result[i].recipientID)
            };
            var html = Mustache.to_html(template, rec);
            $('#creditedItems tbody').prepend(html);
        }
        $('#creditedItems').DataTable();
    });
});