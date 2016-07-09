   $(document).ready(function () {

       function getUsersBalance(id) {
           chrome.tabs.query({
               active: true,
               currentWindow: true
           }, function (tabs) {
               chrome.tabs.sendMessage(tabs[0].id, {
                   type: "countGoldCredits",
                   id: id
               }, function (count) {
                   $('.gmc-wallet-balance span').html(count);
               });
           });
       }

       /* check if the user is logged in. If they are, show the logout button and hide the login form */
       chrome.storage.local.get('user', function (result) {
           var isEmpty = jQuery.isEmptyObject(result);
           if (!isEmpty) {
               $('#loginPage3').fadeIn('slow');
               getUsersBalance(result.user.usrPubKey);
           } else {
               $('#loginPage1').fadeIn('slow');
           }
       });

       $('button.logout').on('click', function () {
           chrome.storage.local.clear();
           $('#loginPage3').hide(); //hide logout form
           $('#loginPage2').hide(); //hide info about keys
           $('#loginPage1').fadeIn('slow'); //show login form
           chrome.tabs.query({
               active: true,
               currentWindow: true
           }, function (tabs) {
               chrome.tabs.sendMessage(tabs[0].id, {
                   type: "hideSelfIcon"
               });
           });
       });

       /* get login details and send to background.js where they will be entered into chrome localstorage */

       $('.submitLogin').on('click', function () {
           var loginKeys = $('textarea.loginKeys').val();
           var pubKey = loginKeys.split('/')[0];
           var prvKey = loginKeys.split('/')[1];
           var date = new Date().getTime();
           chrome.runtime.sendMessage({
               type: 'user',
               pubKey: pubKey,
               prvKey: prvKey,
               date: date
           });

           getUsersBalance(pubKey);

           /* after login, show the users newly created credentials. However, this is for users loggin in for the first time. You will need to check this and if they have logged in before, show them #loginpage3 instead (the logout form). */
           $('#loginPage1').fadeOut('fast', function () {
               $('#loginPage2').fadeIn('slow');
           });
           // on login, send a message to the content script. Perhaps this could be added to background.js??
           chrome.tabs.query({
               active: true,
               currentWindow: true
           }, function (tabs) {
               chrome.tabs.sendMessage(tabs[0].id, {
                   type: "showSelfIcon",
                   pubKey: pubKey
               });
           });
       });
   });