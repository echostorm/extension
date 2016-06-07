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
    getUserData: function (id, cb) {
        ud.on("child_added", function (snapshot) {
            var user = snapshot.val();
            if (user.userID == id) {
                var date = new Date(user.regDate);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var newDate = day + "/" + month + "/" + year;

                var userData = {
                    newDate: newDate,
                    name: user.name,
                    about: user.about,
                    email: user.email,
                    profilePicURL: user.profilePicURL
                }
                cb(userData);
            }
        });
    },
    getTransactionsForUser: function (usrPubKey, cb) {
        var transList = {
            to: null,
            from: null,
            credits: null,
            count: null
        }
        ciu.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if ((item.senderID == usrPubKey) ||
                    (item.recipientID == usrPubKey)) {
                    db.getUserName(item.senderID, function (from) {
                        transList.from = from;
                        db.getUserName(item.recipientID, function (to) {
                            transList.to = to;
                            transList.credits = item.credits;
                        });
                        transList.count += parseInt(item.credits);
                        cb(transList);
                    });
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
    },
    showComments: function (currentUser, cb) {
        var totalComments = 0;
        var sumOfRatings = 0;
        var template = $('#commentTpl').html();
        comments.on("child_added", function (snapshot) {
            var comment = snapshot.val();
            if (comment.recipientID == currentUser) {
                //get comment.senderID from ud and find profile pic
                ud.on("child_added", function (data) {
                    var user = data.val();
                    if (user.userID == comment.senderID) {
                        var newComment = {
                            comment: comment.comment,
                            commenter: user.name,
                            commenterID: user.userID,
                            img: user.profilePicURL
                        };
                        var html = Mustache.to_html(template, newComment);
                        $('#profileComments').prepend(html);
                    }
                    $(".rating").rateYo({
                        starWidth: "20px",
                        readOnly: true,
                        rating: comment.stars
                    });
                    totalComments++;
                    sumOfRatings += comment.stars;
                    cb(totalComments, sumOfRatings);
                });
            }
        });
    },
    writeComment: function (trans) {
        comments.push(trans);
    },
    countGoldCredits: function (id, cb) {
        var count = 0;
        ciu.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if (item.recipientID == id) {
                    count += parseFloat(item.credits);
                }
            });
            cb(count);
        });
    },
    getScrBal: function (cb) {
        chrome.storage.local.get('user', function (result) {
            var isEmpty = jQuery.isEmptyObject(result);
            if (!isEmpty) {
                scb.on("child_added", function (snapshot) {
                    var item = snapshot.val();
                    if (item.userID == result.user.usrPubKey) {
                        cb(item.balance);
                    }
                });
            } else {
                console.log("You are not logged in");
            }
        });
    },
    onBalChange: function (cb) {
        chrome.storage.local.get('user', function (result) {
            var isEmpty = jQuery.isEmptyObject(result);
            if (!isEmpty) {
                scb.on("child_changed", function (snapshot) {
                    var item = snapshot.val();
                    if (item.userID == result.user.usrPubKey) {
                        cb(item.balance);
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
    },
    writeBalance: function (add, pushID, amount) {
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
    },
    createNewBalance: function (trans) {
        scb.push(trans);
    },
    getPagePercentage: function (cb) {
        var percentage = 0;
        var countMatched = 0;
        var countUpVote = 0;
        riu.on("child_added", function (snapshot) {
            var item = snapshot.val();
            if (item.url == window.location.href) {
                countMatched++;
                if (item.isUpVote) {
                    countUpVote++;
                }
            }
            percentage = (countUpVote / countMatched) * 100;
            percentage = Math.round(percentage);
            cb(percentage, countMatched);
        });
    },
    getProfilePercentage: function (cb) {
        var totalComments = 0;
        var sumOfRatings = 0;
        comments.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if (item.recipientID == Widget.getAddress()) {
                    totalComments++;
                    sumOfRatings += item.stars;
                }
            });
            cb(totalComments, sumOfRatings);
        });
    }
}