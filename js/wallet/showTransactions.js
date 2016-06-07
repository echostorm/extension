/* 
    list transactions for the currently logged in user and display on default popup */

$(document).ready(function () {
    //var count = 0;
    chrome.storage.local.get('user', function (result) {
        var isEmpty = jQuery.isEmptyObject(result);
        if (!isEmpty) {
            db.getTransactionsForUser(result.user.usrPubKey,
                function (data) {
                    console.log(data);
                    $('.transList').append("<li><span>" + data.from +
                        "</span><span>" + data.to + "</span><span>" + data.credits +
                        "</span></li>");

                    $('.gmc-wallet-balance span').html(data.count);
                });
        } else {
            console.log("You are not logged in");
        }
    });
});