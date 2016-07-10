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
    getRatedItems: function (cb) {
        ratedItems.load(function (err, tableStats, metaStats) {
            if (!err) {
                var all = ratedItems.find();
                cb(all);
            }
        });
    },
    getCreditedItems: function (id, cb) {
        goldCredits.load(function (err, tableStats, metaStats) {
            if (!err) {
                var recieved = goldCredits.find({
                    recipientID: {
                        $eq: id
                    }
                });
                cb(recieved);
            }
        });
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
    writeComment: function (trans, cb) {
        comments.insert(trans);
        comments.save(function (err) {
            if (!err) {
                cb(trans.recipientID);
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
                var total = 0;
                for (var i = 0; i < result.length; i++) {
                    total += parseFloat(result[i].credits);
                }
                cb(total);
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
    hasVotedAlready: function (url, id, cb) {
        ratedItems.load(function (err, tableStats, metaStats) {
            if (!err) {
                var items = ratedItems.find({
                    $and: [{
                        url: url
    }, {
                        senderID: id
    }]
                });
                if (items.length > 0) {
                    cb(true);
                } else {
                    cb(false);
                }
            }
        });

    },
    getProfilePercentage: function (cb) {},
    getUserName: function (id, cb) {}
}