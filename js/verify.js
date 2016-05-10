/* This is for the transaction verification process and is yet to be completed.

Once a peer has received, verified and signed a transaction. It will write this transaction to a confirmed table (e.g rated_item_confirmed). Another peer will then check the checkerID of the verified transaction, if it is valid, it will write to a valid table (e.g valid_rated_item), and set 'isValid' to true (if it already exists). 

NOTE: These functions are initialized in main.js

*/

var verify = {
    init: function () {
        this.verifyRiu()
    },
    // verify rated item unconfirmed
    verifyRiu: function () {
        riu.on().map(function (data) {
            var riu = {
                url: data.url,
                isUpVote: data.isUpVote,
                senderID: data.senderID,
                transactionID: data.transactionID //this is the senders signature
                    //senderSig: data.senderSig
            }
            var isValid = keys.checkSig(riu, data.senderID);

            if (isValid) {
                var confirmed = tables.get_ric_JSON();
                confirmed.senderID = data.senderID;
                confirmed.transactionID = data.transactionID;
                confirmed.isUpVote = data.isUpVote;
                chrome.storage.local.get('user', function (result) {
                    confirmed.checkerID = result.user.usrPubKey;
                    /*if (confirmed.checkerID == data.senderID) {
                        alert("no! no! no! you can't verify your own transactions!");
                    }*/

                    /* this generates a vanity address for the signature. It is better for the user to sign transactions this way instead of burdoning the checker. Also, getVanitySig should include a third parameter which includes a char length number 
                    confirmed.checkerSig = getVanityKeys.getVanitySig(ric, result.user.usrPrvKey);*/
                    confirmed.checkerSig = keys.sign(result.user.usrPrvKey, confirmed);
                    ric.set(gun.put(confirmed));
                });
            }
        });

        ric.on().map(function (data) {
            var ric = {
                url: data.url,
                isUpVote: data.isUpVote,
                senderID: data.senderID,
                transactionID: data.transactionID,
                checkerID: data.checkerID
            }

            var isValid = keys.checkSig(ric, data.checkerID);

            if (isValid) {
                var valid = tables.get_vri_JSON();
                valid.transactionID = data.transactionID;
                valid.isValid = true;
                vri.set(gun.put(valid));
                //console.log(data);
                //console.log("This transaction has a valid signature.");
                //console.log("It has been checked by " + data.checkerID);
                //console.log("...and has been written to the 'rated_item_confirmed' table");
            }
        });

        /*vri.on().map(function (data) {
            console.log(data);
        });*/
    },

    /* Verify credited items */
    verifyCiu: function () {
        ciu.on().map(function (data) {

            var ciu = {
                url: data.url,
                credits: data.credits,
                recipientID: data.recipientID,
                senderID: data.senderID,
                transactionID: data.transactionID
            }

            var isValid = keys.checkSig(ciu, data.senderID);
            if (isValid) {
                /* if valid write to confirmed table including the checkerSig */
                var confirmed = tables.get_cic_JSON();
                confirmed.url = data.url;
                confirmed.credits = data.credits;
                confirmed.recipientID = data.recipientID;
                confirmed.senderID = data.senderID;
                confirmed.transactionID = data.transactionID;

                chrome.storage.local.get('user', function (result) {
                    confirmed.checkerID = result.user.usrPubKey;
                    confirmed.checkerSig = keys.sign(result.user.usrPrvKey, confirmed);
                    cic.set(gun.put(confirmed));
                });
            }
        });

        cic.on().map(function (data) {

            var cic = {
                url: data.url,
                credits: data.credits,
                recipientID: data.recipientID,
                senderID: data.senderID,
                transactionID: data.transactionID,
                checkerID: data.checkerID
            }

            var isValid = keys.checkSig(cic, data.checkerID);
            if (isValid) {
                var valid = tables.get_vci_JSON();
                valid.transactionID = data.transactionID;
                valid.isValid = true;
                vci.set(gun.put(valid));
                console.log(data);
                console.log("This transaction has a valid signature.");
                console.log("It has been checked by " + data.checkerID);
                console.log("...and has been written to the 'valid_credited_item' table");

            }
        });

        /*vci.on().map(function (data) {
            console.log(data);
        })*/
    },

    // verify user data
    verifyUd: function () {
        /*ud.on(function (data) {
            console.log(data);
        });*/
    },
    // verify transaction unconfirmed
    verifyTu: function () {
        //tu.on(function (data) {
        //console.log(data);
        //});
    }
}