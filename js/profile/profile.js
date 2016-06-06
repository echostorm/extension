/* you can use https://openmerchantaccount.com/img2/WDF_1048452.jpg as a dummy profile image. It'stored with httpsimage.com 

NOTE: The save/cancel buttons including the code which updates the about text is in jquery.classyedit.js file. This shold be here but i couldn't get it work.
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

    $("#profileStars").rateYo({
        starWidth: "20px",
        readOnly: true,
        rating: 3.5
    });

    window.addEventListener('load', function (data) {
        chrome.tabs.getSelected(null, function (tab) {
            var id = getParameterByName('id', tab.url);
            db.getUserData(id);
            db.showComments(id, function (totalComments, sumOfRatings) {
                var averageScore = 0;
                if (totalComments != 0) {
                    averageScore = sumOfRatings / totalComments;
                    averageScore = averageScore.toFixed(1);
                    $("#profileStars").rateYo("option", "rating", averageScore);
                }
            });
            $('.submitComment').on('click', function () {
                cmt.submitComment(id);
            });

            db.countGoldCredits(id, function (count) {
                $('.creditsRecieved span').html(count);
            });

            $(document).on('click', '.commenter a', function (e) {
                e.preventDefault();
                var cmntrLnk = $(this).attr('href');
                chrome.runtime.sendMessage({
                    type: 'showProfile',
                    userID: cmntrLnk
                });

            })
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

    var $textarea = $("textarea.comment");
    $textarea.on('focus', function () {
        $textarea.val('');
    });
});