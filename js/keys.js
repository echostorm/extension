var keys = {
    // more info:- https://kjur.github.io/jsrsasign/sample-ecdsa.html
    // eliptic curve name
    curve: "secp256k1",
    // signature algorithm
    alg: "SHA256withECDSA",
    sigValueHex: "",

    init: function () {
        this.genKeyPair();
        this.sign(this.transaction);
        this.checkSig(this.transaction);
    },
    genKeyPair: function () {
        // generate key pair
        var ec = new KJUR.crypto.ECDSA({
            "curve": this.curve
        });
        var keypair = ec.generateKeyPairHex();

        var prvkey = keypair.ecprvhex;
        var pubkey = keypair.ecpubhex;

        var key_pair = {
            prvkey: prvkey,
            pubkey: pubkey
        }
        return key_pair;
    },
    createSigObject: function () {
        var sig = new KJUR.crypto.Signature({
            "alg": keys.alg,
            "prov": "cryptojs/jsrsa"
        });
        return sig;
    },
    sign: function (prvkey, data) {
        /* 
        This function takes your private key, and creates digital signature (in HEX format) and signs the json obj, which can be sent in transactions. When receiving transactions, the signature can be checked using the checkSig function. 
        */
        var sig = keys.createSigObject();
        // convert private key into signature
        sig.initSign({
            'ecprvhex': prvkey,
            'eccurvename': keys.curve
        });

        /* 'data' is the json object that you are signing for. */
        sig.updateString(data);

        keys.sigValueHex = sig.sign();
        return keys.sigValueHex;
        //console.log("Signature value (hex): " + sigValueHex);
    },
    checkSig: function (data, pubkey) {
        var sig = keys.createSigObject();
        sig.initVerifyByPublicKey({
            'ecpubhex': pubkey,
            'eccurvename': keys.curve
        });

        sig.updateString(data);

        var result = sig.verify(keys.sigValueHex);
        return result;
    }
}