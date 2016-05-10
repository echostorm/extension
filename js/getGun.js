/* This seems like the best place to clear localstorage as its used by all scripts. However, it doesn't work. When i set the end point to localhost, old data returns from somewhere??? */
localStorage.clear();
chrome.storage.local.clear();

var gun = new Gun( /*'http://localhost:8080'*/ );
var riu = gun.get('rated_item_unconfirmed');
var ric = gun.get('rated_item_confirmed');
var vri = gun.get('valid_rated_item');
var ud = gun.get('user_data');
var pd = gun.get('profile_data');
var scb = gun.get('silver_credits_balance');
var ciu = gun.get('credited_item_unconfirmed');
var cic = gun.get('credited_item_confirmed');
var vci = gun.get('valid_credited_item');
var tu = gun.get('transaction_unconfirmed');
var comments = gun.get('comments');