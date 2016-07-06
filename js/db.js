var fdb = new ForerunnerDB();
var gmc = fdb.db("give_me_credit_DB");
var ratedItems = gmc.collection("rated_items");
var goldCredits = gmc.collection("gold_credits");
var userData = gmc.collection("user_data");
var comments = gmc.collection("comments");
var transactions = gmc.collection("transactions");

var db = {
    sendVote: function (trans, cb) {
        ratedItems.insert(trans);
        ratedItems.save(function (err) {
            if (!err) {
                //console.log("rated_items save was successful");
                db.getPagePercentage(function (percentage, numRecords) {
                    var $itemScore = jQuery('.gmc-item-score span');
                    if (numRecords != 0) {
                        $itemScore.html(percentage.toFixed(0));
                    }
                });
            }
        });
        var balance = ratedItems.find({
            senderID: {
                $eq: trans.senderID
            }
        });
        console.log(balance[0]);
        cb(balance.length);
    },
    getPagePercentage: function (cb) {
        var totRecs = ratedItems.find({
            url: {
                $eeq: window.location.href
            }
        });
        var upVotes = ratedItems.find({
            $and: [{
                url: window.location.href
    }, {
                isUpVote: {
                    $eeq: true
                }
    }]
        });
        score = (upVotes.length / totRecs.length) * 100;
        cb(score, totRecs.length);
    },
    getScrBal: function (senderID, cb) {
        var silverBal = ratedItems.find({
            senderID: {
                $eq: senderID
            }
        });
        var creditsGiven = goldCredits.find({
            senderID: {
                $eq: senderID
            }
        });
        cb(silverBal.length - creditsGiven.length);
    },
    sendGoldCredits: function (trans) {
        goldCredits.insert(trans);
        goldCredits.save(function (err) {
            if (!err) {
                //console.log("gold credits save was successful");
            }
        });
        var creditsGiven = goldCredits.find({
            senderID: {
                $eq: trans.senderID
            }
        });
        console.log(creditsGiven[0]);
    },
    writeUserData: function (trans) {
        userData.insert(trans);
        userData.save(function (err) {
            if (!err) {
                //console.log("user data save was successful");
            }
        });
    },
    getUserData: function (id, cb) {
        userData.load(function (err, tableStats, metaStats) {
            if (!err) {
                var result = userData.find({
                    userID: {
                        $eq: id
                    }
                });
                var date = new Date(result[0].regDate);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var newDate = day + "/" + month + "/" + year;

                var ud = {
                    newDate: newDate,
                    name: result[0].name,
                    about: result[0].about,
                    email: result[0].email,
                    profilePicURL: result[0].profilePicURL
                }
                cb(ud);
            }
        });
    },
    getProfilePicForUser: function (pubKey, cb) {
        userData.load(function (err, tableStats, metaStats) {
            if (!err) {
                var result = userData.find({
                    userID: {
                        $eq: pubKey
                    }
                });
                cb(result[0].profilePicURL);
            }
        });
    },
    writeComment: function (trans) {
        comments.insert(trans);
        comments.save(function (err) {
            if (!err) {
                //console.log("comments save was successful");
            }
        });
    },
    getComments: function (currentUser, cb) {
        comments.load(function (err, tableStats, metaStats) {
            if (!err) {
                var result = comments.find({
                    recipientID: {
                        $eq: currentUser
                    }
                });
                cb(result);
            }
        });
    },
    getCommenterInfo: function (commenter, cb) {
        userData.load(function (err, tableStats, metaStats) {
            if (!err) {
                var result = userData.find({
                    userID: {
                        $eq: commenter
                    }
                });
                cb(result);
            }
        });
    },
    countGoldCredits: function (id, cb) {
        goldCredits.load(function (err, tableStats, metaStats) {
            if (!err) {
                var result = goldCredits.find({
                    recipientID: {
                        $eq: id
                    }
                });
                cb(result.length);
            }
        });
    },
    updateAboutText: function (id, aboutText) {
        userData.update({
            userID: {
                $eq: id
            }
        }, {
            about: aboutText
        });

        userData.save(function (err) {
            if (!err) {
                //console.log("user data save was successful");
            }
        });
    },
    sendTransaction: function (trans) {
        transactions.insert(trans);
        transactions.save(function (err) {
            if (!err) {
                //console.log("transaction save was successful");
            }
        });
        var transList = ratedItems.find({
            $and: [{
                senderID: trans.senderID
    }, {
                recipientID: trans.senderID
    }]
        });
        console.log(transList);
    },
    onBalChange: function (cb) {},
    updateBalance: function (userID, cb) {},
    writeBalance: function (add, pushID, amount) {},
    createNewBalance: function (trans) {},
    getProfilePercentage: function (cb) {},
    getUserName: function (id, cb) {},
    getTransactionsForUser: function (usrPubKey, cb) {},

}


/*
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
    },
    getUserPushID: function (id, cb) {
        ud.on("child_added", function (snapshot) {
            var user = snapshot.val();
            if (user.userID == id) {
                var key = snapshot.key();
                cb(key);
            }
        });
    },
    updateAboutText: function (key, aboutText) {
        var url = 'https://givemecredit.firebaseio.com/user_data/' + key;
        var ref = new Firebase(url);
        ref.update({
            about: aboutText
        });
    }
}*/