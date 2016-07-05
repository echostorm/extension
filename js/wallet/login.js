   $(document).ready(function () {

       chrome.storage.local.get('user', function (result) {
           var isEmpty = jQuery.isEmptyObject(result);
           if (!isEmpty) {
               $('#loginPage3').fadeIn('slow');
           } else {
               $('#loginPage1').fadeIn('slow');
           }
       });

       /* login.checkDate(); 
       This will be used later. It is declared in js/wallet/login.js and is used to clear the login details after a specified period of time */

       $('button.logout').on('click', function () {
           chrome.storage.local.clear();
           $('#loginPage3').hide();
           $('#loginPage2').hide();
           $('#loginPage1').fadeIn('slow');
           Toolbar.hideSelfIcon(); //why doesn't this work? 
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

           $('#loginPage1').fadeOut('fast', function () {
               $('#loginPage2').fadeIn('slow');

               /*if (isNewUser) {
                   $('#loginPage2').fadeIn('slow');
               } else {
                   $('#loginPage3').fadeIn('slow');
               }*/

           });
           // on login, send a message to the content script. Perhaps this could be added to background.js??
           chrome.tabs.query({
               active: true,
               currentWindow: true
           }, function (tabs) {
               chrome.tabs.sendMessage(tabs[0].id, {
                   type: "showSelfIcon",
                   pubKey: pubKey
                       //profilePicURL: $('#gmc-wallet input.ppURL').val()
               });
           });
       });
   });