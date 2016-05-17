/* create a reference to the root of Firebase database */
var riu = new Firebase('https://givemecredit.firebaseio.com/rated_item_unconfirmed');
var ric = new Firebase('https://givemecredit.firebaseio.com/rated_item_confirmed');
var vri = new Firebase('https://givemecredit.firebaseio.com/valid_rated_item');
var ud = new Firebase('https://givemecredit.firebaseio.com/user_data');
var pd = new Firebase('https://givemecredit.firebaseio.com/profile_data');
var scb = new Firebase('https://givemecredit.firebaseio.com/silver_credits_balance');
var ciu = new Firebase('https://givemecredit.firebaseio.com/credited_item_unconfirmed');
var cic = new Firebase('https://givemecredit.firebaseio.com/credited_item_confirmed');
var vci = new Firebase('https://givemecredit.firebaseio.com/valid_credited_item');
var tu = new Firebase('https://givemecredit.firebaseio.com/transaction_unconfirmed');
var comments = new Firebase('https://givemecredit.firebaseio.com/comments');