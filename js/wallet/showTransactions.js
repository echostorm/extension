/* 
    list transactions for the currently logged in user and display on default popup */

$(document).ready(function () {
    var count = 0;
    chrome.storage.local.get('user', function (result) {
        var isEmpty = jQuery.isEmptyObject(result);
        if (!isEmpty) {
            db.getTransactionsForUser(result.user.usrPubKey, function (count) {
                $('.gmc-wallet-balance span').html(count);
            });
        } else {
            console.log("You are not logged in");
        }
    });
});