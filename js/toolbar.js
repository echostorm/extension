var Toolbar = {
    init: function () {
        jQuery(".gmc-toolbar-label").click(function () {
            if (jQuery("#gmc-toolbar").hasClass('gmc-down')) {
                Toolbar.toolbarSlideDown();
            } else {
                Toolbar.toolbarSlideUp();
            }
        });
    },
    toolbarSlideDown: function () {
        jQuery("#gmc-toolbar").animate({
            "bottom": "-=55px"
        }, "fast");
        jQuery("#gmc-toolbar").removeClass('gmc-down');
    },
    toolbarSlideUp: function () {
        jQuery("#gmc-toolbar").animate({
            "bottom": "+=55px"
        }, "fast");
        jQuery("#gmc-toolbar").addClass('gmc-down');
    },
    darken: function () {
        jQuery('#gmc-toolbar-container>ul>li').off('click').css("opacity", "0.5");
    },
    showSelfIcon: function () {
        $('.gmc-profile-self').animate({
            width: 'toggle'
        }, 350);
    },
    showAuthorIcon: function () {
        $('.gmc-profile-author').animate({
            width: 'toggle'
        }, 350);
    }
}