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
                console.log("Vanity signature generated. Sending transaction for verification...");
                riu.push(data);
                /* setnet */
                var filePath = data.transactionID;

                Safe.nfs.createFile(filePath, {
                    metadata: 'rated_item',
                    isVersioned: false,
                    isPathShared: true
                }).then(function () {
                    console.log('Created file. Now go add content!');
                    Safe.nfs.updateFile(filePath, data, {
                        isPathShared: true,
                    }).then(function () {
                        console.log('Updated file. Fetching now...');
                        options = {
                            isPathShared: true
                        };
                        Safe.nfs.getFile(filePath, options).then(function (file) {
                            console.log(file);
                        });
                    });

                });

                /* end safenet */
                vote.balance(true, 1);
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
                vote.updateBalance(result.user.usrPubKey, function (pushID) {
                    if (pushID != null) {
                        var ref = new Firebase('https://givemecredit.firebaseio.com/silver_credits_balance/' + pushID + '/balance');
                        if (add == true) {
                            ref.transaction(function (current_value) {
                                return (current_value || 0) + amount;
                            });
                        } else {
                            ref.transaction(function (current_value) {
                                return (current_value || 0) - amount;
                            });
                        }

                    } else {
                        data.userID = result.user.usrPubKey;
                        data.balance = 1;
                        scb.push(data);
                        $('.gmc-scr-value').html(1);
                    }
                });
            } else {
                console.log("You are not logged in");
            }
        });
    },
    updateBalance: function (userID, cb) {
        scb.once("value", function (snapshot) {
            var item = snapshot.val();
            if (item == null) {
                cb(null);
            }
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if (item.userID == userID) {
                    var pushID = childSnapshot.key();
                    cb(pushID);
                } else {
                    cb(null);
                }
            });
        });
    }
}