/* This page is used to check for page links which contain "gmc@xyz123...". If such a link exists it extracts the account number (e.g. xyz123...) and converts the link into a widget. NOTE: This is a bit messy. It might be better to put checkLink, author and getAddress into one function. These functions are used in main.js and give.js */

var Widget = {
    getAddress: function () {
        var key = $('a:contains("gmc@")').text();
        var start_pos = key.indexOf('@') + 1;
        var end_pos = key.indexOf('.', start_pos);
        var address = key.substring(start_pos, end_pos);
        return address;
    },
    createWidget: function ($authorsKey) {
        $authorsKey.removeAttr("href");
        $authorsKey.html("<div id=\"gmc-widget\"><span class=\"gmc\">Give Me Credit</span><span class=\"gmc-amount\">0</span><div class=\"gmc-arrows\"><span class=\"gmc-arrow-up\"><i class=\"fa fa-angle-up\" aria-hidden=\"true\"></i></span><span class=\"gmc-arrow-down\" ><i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></span></div></div>");
    },
    onArrowUpClick: function () {
        var amount = parseInt($('.gmc-amount').text());
        amount = amount + 1;
        $('.gmc-amount').html(amount);
    },
    onArrowDownClick: function () {
        var amount = parseInt($('.gmc-amount').text());
        if (amount > 0) {
            amount = amount - 1;
        }
        $('.gmc-amount').html(amount);
    },
}