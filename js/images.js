var images = {
    setImage: function (imgURL, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imgURL, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            var img = document.createElement('img');
            img.src = window.URL.createObjectURL(this.response);
            cb(img.src);
        };
        xhr.send();
    }
}