var animate = {
    contentFadeIn: function () {
        jQuery("#pages").addClass('animated fadeInLeft');
        jQuery("#pages").replaceWith(jQuery("#pages").clone(true));
    },
    rotateProfilePic: function () {
        jQuery("#profile-pic img").addClass('animated rotateIn');
        jQuery("#profile-pic img").replaceWith(jQuery("#profile-pic img").clone(true));
    },
    listSlideIn: function () {
        jQuery("#col-left ul li:odd").addClass('animated fadeInLeft');
        jQuery("#col-left ul li:even").addClass('animated fadeInRight');
        jQuery("#col-left ul").replaceWith(jQuery("#col-left ul").clone(true));
    }
}