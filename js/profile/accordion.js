/* This page isn't currently being used. Maybe delete it */

(function ($) {
    jQuery('#accordion > li > a').on("click", function () {
        if (jQuery(this).attr('class') != 'active') {
            jQuery('#accordion div').slideUp();
            jQuery(this).next().slideToggle();
            jQuery('#accordion li a').removeClass('active');
            jQuery(this).addClass('active');
        } else {
            jQuery('#accordion div').slideUp();
            jQuery('#accordion li a').removeClass('active');
        }
    });
})(jQuery);