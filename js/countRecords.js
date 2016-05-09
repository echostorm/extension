var countRecords = {
    userSilver: function () {
        var count = 0;
        var balance = tables.get_scb_JSON();
        chrome.storage.local.get('user', function (result) {
            riu.on().map(function (data) {
                if (data.senderID == result.user.usrPubKey) {
                    count++;
                    balance.userID = data.senderID;
                    balance.balance = count;
                    scb.set(gun.put(balance));
                }
            })
        });
    }
}