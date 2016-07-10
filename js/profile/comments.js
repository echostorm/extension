var cmnts = {
    submitComment: function (data) {
        var comment = {
            recipientID: data.recipientID,
            comment: $('textarea.comment').val(),
            stars: $("#rating").rateYo("option", "rating"),
            senderName: data.senderName,
            senderPicURL: data.senderPicURL,
            senderID: data.senderPubKey,
            senderSig: null
        }
        comment.senderSig = keys.sign(data.senderPrvKey, comment);
        db.writeComment(comment, function (id) {
            cmnts.displayComments(id);
        });
    },
    displayComments: function (id) {
        db.getComments(id, function (comments) {
            var template = $('#commentTpl').html();
            var score = 0;
            var averageScore = 0;
            for (var i = 0; i < comments.length; i++) {
                var newComment = {
                    comment: comments[i].comment,
                    commenter: comments[i].senderName,
                    commenterID: comments[i].senderID,
                    img: comments[i].senderPicURL
                };
                var html = Mustache.to_html(template, newComment);
                $('#profileComments').prepend(html);

                $(".rating").rateYo({
                    starWidth: "20px",
                    readOnly: true,
                    rating: comments[i].stars
                });
                score += comments[i].stars;
                averageScore = score / comments.length;
                averageScore = averageScore.toFixed(1);
                $("#profileStars").rateYo("option", "rating", averageScore);
            }
        });
    }
}