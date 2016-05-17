/* This page sets up the profile, which includes :-
- setting the profile image
- setting the about page text. Both the profile image and about text is specified in the registration process. It is then written to the 'user_data' object. 
- Its also sets up the url routing 

- NOTE: I have used these dummy profile pictures during the registration process :-
http://pic.1fotonin.com/data/wallpapers/59/WDF_1048495.jpg
http://pic.1fotonin.com/data/wallpapers/59/WDF_1048452.jpg
*/

jQuery(document).ready(function ($) {
    $(".classy-editor").ClassyEdit();
    nav.init();
    nav.mobile();
    animate.rotateProfilePic();
    animate.listSlideIn();
    animate.contentFadeIn();
    $("#rating").rateYo({
        starWidth: "20px",
        rating: 1.6
    });

    window.addEventListener('load', function (data) {
        chrome.tabs.getSelected(null, function (tab) {
            var id = getParameterByName('id', tab.url);
            ud.on("child_added", function (snapshot) {
                var user = snapshot.val();
                if (user.userID == id) {
                    var date = new Date(user.regDate);
                    var day = date.getDate();
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    var newDate = day + "/" + month + "/" + year;
                    $('#name h3').html(user.name);
                    $('.editor').html(user.about);
                    $('.regDate span').html(newDate);
                    $('#gmc-footer .email span').html(user.email);
                    setImage(user.profilePicURL);
                }
            });
            showComments(id, function (totalComments, sumOfRatings) {
                var averageScore = 0;
                if (totalComments != 0) {
                    averageScore = sumOfRatings / totalComments;
                    averageScore = averageScore.toFixed(1);
                    $("#profileStars").rateYo("option", "rating", averageScore);
                }
            });
            $('.submitComment').on('click', function () {
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
            });
        });
    });

    function getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function setImage(imgURL) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imgURL, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            var img = document.createElement('img');
            img.src = window.URL.createObjectURL(this.response);
            $('#profile-pic img').attr("src", img.src);
        };
        xhr.send();
    }

    var $textarea = $("textarea.comment");
    $textarea.on('focus', function () {
        $textarea.val('');
    });

    $("#profileStars").rateYo({
        starWidth: "20px",
        readOnly: true,
        rating: 3.5
    });

    function showComments(currentUser, cb) {
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
    }
});