var counter = {
    countGoldCredits: function (id, cb) {
        var count = 0;
        ciu.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if (item.recipientID == id) {
                    count += parseFloat(item.credits);
                }
            });
            cb(count);
        });
    }
}