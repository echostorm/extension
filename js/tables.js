/* db schema. NOTE: Perhaps i'll remove this page and create the objects inline, as and when. For now they help to keep track of which tables are being used. Any greyed out tables below are currently not in use but will be used later. */

var tables = {
    // used in the registration process
    get_user_JSON: function () {
        var user_data = {
            userID: null,
            name: null,
            email: null,
            profilePicURL: null,
            about: null,
            regDate: null,
            userSig: null
        }
        return user_data;
    },

    // used for profile comments
    get_comments_JSON: function () {
        var comments = {
            senderID: null,
            recipientID: null,
            comment: null,
            stars: null,
            senderSig: null
        }
        return comments;
    },

    /* riu stands for 'rated item unconfirmed'. It is unconfirmed as it needs to be checked and signed by other peers on the network. It is used in vote.js */
    get_riu_JSON: function () {
        var rated_item_unconfirmed = {
            senderID: null,
            url: null,
            isUpVote: null,
            transactionID: null //this is the senders signature
        }
        return rated_item_unconfirmed;
    },
    /* ric - rated item confirmed */
    get_ric_JSON: function () {
        var rated_item_confirmed = {
            senderID: null,
            transactionID: null,
            isUpVote: null,
            checkerID: null,
            checkerSig: null
        }
        return rated_item_confirmed;
    },
    // vri - valid rated item
    get_vri_JSON: function () {
        var valid_rated_item = {
            transactionID: null,
            isValid: false
        }
        return valid_rated_item;
    },

    /* scb stands for 'silver credits balance'. It is used to quickly retrieve the total number of silver credits associated with a specific userID. It is used first in main.js where it gets the total number of silver credits (earned by rating content) and displays that value on the extension toolbar. */
    get_scb_JSON: function () {
        var silver_credits_balance = {
            userID: null,
            balance: null
        }
        return silver_credits_balance;
    },
    /* ciu stands for 'credited item unconfirmed', and is sent when you first give someone credit. It is used in give.js */
    get_ciu_JSON: function () {
        var credited_item_unconfirmed = {
            url: null,
            credits: null,
            recipientID: null,
            senderID: null,
            transactionID: null
        }
        return credited_item_unconfirmed;
    },
    get_cic_JSON: function () {
        var credited_item_confirmed = {
            url: null,
            credits: null,
            recipientID: null,
            senderID: null,
            checkerID: null,
            checkerSig: null
        }
        return credited_item_confirmed;
    },
    get_vci_JSON: function () {
        var valid_credited_item = {
            transactionID: null,
            isValid: false
        }
        return valid_credited_item;
    },

    /* tu stands for 'transaction unconfirmed'. This is used in wallet.js for sending transactions (Gold Credits) */
    get_tu_JSON: function () {
        var transaction_unconfirmed = {
            transactionID: null,
            senderID: null,
            recipientID: null,
            amount: null,
            senderSig: null
        }
        return transaction_unconfirmed;
    },
    get_tc_JSON: function () {
        var transaction_confirmed = {
            transactionID: null,
            senderID: null,
            recipientID: null,
            amount: null,
            checkerID: null,
            checkerSig: null
        }
        return transaction_confirmed;
    },
    get_vt_JSON: function () {
        var valid_transaction = {
            transactionID: null,
            isValid: false
        }
        return valid_transaction;
    },
    get_gcr_JSON: function () {
        var gold_credits_balance = {
            userID: null,
            balance: null
        }
        return gold_credits_balance;
    }
}