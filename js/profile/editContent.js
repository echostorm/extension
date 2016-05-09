function edit() {
    var saveAndCancel = "<div class='edit'><span class='save'>Save</span><span class='cancel'>Cancel</span></div>";
    var enterImgURL = "<div class='enterImageURL'><p>Enter Image URL:</p><input type='text' /></div>";
    var evt;
    $('#name').on("dblclick", function (event) {
        evt = event.target;
        $(".edit").remove();
        $(evt).attr('contenteditable', 'true');
        $(saveAndCancel).insertBefore($(evt)).show("slow");
    });

    $('#profile-pic').on("dblclick", function (event) {
        evt = event.target;
        $(".enterImageURL").remove();
        $(".edit").remove();
        $(enterImgURL + saveAndCancel).insertBefore($(evt)).show("slow");
    });

    /******** Save edits ********/

    $('#name').on('click', '.cancel', function () {
        $(evt).attr('contenteditable', 'false');
        $(".edit").hide("slow");
    });

    $('#profile-pic').on('click', '.save', function () {
        $(".enterImageURL").hide("slow");
        $(".edit").hide("slow");
        var imgURL = $(".enterImageURL input").val();
        setImage(imgURL);
    });

    $('body').on('click', '.save', function () {
        var newContent = $(".editor").html();
        if ($('#content').hasClass("about")) {
            pd.path('profilePage0').put({
                content: newContent
            });
            showPageData("about");
        } else if ($('#content').hasClass("comments")) {
            pd.path('profilePage1').put({
                content: newContent
            });
            showPageData("comments");
        } else if ($('#content').hasClass("items")) {
            pd.path('profilePage2').put({
                content: newContent
            });
            showPageData("items");
        } else if ($('#content').hasClass("work-history")) {
            pd.path('profilePage3').put({
                content: newContent
            });
            showPageData("work-history");
        } else if ($('#content').hasClass("employment")) {
            pd.path('profilePage4').put({
                content: newContent
            });
            showPageData("employment");
        }
    });

    $('body').on('click', '.cancel', function () {
        $(".edit").hide("slow");
    });
}