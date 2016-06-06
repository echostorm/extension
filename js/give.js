/* This is used when giving credit to an author. It checks if sender has sufficient funds (Silver Credits) and updates the balance on the toolbar accordingly */

var Give = {
    giveCredit: function () {
        var accountNum = Widget.getAddress();
        var pageURL = window.location.href;
        var amount = jQuery('.gmc-amount').text();

        if (Give.checkBalance(amount)) {
            $('#gmc-widget .gmc').html("Verifying...");
            var percentage = parseInt(jQuery('.gmc-item-score').text());
            var credits = (amount * percentage) / 100;
            var trans = tables.get_ciu_JSON();
            trans.url = pageURL;
            trans.credits = credits;
            trans.recipientID = accountNum;
            chrome.storage.local.get('user', function (result) {
                trans.senderID = result.user.usrPubKey;
                trans.transactionID = getVanityKeys.getVanitySig(trans, result.user.usrPrvKey, 1);
                // write the transaction to the database (db.js)
                $.when(db.sendGoldCredits(trans)).then(
                    function () {
                        $('#gmc-widget .gmc').html("Whoohoo! Thanks!");
                        vote.balance(false, amount);
                    }
                );
            });
        }
    },
    checkBalance: function (amount) {
        var balance = jQuery('.gmc-scr-value').text();
        var newBalance;
        if (amount > balance) {
            alert("Sorry. You don't have enough credits to give. If you want give someone credit you must first earn Silver Credits by rating items on the web");
        } else if (amount === 0) {
            alert("Please select an amount to give");
        } else if (amount > 10) {
            alert("Sorry, you cannot give more 10 ten credits at once");
        } else {
            newBalance = (balance - amount);
            jQuery('.gmc-scr-value').text(newBalance);
            jQuery('.gmc-amount').text("0");
            return true;
        }
    }
}