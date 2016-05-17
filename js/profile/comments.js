var cmt = {
    showComments: function (currentUser, cb) {
        var totalComments = 0;
        var sumOfRatings = 0;
        var template = $('#commentTpl').html();
        comments.on("child_added", function (snapshot) {
            var comment = snapshot.val();
            if (comment.recipientID == currentUser) {
                //get comment.senderID from ud and find profile pic
                ud.on("child_added", function (data) {
                    var user = data.val();
                    if (user.userID == comment.senderID) {
                        var newComment = {
                            comment: comment.comment,
                            commenter: user.name,
                            commenterID: user.userID,
                            img: user.profilePicURL
                        };
                        var html = Mustache.to_html(template, newComment);
                        $('#profileComments').prepend(html);
                    }
                    $(".rating").rateYo({
                        starWidth: "20px",
                        readOnly: true,
                        rating: comment.stars
                    });
                    totalComments++;
                    sumOfRatings += comment.stars;
                    cb(totalComments, sumOfRatings);
                });
            }
        });
    },
    submitComment: function (id) {
        var newComment = $('textarea.comment').val();
        var stars = $("#rating").rateYo("option", "rating");
        var commentsJSON = tables.get_comments_JSON();
        commentsJSON.recipientID = id;
        commentsJSON.comment = newComment;
        commentsJSON.stars = stars;
        chrome.storage.local.get('user', function (data) {
            //check if empty
            commentsJSON.senderID = data.user.usrPubKey;
            commentsJSON.senderSig = getVanityKeys.getVanitySig(commentsJSON, data.user.usrPrvKey, 1);
            comments.push(commentsJSON);
        });
    }
}