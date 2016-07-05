$(document).ready(function () {
    var vanity = "";
    var isNewUser;
    $('button.register').on('click', function () {
        var name = $('#gmc-wallet input.name').val();
        var email = $('#gmc-wallet input.email').val();
        var profilePicURL = $('#gmc-wallet input.ppURL').val();
        var aboutText = "<p>Welcome " + name + "! Thanks for registering with GiveMeCredit. Please click on this text and write some information about yourself. You can earn Silver Credits right away by rating content using the toolbar below. If you want to earn Gold Credits, you will need at least three profile references, and each reference will need at least three profile stars.</p><p>NOTE: You don't necessarily need to know them. It's just to verify that you are not planning to throw a can of SPAM at us.</p>";
        vanity = getVanityKeys.getVanityAddr();
        $('#keyPair .newPubKey').html(vanity.pubkey + "/" + vanity.prvkey);
        $('#keyPair .gmcLink').html("http://gmc@" + vanity.pubkey + ".com");
        $('textarea.loginKeys').val((vanity.pubkey + "/" + vanity.prvkey));
        var data = tables.get_user_JSON();
        data.userID = vanity.pubkey;
        data.name = name;
        data.email = email;
        data.profilePicURL = profilePicURL;
        data.about = aboutText;
        data.regDate = new Date().getTime();
        data.userSig = keys.sign(vanity.prvkey, data);

        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "userData",
                data: data
            });
        });

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        $("li[data-tab='tab-2']").addClass('current');
        $("#tab-2").addClass('current');
        //isNewUser = true;
        $('#loginPage1').fadeIn('slow');

    });
});