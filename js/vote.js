/*
- change opacity of toolbar to indicate that user cannot vote on same article twice
- get current page url
- get JSON object frmo tables.js and set values
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
            data.senderID = result.user.usrPubKey;
            //IMPORTANT : the transactionID is the signature
            data.transactionID = getVanityKeys.getVanitySig(data, result.user.usrPrvKey, 1);
            console.log("Vanity signature generated. Sending transaction for verification...");
            //data.senderSig = keys.sign(result.user.usrPrvKey, data);
            riu.set(gun.put(data).key(data.transactionID));
        });


        //verify.verifyRiu();


        //then set() ??
        /*riu = gun.get('rated_item_unconfirmed');
        gun.set(riu);*/


        /*riu.set(data, function () {
            Percentage.getPagePercentage(function (percentage, countMatched) {
                var $itemScore = jQuery('.gmc-item-score span');
                if (countMatched != 0) {
                    $itemScore.html(percentage);
                    Percentage.checkItemPercentage(percentage);
                } else {
                    $itemScore.html("0");
                }
            });
        });*/

        var sc = jQuery('.gmc-scr-value').text();
        sc++;

        /*   var totalSilverCredits = {
            senderID: globalVars.senderID,
            silverCredits: sc
        }
        recTotScr.set(totalSilverCredits, function () {
            vote.displaySilverCredits(function (data) {
                jQuery('.gmc-scr-value').text(data);
            });
        });

    },
    countGoldCredits: function (cb) {
        var total = 0;
        recTotGcr.on().map(function (data) {
            total = total + parseInt(data.goldCredits);
            cb(total);
        });
    },
    displaySilverCredits: function (cb) {
        var sc;
        recTotScr.on().map(function (data) {
            sc = parseInt(data.silverCredits);
            cb(sc);
        });*/
    }
}