/* This page sets up the profile, which includes :-
- setting the profile image (it's hard coded at the moment but will be to be dynamic)
- setting the about page text. Both the profile image and about text is specified in the registration process. It is then written to the 'user_date' gun db instance. 
- Its also sets up the url routing 

- NOTE: I have used these dummy profile pictures during the registration process :-
http://pic.1fotonin.com/data/wallpapers/59/WDF_1048495.jpg
http://pic.1fotonin.com/data/wallpapers/59/WDF_1048452.jpg
*/

jQuery(document).ready(function ($) {
    $(".classy-editor").ClassyEdit();
    window.addEventListener('load', function (evt) {
        chrome.runtime.getBackgroundPage(function (eventPage) {
            ud.on().map(function (data) {
                var date = new Date(data.regDate);
                var date = date.toString();
                if (data.userID == eventPage.profileKey) {
                    $('#name h3').html(data.name);
                    $('.aboutText').html(data.about);
                    $('.regDate span').html(date);
                    $('#gmc-footer .email span').html(data.email);
                    setImage(data.profilePicURL);
                }
            });
        });
    });

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

    ud.on().map(function (data) {
        console.log(data);
    });

    animate.rotateProfilePic();
    animate.listSlideIn();
    animate.contentFadeIn();

    $("#rating").rateYo({
        starWidth: "20px",
        rating: 1.6
    });

    var $textarea = $("textarea.comment");
    $textarea.on('focus', function () {
        $textarea.val('');
    });

    showComments(function (totalComments, sumOfRatings) {
        var averageScore = 0;
        if (totalComments != 0) {
            averageScore = sumOfRatings / totalComments;
        }
        $("#profileStars").rateYo({
            starWidth: "20px",
            readOnly: true,
            rating: averageScore
        });
    });

    function showComments(cb) {
        var totalComments = 0;
        var sumOfRatings = 0;

        comments.on().map(function (data) {
            totalComments++;
            sumOfRatings += data.stars;
            var showComment = '<div class="newComment"><div class="rating"></div><p>' + data.comment + '</p><p class="commentID" >Submitted by : ' + data.senderID + '</p></div>';
            $('#profileComments').prepend(showComment);
            $("#profileComments .rating").rateYo({
                starWidth: "20px",
                readOnly: true,
                rating: data.stars
            });
            cb(totalComments, sumOfRatings);
        });
    }

    $('.submitComment').on('click', function () {
        var newComment = $('textarea.comment').val();
        var stars = $("#rating").rateYo("option", "rating");
        var commentsJSON = tables.get_comments_JSON();
        commentsJSON.recipientID = '123xyz';
        commentsJSON.comment = newComment;
        commentsJSON.stars = stars;
        chrome.storage.local.get('user', function (data) {
            commentsJSON.senderID = data.user.usrPubKey;
            commentsJSON.senderSig = getVanityKeys.getVanitySig(commentsJSON, data.user.usrPrvKey, 1);
            comments.set(gun.put(commentsJSON));
        });
    });

    // page routing

    $('#col-left ul.tabs li').on('click', function () {
        var tab_id = $(this).attr('data-tab');
        $('#col-left ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        $(this).addClass('current');
        if (tab_id == 'tab-1') {
            animate.rotateProfilePic();
        }
        $("#" + tab_id).addClass('current animated fadeInLeft');
    });
});