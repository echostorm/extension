/* This is used when giving credit to an author. It checks if sender has sufficient funds (Silver Credits) and updates the balance on the toolbar accordingly */

var Give = {
    giveCredit: function () {
        var amount = jQuery('.gmc-amount').text();

        if (Give.checkBalance(amount)) {
            var percentage = parseInt(jQuery('.gmc-item-score').text());
            var credits = (amount * percentage) / 100;

            var trans = {
                _id: new Date().toISOString(),
                url: window.location.href,
                credits: credits,
                recipientID: $('#gmc-widget').attr('data-key'),
                senderID: null,
                senderSig: null
            }

            chrome.storage.local.get('user', function (result) {
                trans.senderID = result.user.usrPubKey;
                trans.senderSig = keys.sign(result.user.usrPrvKey, trans);
                // write the transaction to the database (db.js)
                db.sendGoldCredits(trans);
                $('#gmc-widget .gmc').html("Whoohoo! Thanks!");
                vote.balance(false, amount);
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