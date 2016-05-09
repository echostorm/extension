var countRecords = {
    userSilver: function () {
        var count = 0;
        var balance = tables.get_scb_JSON();
        chrome.storage.local.get('user', function (result) {
            riu.on().map(function (data) {
                if (data.senderID == result.user.usrPubKey) {
                    count++;
                    //console.log("This user has " + count + " silver credits");
                    balance.userID = data.senderID;
                    balance.balance = count;
                    scb.set(gun.put(balance));
                }
            })
        });
    }
}