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
            data.senderID = result.user.usrPubKey;
            //IMPORTANT : the transactionID is the signature
            data.transactionID = getVanityKeys.getVanitySig(data, result.user.usrPrvKey, 1);
            console.log("Vanity signature generated. Sending transaction for verification...");
            riu.set(gun.put(data).key(data.transactionID));
        });
    }
}