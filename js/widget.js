/* This page is used to check for page links which contain "gmc@xyz123...". If such a link exists it extracts the account number (e.g. xyz123...) and converts the link into a widget. NOTE: This is a bit messy. It might be better to put checkLink, author and getAddress into one function. These functions are used in main.js and give.js */

var Widget = {
    checkLink: function () {
        this.$linkContainingKey = jQuery('a:contains("gmc@")');
    },

    author: function () {
        this.getUrlFromLink = jQuery('a:contains("gmc@")').text();
    },
    getAddress: function () {
        var address = this.getUrlFromLink.split('@')[1];
        return address;
    },
    createWidget: function () {
        var addr = this.getAddress();
        this.$linkContainingKey.removeAttr("href");
        this.$linkContainingKey.html("<div id=\"gmc-widget\" class=\"" + addr + "\"><span class=\"gmc\">GIVE ME CREDIT</span><span class=\"gmc-amount\">0</span><div class=\"gmc-arrows\"><span class=\"gmc-arrow-up\"></span><span class=\"gmc-arrow-down\" ></span></div><div class=\"gmc-message\"><textarea>Why does this deserve credit?</textarea></div></div>");
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