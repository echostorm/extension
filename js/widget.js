/* This page is used to check for page links which contain "gmc@xyz123...". If such a link exists it extracts the account number (e.g. xyz123...) and converts the link into a widget. NOTE: This is a bit messy. It might be better to put checkLink, author and getAddress into one function. These functions are used in main.js and give.js */

var Widget = {
    checkLink: function () {
        this.$linkContainingKey = jQuery('a:contains("gmc@")');
    },

    author: function () {
        this.getUrlFromLink = jQuery('a:contains("gmc@")').text();
    },
    getAddress: function () {
        var start_pos = this.getUrlFromLink.indexOf('@') + 1;
        var end_pos = this.getUrlFromLink.indexOf('.', start_pos);
        var address = this.getUrlFromLink.substring(start_pos, end_pos);
        return address;
    },
    createWidget: function () {
        this.$linkContainingKey.removeAttr("href");
        this.$linkContainingKey.html("<div id=\"gmc-widget\"><span class=\"gmc\">Give Me Credit</span><span class=\"gmc-amount\">0</span><div class=\"gmc-arrows\"><span class=\"gmc-arrow-up\"><i class=\"fa fa-angle-up\" aria-hidden=\"true\"></i></span><span class=\"gmc-arrow-down\" ><i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></span></div></div>");
    },
    onArrowUpClick: function () {
        var amount = parseInt(jQuery('.gmc-amount').text());
        amount = amount + 1;
        jQuery('.gmc-amount').html(amount);
    },
    onArrowDownClick: function () {
        var amount = parseInt(jQuery('.gmc-amount').text());
        if (amount > 0) {
            amount = amount - 1;
        }
        jQuery('.gmc-amount').html(amount);
    },
}