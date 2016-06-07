var Toolbar = {
    init: function () {
        $('body').append("<div id=\"gmc-toolbar\" class=\"gmc-down\">\
	        <div class=\"gmc-toolbar-label\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></div>\
	        <div id=\"gmc-toolbar-container\">\
	            <ul>\
	                <li class=\"gmc-profile-author\"><img/></li>\
	                <li class=\"gmc-profile-self\"><img/></li>\
	                <li class=\"gmc-scr-label\">Silver Credits</li>\
	                <li class=\"gmc-scr-value\">0</li>\
	                <li class=\"gmc-vote-down\"><i class=\"fa fa-thumbs-o-down\" aria-hidden=\"true\"></i></li>\
	                <li class=\"gmc-vote-up\"><i class=\"fa fa-thumbs-o-up\" aria-hidden=\"true\"></i></li>\
	                <li class=\"gmc-item-score\"><span>0</span>%</li>\
	            </ul>\
	            <div style=\"clear:both;\"></div>\
	        </div>\
	    </div>");

        Toolbar.toolbarSlider();
    },
    toolbarSlider: function () {
        jQuery(".gmc-toolbar-label").on('click', function () {
            if (jQuery("#gmc-toolbar").hasClass('gmc-down')) {
                Toolbar.toolbarSlideDown();
            } else {
                Toolbar.toolbarSlideUp();
            }
        });
    },
    toolbarSlideDown: function () {
        jQuery("#gmc-toolbar").animate({
            "bottom": "-=45px"
        }, "fast");
        jQuery("#gmc-toolbar").removeClass('gmc-down');
    },
    toolbarSlideUp: function () {
        jQuery("#gmc-toolbar").animate({
            "bottom": "+=45px"
        }, "fast");
        jQuery("#gmc-toolbar").addClass('gmc-down');
    },
    darken: function () {
        jQuery('#gmc-toolbar-container>ul>li').off('click').css("opacity", "0.5");
    },
    showSelfIcon: function () {
        $('.gmc-profile-self').show('slow');
    },
    showAuthorIcon: function () {
        $('.gmc-profile-author').show('slow');
    },
    hideSelfIcon: function () {
        $('.gmc-profile-self').hide('slow');
    }
}