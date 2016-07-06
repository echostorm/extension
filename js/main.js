 $(document).ready(function () {


     /* initialize and display the toolbar */
     Toolbar.init();

     goldCredits.load(function (err, tableStats, metaStats) {
         if (!err) {
             //console.log("Loading gold_credits was successful");
         }
     });

     ratedItems.load(function (err, tableStats, metaStats) {
         if (!err) {
             //console.log("Load was successful");
             /* get the current page percentage and display it on the toolbar */
             db.getPagePercentage(function (percentage, numRecords) {
                 var $itemScore = jQuery('.gmc-item-score span');
                 if (numRecords != 0) {
                     $itemScore.html(percentage.toFixed(0));
                 }
             });
             /* get the total number silver credits earned by currently logged in user */
             var $scrBal = $('.gmc-scr-value');
             chrome.storage.local.get('user', function (result) {
                 var isEmpty = $.isEmptyObject(result);
                 if (!isEmpty) {
                     db.getScrBal(result.user.usrPubKey, function (count) {
                         $scrBal.html(count);
                     });
                 } else {
                     console.log("you are not logged in");
                 }
             });
         }
     });

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
         Widget.createWidget($authorsKey);
         /* get the profile picture associated with content 
         author and display it on the toolbar */
         var key = $('#gmc-widget').attr('data-key');
         db.getProfilePicForUser(key, function (profilePic) {
             images.setImage(profilePic, function (img) {
                 $('.gmc-profile-author img').attr("src", img);
                 Toolbar.showAuthorIcon();
             });
         });


         chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
             if (request.type == "userData") {
                 db.writeUserData(request.data);
             }
         });

         chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
             if (request.type == "getUserData") {
                 db.getUserData(request.id, function (result) {
                     var data = {
                         name: result.name,
                         about: result.about,
                         newDate: result.newDate,
                         email: result.email,
                         profilePicURL: result.profilePicURL
                     }
                     sendResponse(data);
                 });
                 return true;
             }
         });

         chrome.runtime.onMessage.addListener(function (request) {
             if (request.type == "updateAboutText") {
                 db.updateAboutText(request.id, request.about);
             }
         });

         chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
             if (request.type == "countGoldCredits") {
                 db.countGoldCredits(request.id, function (count) {
                     sendResponse(count);
                 });
                 return true;
             }
         });

         /* If a user logs in, display the users profile picture on the toolbar */
         chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
             if (request.type == "showSelfIcon") {
                 db.getProfilePicForUser(request.pubKey, function (profilePicURL) {
                     images.setImage(profilePicURL, function (img) {
                         $('.gmc-profile-self img').attr("src", img);
                         Toolbar.showSelfIcon();
                     });
                 });
             }
         });

         /* If a user logs out, hide the users profile picture on the toolbar */
         chrome.runtime.onMessage.addListener(function (request) {
             if (request.type == "hideSelfIcon") {
                 Toolbar.hideSelfIcon();
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

         /* update the number silver credits if it changes */
         db.onBalChange(function (newBal) {
             $scrBal.html(newBal);
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
             recipientID: $('#gmc-widget').attr('data-key')
         });
     }

     /**** end if ****/

     /* Widget */

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