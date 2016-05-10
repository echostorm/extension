$(document).ready(function () {
    verify.verifyRiu();
    verify.verifyUd();
    verify.verifyCiu();
    /*
    - get current page score
    - display/initialize toolbar
    - check if link exists that matches criteria
    - count authors gold credits (to do)
    - grab the content authors details
    - if link matches criteria replace it with widget and show profile tab
    */

    countSilverCredits(function (count) {
        $('.gmc-scr-value').html(count);
        // send to background script so that wallet.js can check the balance
        chrome.runtime.sendMessage({
            type: 'balance',
            balance: count
        });
    });

    //countRecords.userSilver();

    function countSilverCredits(cb) {
        var count = 0;
        chrome.storage.local.get('user', function (result) {
            riu.on().map(function (data) {
                if (data.senderID == result.user.usrPubKey) {
                    count++;
                    cb(count);
                }
            });
        });
    }


    //scb node is set in countRecords.js
    //scb.on().map(function (data) {
    // TO DO: check userID first
    //});

    Percentage.getPagePercentage(function (percentage, countMatched) {
        var $itemScore = jQuery('.gmc-item-score span');
        if (countMatched != 0) {
            $itemScore.html(percentage);
            Percentage.checkItemPercentage(percentage);
        } else {
            $itemScore.html("0");
        }
    });

    Toolbar.init();
    Widget.checkLink();

    if (Widget.$linkContainingKey.length) {
        Widget.author();
        Widget.createWidget();
        Toolbar.showAuthorIcon();

        $('.gmc-profile-author img').attr("src", "http://pic.1fotonin.com/data/wallpapers/59/WDF_1048452.jpg");

        chrome.runtime.sendMessage({
            type: 'recipient',
            recipientID: Widget.getAddress()
        });
    }

    $('.gmc-arrow-up').on('click', function () {
        Widget.onArrowUpClick();
    });

    $('.gmc-arrow-down').on('click', function () {
        Widget.onArrowDownClick();
    });

    /*
    Have you removed the css for this too?
    var $textarea = $(".gmc-message textarea");
    $textarea.on('focus', function () {
        $textarea.val('');
    });*/

    $('.gmc').on('click', function () {
        Give.giveCredit();
    });

    $('.gmc-vote-up').click(function () {
        vote.vote(true);
    });

    $('.gmc-vote-down').click(function () {
        vote.vote(false);
    });

    /* show users profile in popup (background.js) */

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.type == 'setUserData') {
            ud.set(gun.put(request.data).key(request.key));
        }

        if (request.type == 'getProfilePicURL') {
            gun.get(request.senderID).path('profilePicURL').val(function (result) {
                sendResponse({
                    profilePicURL: result
                });
            });
        }

        /* This code adds a new comment. It works but i wasn't able to read the comments back to profile.js. For now i have just made the gun calls from profile.js, but i think it would be better to have the all gun calls in one script eventually.

                if (request.type == 'addComment') {
                    var commentsJSON = tables.get_comments_JSON();
                    commentsJSON.recipientID = '123xyz';
                    commentsJSON.comment = request.newComment;
                    commentsJSON.stars = request.stars;
                    chrome.storage.local.get('user', function (data) {
                        commentsJSON.profilePicURL = result;
                        commentsJSON.senderID = data.user.usrPubKey;
                        commentsJSON.senderSig = getVanityKeys.getVanitySig(commentsJSON, data.user.usrPrvKey, 1);
                        comments.set(gun.put(commentsJSON));
                    });

                    getComments(function (array) {
                        sendResponse({
                            array: array
                        });
                    });

                    function getComments(cb) {
                        var array = new Array();
                        comments.on().map(function (result) {
                            array.push(result);
                            console.log(array); //this works but the sendReponse callback doesn't
                            cb(array);
                        });
                    }
                }*/

        if (request.type == "userIsLoggedIn") {
            countSilverCredits(function (count) {
                $('.gmc-scr-value').html(count);
                // send to background script so that wallet.js can check the balance
                chrome.runtime.sendMessage({
                    type: 'balance',
                    balance: count
                });
            });
        }

        /* This isn't working. It should be coming from the background script */
        if (request.type == 'edit') {
            chrome.storage.local.get('user', function (data) {
                gun.get(data.user.usrPubKey).path('about').put(request.aboutText);
            });
        }

        if (request.type == "showSelfIcon") {
            $('.gmc-profile-self img').attr("src", request.profilePicURL);
            Toolbar.showSelfIcon();
        }
    });

    chrome.storage.local.get('user', function (result) {
        ud.on().map(function (data) {
            if (data.userID == result.user.usrPubKey) {
                $('.gmc-profile-self img').attr("src", data.profilePicURL);
                Toolbar.showSelfIcon();
            }
        });
    });

    //Toolbar.showSelfIcon(); // this needs to be triggered after registration

    $('.gmc-profile-self').on('click', function () {
        chrome.storage.local.get('user', function (result) {
            ud.on().map(function (data) {
                if (data.userID == result.user.usrPubKey) {
                    var date = new Date(data.regDate);
                    var day = date.getDate();
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    var newDate = day + "/" + month + "/" + year;
                    date = date.toString();
                    chrome.runtime.sendMessage({
                        type: 'showProfile',
                        name: data.name,
                        about: data.about,
                        regDate: newDate,
                        email: data.email,
                        profilePicURL: data.profilePicURL
                    });
                }
            });
        });
    });

    /* show authors profile in popup (background.js). To do: send account number to background.js and past it to profile.js so that correct profile record can be retrived. */

    $('.gmc-profile-author').on('click', function () {
        chrome.storage.local.get('user', function (result) {
            ud.on().map(function (data) {
                if (data.userID == Widget.getAddress()) {
                    chrome.runtime.sendMessage({
                        type: 'showProfile',
                        name: data.name,
                        about: data.about,
                        regDate: data.regDate,
                        email: data.email,
                        profilePicURL: data.profilePicURL
                    });
                }
            });
        });
    });

    /* TO DO: Before someone can receive Gold Credits, they must have a profile score of 3.5 or above. Also, they must have at least 3 comments on their profile, each commenter must also have profile scores of 3.5 or above. This is not done yet I can't read this data  without connecint to an endpoint  

    function checkProfileScore(userID) {
        var averageScore = 0;
        var totalComments = 0;
        var sumOfRatings = 0;

        comments.on().map(function (data) {
            if (data.recipientID == userID) {
                totalComments++;
                sumOfRatings += data.stars;
                averageScore = sumOfRatings / totalComments;
            }
            if (totalComments >= 3) {
                if (averageScore < 3.5) {
                    //user cannot recieve credits
                    jQuery('.gmc').off('click').css("opacity", "0.5").text("PROFILE INACTIVE");
                }
            } else {
                //user cannot recieve credits
                jQuery('.gmc').off('click').css("opacity", "0.5").text("PROFILE INACTIVE");
            }
        });
    }*/

});