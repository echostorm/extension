$(document).ready(function () {


    $('button.logout').on('click', function () {
        chrome.storage.local.clear();
        $('#loginPage3').fadeOut('slow');
        $('#loginPage1').fadeIn('slow');
    });

    var vanity = "";
    var isNewUser;
    $('button.register').on('click', function () {
        var name = $('#gmc-wallet input.name').val();
        var email = $('#gmc-wallet input.email').val();
        var profilePicURL = $('#gmc-wallet input.ppURL').val();
        var aboutText = "<p>Welcome " + name + "! Thanks for registering with GiveMeCredit. Please click on this text and write some information about yourself. You can earn Silver Credits right away by rating content using the toolbar below. If you want to earn Gold Credits, you will need at least three profile references, and each reference will need at least three profile stars.</p><p>NOTE: You don't necessarily need to know them. It's just to verify that you are not planning to throw a can of SPAM at us.</p>";
        vanity = getVanityKeys.getVanityAddr();
        $('#keyPair .newPubKey').html(vanity.pubkey);
        $('#keyPair .newPrvKey').html(vanity.prvkey);
        $('#keyPair .gmcLink').html("http://gmc@" + vanity.pubkey);
        $('#tab-2 input.pubKey').val(vanity.pubkey);
        $('#tab-2 input.prvKey').val(vanity.prvkey);
        var data = tables.get_user_JSON();
        data.userID = vanity.pubkey;
        data.name = name;
        data.email = email;
        data.profilePicURL = profilePicURL;
        data.about = aboutText;
        data.regDate = new Date().getTime();
        data.userSig = getVanityKeys.getVanitySig(data, vanity.prvkey, 1);
        ud.push(data);
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        $("li[data-tab='tab-2']").addClass('current');
        $("#tab-2").addClass('current');
        isNewUser = true;
    });

    chrome.storage.local.get('user', function (result) {
        var isEmpty = jQuery.isEmptyObject(result);
        if (!isEmpty) {
            $('#loginPage3').fadeIn('slow');
        } else {
            $('#loginPage1').fadeIn('slow');
        }
    });

    /* get login details and send to background.js where they will be entered into chrome localstorage */

    $('.submitLogin').on('click', function () {
        var pubKey = $('input.pubKey').val();
        var prvKey = $('input.prvKey').val();
        var date = new Date().getTime();
        chrome.runtime.sendMessage({
            type: 'user',
            pubKey: pubKey,
            prvKey: prvKey,
            date: date
        });

        $('#loginPage1').fadeOut('fast', function () {
            if (isNewUser) {
                $('#loginPage2').fadeIn('slow');
            } else {
                $('#loginPage3').fadeIn('slow');
            }

        });

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "showSelfIcon",
                profilePicURL: $('#gmc-wallet input.ppURL').val()
            });
        });
    });

    // This is for the wallet page tabs

    $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    /* login.checkDate(); 
    This will be used later. It is declared in js/wallet/login.js and is used to clear the login details after a specified period of time */

    /* get the account number associated with the user who is lobbying for credit (if any) from local storage. NOTE: i used local storage as i was unable pass the account number from background.js for some reason?? The account number is used to populate the input field on the wallet. 
     */
    chrome.storage.local.get('recipientID', function (data) {
        var isEmpty = jQuery.isEmptyObject(data);
        if (!isEmpty) {
            $('input.recipientID').val(data.recipientID.recipientID);
        } else {
            console.log("There is no recipientID??? This should be taken from the widget. ");
        }
    });


    countGoldCredits(function (count) {
        $('.gmc-wallet-balance span').html(count);
    });

    function countGoldCredits(cb) {
        var count = 0;
        chrome.storage.local.get('user', function (result) {
            var isEmpty = jQuery.isEmptyObject(result);
            if (!isEmpty) {
                ciu.on("child_added", function (snapshot) {
                    var item = snapshot.val();
                    //if (item.senderID == result.user.usrPubKey) {
                    getUserName(item.senderID, function (from) {
                        var from = from;
                        getUserName(item.recipientID, function (to) {
                            var to = to;
                            $('.transList').append("<li><span>" + from + "</span><span>" + to + "</span><span>" + item.credits + "</span></li>");
                        });
                    })

                    count += item.credits;
                    cb(count);
                    //}
                });
            } else {
                console.log("You are not logged in");
            }
        });
    }

    function getUserName(id, cb) {
        ud.on("child_added", function (snapshot) {
            var item = snapshot.val();
            if (item.userID == id) {
                cb(item.name);
            }
        });
    }

    $('.sendCredits').on('click', function () {
        // To do: check if senderID has enough funds to send
        var vanity = getVanityKeys.getVanityAddr();
        var recipientID = $('input.recipientID').val();
        var amount = $('input.sendAmount').val();
        var balance = $('.gmc-wallet-balance span').html();
        var newBalance;
        if (amount > balance) {
            $('.sendError').show();
        } else {
            $('.sendError').html("Your transaction is being processed!");
            // newBalance will need to be sent back to background and update scb
            newBalance = (balance - amount);
            $('.gmc-wallet-balance span').html(newBalance);
            var trans = tables.get_tu_JSON();
            trans.transactionID = "XYZ1234"; //can i get this from the soul?
            trans.recipientID = recipientID;
            trans.amount = amount;
            trans.senderID = vanity.pubkey;
            trans.senderSig = getVanityKeys.getVanitySig(trans, vanity.prvkey, 1);
            tu.put(trans).key(trans.transactionID);
            verify.verifyTu();
        }
    });



});