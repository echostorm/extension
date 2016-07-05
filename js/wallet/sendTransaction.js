$(document).ready(function () {
    $('.sendCredits').on('click', function () {
        // To do: check if senderID has enough funds to send
        //var vanity = getVanityKeys.getVanityAddr();
        var recipientID = $('input.recipientID').val();
        var amount = $('input.sendAmount').val();
        var balance = $('.gmc-wallet-balance span').html();
        var newBalance;

        if (amount > balance) {
            $('.sendError').show();
        } else {
            $('.sendError').html("Your transaction is being processed!");
            // newBalance will need to be sent back to background and update scb
            newBalance = (balance - amount);
            $('.gmc-wallet-balance span').html(newBalance);

            var trans = {
                senderID: null,
                senderSig: null,
                recipientID: recipientID,
                amount: amount
            }

            chrome.storage.local.get('user', function (result) {
                trans.senderID = result.user.usrPubKey;
                trans.senderSig = keys.sign(result.user.usrPrvKey, trans);
            });

            // send transaction
            $.when(db.sendTransaction(trans)).then(
                function () {
                    console.log("transaction has been sent");
                }
            );
        }
    });
});