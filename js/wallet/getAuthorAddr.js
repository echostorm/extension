    /* get the account number associated with the user who is lobbying for credit (if any) from local storage. NOTE: i used local storage as i was unable pass the account number from background.js for some reason?? The account number is used to populate the input field on the wallet. 
     */
    $(document).ready(function () {
        chrome.storage.local.get('recipientID', function (data) {
            var isEmpty = jQuery.isEmptyObject(data);
            if (!isEmpty) {
                $('input.recipientID').val(data.recipientID.recipientID);
            } else {
                console.log("There is no recipientID??? This should be taken from the widget. ");
            }
        });
    });