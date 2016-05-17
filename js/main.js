 $(document).ready(function () {
     //verify.verifyRiu();
     //verify.verifyUd();
     //verify.verifyCiu();
     /*
     - get current page score
     - display/initialize toolbar
     - check if link exists that matches criteria
     - count authors gold credits (to do)
     - grab the content authors details
     - if link matches criteria replace it with widget and show profile tab
     */

     Percentage.getProfilePercentage(function (totalComments, sumOfRatings) {
         var averageScore = 0;
         if (totalComments != 0) {
             averageScore = sumOfRatings / totalComments;
             averageScore = averageScore.toFixed(1);
             if (averageScore < 3.5) {
                 jQuery('.gmc').off('click').css("opacity", "0.5").text("PROFILE INACTIVE");
             }
         }
     });

     countSilverCredits(function (count) {
         $('.gmc-scr-value').html(count);
     });

     function countSilverCredits(cb) {
         var count = 0;
         chrome.storage.local.get('user', function (result) {
             var isEmpty = jQuery.isEmptyObject(result);
             if (!isEmpty) {
                 riu.on("child_added", function (snapshot) {
                     var item = snapshot.val();
                     if (item.senderID == result.user.usrPubKey) {
                         count++;
                         cb(count);
                     }
                 });
             } else {
                 console.log("You are not logged in");
             }
         });
     }

     Percentage.getPagePercentage(function (percentage, countMatched) {
         var $itemScore = jQuery('.gmc-item-score span');
         if (countMatched != 0) {
             $itemScore.html(percentage);
             Percentage.checkItemPercentage(percentage);
         } else {
             $itemScore.html("0");
         }
     });

     Toolbar.init();
     Widget.checkLink();

     if (Widget.$linkContainingKey.length) {
         Widget.author();
         Widget.createWidget();

         ud.on("child_added", function (snapshot) {
             var user = snapshot.val();
             if (user.userID == Widget.getAddress()) {
                 $('.gmc-profile-author img').attr("src", user.profilePicURL);
                 Toolbar.showAuthorIcon();
             }
         });

         chrome.runtime.sendMessage({
             type: 'recipient',
             recipientID: Widget.getAddress()
         });
     }

     $('.gmc-arrow-up').on('click', function () {
         Widget.onArrowUpClick();
     });

     $('.gmc-arrow-down').on('click', function () {
         Widget.onArrowDownClick();
     });

     $('.gmc').on('click', function () {
         Give.giveCredit();
     });

     $('.gmc-vote-up').click(function () {
         vote.vote(true);
     });

     $('.gmc-vote-down').click(function () {
         vote.vote(false);
     });


     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
         if (request.type == "showSelfIcon") {
             $('.gmc-profile-self img').attr("src", request.profilePicURL);
             Toolbar.showSelfIcon();
         }
     });

     chrome.storage.local.get('user', function (result) {
         var isEmpty = $.isEmptyObject(result);
         if (!isEmpty) {
             ud.on("child_added", function (snapshot) {
                 var user = snapshot.val();
                 if (result.user.usrPubKey == user.userID) {
                     $('.gmc-profile-self img').attr("src", user.profilePicURL);
                     Toolbar.showSelfIcon();
                 }
             });
         } else {
             console.log("you are not logged in");
         }
     });

     $('.gmc-profile-self').on('click', function () {
         chrome.storage.local.get('user', function (result) {
             var isEmpty = $.isEmptyObject(result);
             if (!isEmpty) {
                 chrome.runtime.sendMessage({
                     type: 'showProfile',
                     userID: result.user.usrPubKey
                 });
             } else {
                 console.log("you are not logged in");
             }

         });
     });

     /* show authors profile in popup (background.js). To do: send account number to background.js and past it to profile.js so that correct profile record can be retrived. */

     $('.gmc-profile-author').on('click', function () {
         chrome.runtime.sendMessage({
             type: 'showProfile',
             userID: Widget.getAddress()
         });
     });
 });

 /* TO DO: Before someone can receive Gold Credits, they must have a profile score of 3.5 or above. Also, they must have at least 3 comments on their profile, each commenter must also have profile scores of 3.5 or above. This is not done yet I can't read this data  without connecint to an endpoint  

 function checkProfileScore(userID) {
     var averageScore = 0;
     var totalComments = 0;
     var sumOfRatings = 0;

     comments.on().map(function (data) {
         if (data.recipientID == userID) {
             totalComments++;
             sumOfRatings += data.stars;
             averageScore = sumOfRatings / totalComments;
         }
         if (totalComments >= 3) {
             if (averageScore < 3.5) {
                 //user cannot recieve credits
                 jQuery('.gmc').off('click').css("opacity", "0.5").text("PROFILE INACTIVE");
             }
         } else {
             //user cannot recieve credits
             jQuery('.gmc').off('click').css("opacity", "0.5").text("PROFILE INACTIVE");
         }
     });
 }*/