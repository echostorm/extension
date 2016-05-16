/* This seems like the best place to clear localstorage as its used by all scripts. However, it doesn't work. When i set the end point to localhost, old data returns from somewhere??? */

localStorage.clear();
//chrome.storage.local.clear();
//chrome://settings/cookies#cont 
/* the above will also clear all localstorage. Yet the data always comes back!!!???*/
var count = 1;

var gun = new Gun( /*'http://192.168.1.191:1337'*/ );
var riu = gun.get('rated_item_unconfirmed_' + count);
var ric = gun.get('rated_item_confirmed_' + count);
var vri = gun.get('valid_rated_item_' + count);
var ud = gun.get('user_data_' + count);
var pd = gun.get('profile_data_' + count);
var scb = gun.get('silver_credits_balance_' + count);
var ciu = gun.get('credited_item_unconfirmed_' + count);
var cic = gun.get('credited_item_confirmed_' + count);
var vci = gun.get('valid_credited_item_' + count);
var tu = gun.get('transaction_unconfirmed_' + count);
var comments = gun.get('comments_' + count);