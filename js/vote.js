/*
- change opacity of toolbar to indicate that user cannot vote on same article twice
- get current page url
- get JSON object from tables.js and set values
- write JSON object to gunDB
*/
var vote = {
    vote: function (score) {
        //Toolbar.darken();
        var pageURL = window.location.href;
        var data = tables.get_riu_JSON();
        data.url = pageURL;
        data.isUpVote = score;
        chrome.storage.local.get('user', function (result) {
            var isEmpty = jQuery.isEmptyObject(result);
            if (!isEmpty) {
                data.senderID = result.user.usrPubKey;
                //IMPORTANT : the transactionID is the signature
                data.transactionID = getVanityKeys.getVanitySig(data, result.user.usrPrvKey, 1);
                // write the transaction to the database (db.js)
                $.when(db.sendVote(data)).then(
                    function () {
                        vote.balance(true, 1);
                    }
                );
            } else {
                console.log("You are not logged in");
            }
        });
    },
    balance: function (add, amount) {
        var data = tables.get_scb_JSON();
        chrome.storage.local.get('user', function (result) {
            var isEmpty = jQuery.isEmptyObject(result);
            if (!isEmpty) {
                db.updateBalance(result.user.usrPubKey, function (pushID) {
                    if (pushID != null) {
                        db.writeBalance(add, pushID, amount);
                    } else {
                        data.userID = result.user.usrPubKey;
                        data.balance = 1;
                        $.when(db.createNewBalance(data)).then(
                            function () {
                                $('.gmc-scr-value').html(1);
                            }
                        );
                    }
                });
            } else {
                console.log("You are not logged in");
            }
        });
    }
}