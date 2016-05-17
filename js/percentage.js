/* This object will calculate the percentage score for both the current page and the user who is lobbying for credit (if any). It will get the total number of records associated with a url or user, count the number of up votes, divide the number of up votes by the total records, and times by 100 */

var Percentage = {
    checkItemPercentage: function (percentage) {
        if (percentage <= 50) {
            jQuery('.gmc').off('click').css("opacity", "0.5").text("ITEM INACTIVE");
        }
    },
    getPagePercentage: function (cb) {
        var percentage = 0;
        var countMatched = 0;
        var countUpVote = 0;
        riu.on("child_added", function (snapshot) {
            var item = snapshot.val();
            if (item.url == window.location.href) {
                countMatched++;
                if (item.isUpVote) {
                    countUpVote++;
                }
            }
            percentage = (countUpVote / countMatched) * 100;
            percentage = Math.round(percentage);
            cb(percentage, countMatched);
        });
    },
    getProfilePercentage: function (cb) {
        var totalComments = 0;
        var sumOfRatings = 0;
        comments.once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                if (item.recipientID == Widget.getAddress()) {
                    totalComments++;
                    sumOfRatings += item.stars;
                }
            });
            cb(totalComments, sumOfRatings);
        });
    }
}