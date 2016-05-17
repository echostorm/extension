var counter = {
    countGoldCredits: function (id, cb) {
        var count = 0;
        ciu.on("child_added", function (snapshot) {
            var item = snapshot.val();
            if (item.recipientID == id) {
                count += parseInt(item.credits);
                cb(count);
            }
        });
    }
}