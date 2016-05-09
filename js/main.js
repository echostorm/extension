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

    $('.gmc-profile-self img').attr("src", "http://pic.1fotonin.com/data/wallpapers/59/WDF_1048495.jpg");

    countRecords.userSilver();

    scb.on().map(function (data) {
        // TO DO: check userID first
        $('.gmc-scr-value').html(data.balance);
        // send to background script so that wallet.js can check the balance
        chrome.runtime.sendMessage({
            type: 'balance',
            balance: data.balance
        });
    });

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
        $('.gmc-profile-author').animate({
            width: 'toggle'
        }, 350);

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

    $('.gmc-profile-self').on('click', function () {
        chrome.storage.local.get('user', function (result) {
            chrome.runtime.sendMessage({
                type: 'self',
                userID: result.user.usrPubKey
                    /* this userID is for testing. 
                    it needs to be changed in wallet.js also */
            });
        });

    });

    /* show authors profile in popup (background.js). To do: send account number to background.js and past it to profile.js so that correct profile record can be retrived. */

    $('.gmc-profile-author').on('click', function () {
        chrome.runtime.sendMessage({
            type: 'author',
            //userID: 'Bob Brown'
            userID: Widget.getAddress()
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