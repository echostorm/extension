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
    window.addEventListener('load', function (data) {
        chrome.tabs.getSelected(null, function (tab) {
            var name = getParameterByName('name', tab.url);
            var about = getParameterByName('about', tab.url);
            var regDate = getParameterByName('regDate', tab.url);
            var email = getParameterByName('email', tab.url);
            var profilePicURL = getParameterByName('profilePicURL', tab.url);
            $('#name h3').html(name);
            $('.editor').html(about);
            $('.regDate span').html(regDate);
            $('#gmc-footer .email span').html(email);
            setImage(profilePicURL);
        });
    });

    /*chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.type == 'showComments') {
            console.log("testing");
            console.log(request.comment);
        }
    });*/

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

    // why doesn't this work on page load????
    /*  showComments(function (totalComments, sumOfRatings) {
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

            chrome.tabs.query({
                active: true,
                currentWindow: false
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "getProfilePicURL",
                    senderID: data.senderID
                }, function (result) {
                    console.log(result);
                    var showComment = '<div class="newComment">\
    <div class="rating"></div><ul><li class="commentText">' + data.comment + "<br />Sender: " + data.senderID + '</li>\
    <li class="commentImg"><img src="' + result.profilePicURL + '" /></li><ul>';
                    $('#profileComments').prepend(showComment);
                });
                $("#profileComments .rating").rateYo({
                    starWidth: "20px",
                    readOnly: true,
                    rating: data.stars
                });
                cb(totalComments, sumOfRatings);
            });
        });
    }
*/
    $('.submitComment').on('click', function () {
        var newComment = $('textarea.comment').val();
        var stars = $("#rating").rateYo("option", "rating");
        /*   
        I tried sending the query to main.js in order to keep gun call in one place but it was too impractical 
        chrome.tabs.query({
            active: true,
            currentWindow: false
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "addComment",
                newComment: newComment,
                stars: stars
            }, function (array) {
                console.log(array);
                $('#profileComments').prepend(array[0].comment);
            });
        }); */
        var commentsJSON = tables.get_comments_JSON();
        commentsJSON.recipientID = '123xyz';
        commentsJSON.comment = newComment;
        commentsJSON.stars = stars;
        chrome.storage.local.get('user', function (data) {
            commentsJSON.senderID = data.user.usrPubKey;
            commentsJSON.senderSig = getVanityKeys.getVanitySig(commentsJSON, data.user.usrPrvKey, 1);
            //comments.set(gun.put(commentsJSON));
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