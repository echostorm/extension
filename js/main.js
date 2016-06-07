 $(document).ready(function () {
     /* initialize and display the toolbar */
     Toolbar.init();

     $('.gmc-vote-up').on('click', function () {
         vote.vote(true);
     });
     $('.gmc-vote-down').on('click', function () {
         vote.vote(false);
     });

     /* send a message to the background script to 
     open the logged in user's profile in a popup window */

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

     /* send a message to the background script to 
     open the authors profile in a popup window */

     $('.gmc-profile-author').on('click', function () {
         var key = $('#gmc-widget').attr('data-key');
         chrome.runtime.sendMessage({
             type: 'showProfile',
             userID: key
         });
     });

     /* check if link exists on current page that matches the criteria */
     var $authorsKey = $('a:contains("gmc@")');
     if ($authorsKey.length) {
         var addr = Widget.getAddress();
         Widget.createWidget($authorsKey);
         /* get the profile picture associated with content 
         author and display it on the toolbar */
         db.getProfilePicForUser(addr, function (profilePic) {
             images.setImage(profilePic, function (img) {
                 $('.gmc-profile-author img').attr("src", img);
                 Toolbar.showAuthorIcon();
             });
         });

         /* If a user logs in, display the users profile picture on the toolbar */
         chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
             if (request.type == "showSelfIcon") {
                 db.getProfilePicForUser(request.pubKey, function (profilePicURL) {
                     $('.gmc-profile-self img').attr("src", profilePicURL);
                     Toolbar.showSelfIcon();
                 })
             }
         });

         /* If the user is already logged in when the page is loaded, 
         display profile picture on toolbar */
         chrome.storage.local.get('user', function (result) {
             var isEmpty = $.isEmptyObject(result);
             if (!isEmpty) {
                 db.getProfilePicForUser(result.user.usrPubKey, function (profilePicURL) {
                     images.setImage(profilePicURL, function (img) {
                         $('.gmc-profile-self img').attr("src", img);
                         Toolbar.showSelfIcon();
                     });
                 });
             } else {
                 console.log("you are not logged in");
             }
         });

         /* get the total number silver credits earned by currently logged in user */
         var $scrBal = $('.gmc-scr-value');

         db.getScrBal(function (count) {
             $scrBal.html(count);
         });

         /* update the number silver credits if it changes */
         db.onBalChange(function (newBal) {
             $scrBal.html(newBal);
         });

         /* get the current page percentage and display it on the toolbar */
         db.getPagePercentage(function (percentage, numRecords) {
             var $itemScore = jQuery('.gmc-item-score span');
             if (numRecords != 0) {
                 $itemScore.html(percentage);
             }
         });

         /*
     Get the rating score for the author of the content (from the gmc address on the page). If the score is less than 3.5 then the author cannot lobby for credits. 
     */

         db.getProfilePercentage(function (totalComments, sumOfRatings) {
             var averageScore = 0;
             if (totalComments != 0) {
                 averageScore = sumOfRatings / totalComments;
                 averageScore = averageScore.toFixed(1);
                 if (averageScore < 3.5) {
                     jQuery('.gmc').off('click').css("opacity", "0.5").text("Profile Inactive");
                 }
             }
         });

         /* write the authors address to local storage. This will be used by the wallet to pre-populate the form with an address. It's onl really necessary for testing */

         chrome.runtime.sendMessage({
             type: 'recipient',
             recipientID: Widget.getAddress()
         });
     }

     /**** end if ****/

     /* Toolbar buttons */


     $('.gmc-arrow-up').on('click', function () {
         Widget.onArrowUpClick();
     });

     $('.gmc-arrow-down').on('click', function () {
         Widget.onArrowDownClick();
     });

     $('.gmc').on('click', function () {
         Give.giveCredit();
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