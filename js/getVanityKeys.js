var getVanityKeys = {
    getVanityAddr: function () {
        var obj = '';
        var str1 = "";
        var str2 = "";
        var substr1 = "";
        var substr2 = "";
        var i = 0;
        str1 = keys.genKeyPair();
        var pubkey1 = str1.pubkey;
        substr1 = pubkey1.substring(0, 1);

        while (substr2 != substr1) {
            str2 = keys.genKeyPair();
            var prvkey = str2.prvkey;
            var pubkey2 = str2.pubkey;
            var len = pubkey2.length;
            substr2 = pubkey2.substring(len - 1, len);
            if (substr2 == substr1) {
                var newKeyPair = {
                    pubkey: pubkey2,
                    prvkey: prvkey
                }

                return newKeyPair;
            }
        }
    },
    getVanitySig: function (transaction, prvkey, numChars) {
        console.log("Generating vanity signature. Please wait...");
        var substr1 = "";
        var substr2 = "";
        var str1 = keys.sign(prvkey, transaction) + '';
        var substr1 = str1.substring(0, numChars);
        while (substr2 != substr1) {
            var str2 = keys.sign(prvkey, transaction) + '';
            var len = str2.length;
            substr2 = str2.substring(len - numChars, len);
            if (substr2 == substr1) {
                return str2;
            }
        }
    }
}