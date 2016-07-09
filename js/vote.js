/*
- change opacity of toolbar to indicate that user cannot vote on same article twice
- get current page url
- write JSON object to DB
*/
var vote = {
    vote: function (score) {
        chrome.storage.local.get('user', function (result) {
            var isEmpty = jQuery.isEmptyObject(result);
            if (!isEmpty) {
                var pageURL = window.location.href;
                db.hasVotedAlready(pageURL, result.user.usrPubKey, function (hasVoted) {
                    //if (hasVoted) {
                    //alert("You cannot rate the same item more than once.");
                    //return;
                    //} else { commented out for testing

                    Toolbar.darken();
                    var newVote = {
                        _id: new Date().toISOString(),
                        url: pageURL,
                        isUpVote: score,
                        senderID: null,
                        senderSig: null
                    }

                    newVote.senderID = result.user.usrPubKey;
                    newVote.senderSig = keys.sign(result.user.usrPrvKey, newVote);
                    // write the transaction to the database (db.js)

                    db.sendVote(newVote, function (bal) {
                        $('.gmc-scr-value').html(bal);
                    });
                    //} commented out for testing
                });
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