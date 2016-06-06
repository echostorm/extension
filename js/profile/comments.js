var cmt = {
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
            db.writeComment(commentsJSON);
        });
    }
}