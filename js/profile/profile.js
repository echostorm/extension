/* you can use https://openmerchantaccount.com/img2/WDF_1048452.jpg as a dummy profile image. It'stored with httpsimage.com 

NOTE: The save/cancel buttons including the code which updates the about text is in jquery.classyedit.js file. This shold be here but i couldn't get it work.
*/

jQuery(document).ready(function ($) {

    nav.init();
    nav.mobile();
    //animate.rotateProfilePic();
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

    $(".classy-editor").ClassyEdit();

    window.addEventListener('load', function (data) {
        chrome.tabs.getSelected(null, function (tab) {
            var id = getParameterByName('id', tab.url);

            /* check if profile page belongs to the logged in user. 
             If it does, allow them to edit the content */

            chrome.storage.local.get('user', function (result) {
                if (result.user.usrPubKey == id) {
                    $('body').on('click', '.save', function () {
                        var aboutText = $('.editor').html();
                        chrome.tabs.query({
                            active: true,
                            currentWindow: false
                        }, function (tabs) {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                type: "updateAboutText",
                                id: id,
                                about: aboutText
                            });
                        });
                        $(".edit").remove();
                    });
                    $('body').on('click', '.cancel', function () {
                        $(".edit").remove();
                    });
                } else {
                    $('body').on('click', '.save', function () {
                        alert("Sorry, you can't edit this users profile");
                    });
                }
            });

            chrome.tabs.query({
                active: true,
                currentWindow: false
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "getUserData",
                    id: id
                }, function (result) {
                    $('#name h3').html(result.name);
                    $('.editor').html(result.about);
                    $('.regDate span').html(result.newDate);
                    $('#gmc-footer .email span').html(result.email);
                    images.setImage(result.profilePicURL, function (img) {
                        $('#profile-pic img').attr("src", img);
                    });
                });
            });

            chrome.tabs.query({
                active: true,
                currentWindow: false
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "countGoldCredits",
                    id: id
                }, function (count) {
                    $('.creditsRecieved span').html(count);
                });
            });

            function truncate(string) {
                if (string.length > 30)
                    return string.substring(0, 30) + '...';
                else
                    return string;
            };

            chrome.tabs.query({
                active: true,
                currentWindow: false
            }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "getCreditsRecieved",
                    id: id
                }, function (result) {
                    var creditsRecievedTpl = $('#creditsRecievedTpl').html();
                    for (var i = 0; i < result.length; i++) {
                        var recCredited = {
                            urlLink: result[i].url,
                            url: truncate(result[i].url),
                            credits: result[i].credits,
                            senderID: truncate(result[i].senderID)
                        };
                        console.log(recCredited);
                        var html = Mustache.to_html(creditsRecievedTpl, recCredited);
                        $('#tab-3 table#creditsRecieved tbody').prepend(html);
                    }
                    $('#creditsRecieved').DataTable();
                });
            });

            cmnts.displayComments(id);

            $('.submitComment').on('click', function () {
                getCommentersNameAndPic(function (result) {
                    console.log(result);
                    submitComment(result);
                });
            });

            function getCommentersNameAndPic(cb) {
                chrome.storage.local.get('user', function (data) {
                    chrome.tabs.query({
                        active: true,
                        currentWindow: false
                    }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: "getUserData",
                            id: data.user.usrPubKey
                        }, function (result) {
                            cb(result);
                        });
                    });
                });
            }

            function submitComment(result) {
                chrome.storage.local.get('user', function (data) {
                    var data = {
                        recipientID: id,
                        senderName: result.name,
                        senderPicURL: result.profilePicURL,
                        senderPubKey: data.user.usrPubKey,
                        senderPrvKey: data.user.usrPrvKey
                    }
                    cmnts.submitComment(data, function () {
                        cmnts.displayComments(id);
                    });
                });
            }


            $(document).on('click', '.commenter a', function (e) {
                e.preventDefault();
                var cmntrLnk = $(this).attr('href');
                chrome.runtime.sendMessage({
                    type: 'showProfile',
                    userID: cmntrLnk
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

    var $textarea = $("textarea.comment");
    $textarea.on('focus', function () {
        $textarea.val('');
    });
});