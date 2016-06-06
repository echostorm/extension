/* create a reference to the root of Firebase database */
var riu = new Firebase('https://givemecredit.firebaseio.com/rated_item_unconfirmed');
var ric = new Firebase('https://givemecredit.firebaseio.com/rated_item_confirmed');
var vri = new Firebase('https://givemecredit.firebaseio.com/valid_rated_item');
var ud = new Firebase('https://givemecredit.firebaseio.com/user_data');
var pd = new Firebase('https://givemecredit.firebaseio.com/profile_data');
var scb = new Firebase('https://givemecredit.firebaseio.com/silver_credits_balance');
var ciu = new Firebase('https://givemecredit.firebaseio.com/credited_item_unconfirmed');
var cic = new Firebase('https://givemecredit.firebaseio.com/credited_item_confirmed');
var vci = new Firebase('https://givemecredit.firebaseio.com/valid_credited_item');
var tu = new Firebase('https://givemecredit.firebaseio.com/transaction_unconfirmed');
var comments = new Firebase('https://givemecredit.firebaseio.com/comments');


var db = {
    sendGoldCredits: function (trans) {
        ciu.push(trans);
    },
    sendVote: function (trans) {
        riu.push(trans);
    },
    writeUserData: function (trans) {
        ud.push(trans);
    },
    sendTransaction: function (trans) {
        tu.push(trans);
    },
    getUserName: function (id, cb) {
        ud.on("child_added", function (snapshot) {
            var item = snapshot.val();
            if (item.userID == id) {
                cb(item.name);
            }
        });
    },
    getTransactionsForUser: function (usrPubKey, cb) {
        ciu.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if ((item.senderID == usrPubKey) || (item.recipientID == usrPubKey)) {
                    db.getUserName(item.senderID, function (from) {
                        var from = from;
                        db.getUserName(item.recipientID, function (to) {
                            var to = to;
                            //this should not be here
                            $('.transList').append("<li><span>" + from + "</span><span>" + to + "</span><span>" + item.credits + "</span></li>");
                        });
                    });
                }
                if (item.recipientID == usrPubKey) {
                    count += parseInt(item.credits);
                    cb(count);
                }
            });
        });
    },
    getProfilePicForUser: function (pubKey, cb) {
        ud.on("child_added", function (snapshot) {
            var user = snapshot.val();
            if (user.userID == pubKey) {
                cb(user.profilePicURL);
            }
        });
    }
}