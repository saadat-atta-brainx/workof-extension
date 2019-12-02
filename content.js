$(document).ready(function () {
    setFontawesomeLinkToExtension();
    let selectedInputId = "";
    let selectedInputType = "";

    $("body").on("click", ".field-selector", function () {
        selectedInputId = $(this).data('targetid');
        selectedInputType = $(this).data('type');
    });

    $(document).mouseover(function (e) {
        if ($(e.target).is('.popup-container, .popup-container *') || !selectedInputId) {
            return;
        }
        $(e.target).addClass('selection-border');
    })

    $(document).mouseout(function (e) {
        if ($(e.target).is('.popup-container, .popup-container *') || !selectedInputId) {
            return;
        }
        $(e.target).removeClass('selection-border');
    })


    $(document).click((e) => {
        // Disable selection for popup extension container
        if ($(e.target).is('.popup-container, .popup-container *') || !selectedInputId) {
            return;
        }

        let content = "";
        if (selectedInputType === "text") {
            content = $(e.target).text().trim();
            $(`#${selectedInputId}`).val(content);

        } else if (selectedInputType === "number") {
            content = $(e.target).text();
            content = parseFloat(content.replace(/[^0-9\.]+/g, ""));
            if (content)
                $(`#${selectedInputId}`).val(content);
            else {
                $('#popupContainerToast .toast-body').text("Invalid number type");
                $('#popupContainerToast').toast('show');
            }

        } else if (selectedInputType === "image") {
            if ($(e.target).is("img")) {
                content = $(e.target).attr('src');
            } else if ($(e.target).children('img').length > 0) {
                content = $(e.target).children('img')[0].attr('src');
            } else {
                content = $(e.target).parents('img').attr('src');
            }

            if (content) {
                content = parseImageSource(content);
                $(`#${selectedInputId}`).attr('src', content);
            }
        }
        selectedInputId = "";
        selectedInputType = "";
        return false;

    });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.data && request.data.type === "OPEN_POPUP") {
        $('body').css('margin-right', '300px');
        $('body').append(request.data.content);

    } else if (request.data && request.data.type === "CLOSE_POPUP") {
        $('body').css('margin-right', '0px');
        $('body').find('.popup-container').remove();
    } else if (request.data && request.data.type === "SET_POPUP_PRODUCT_IMAGE_PATH") {
        $('body').find('.popup-container #popupProductImage').attr('src', request.data.content);
    }
});



parseImageSource = (url) => {
    //Remove leading slashes if any
    while (url.charAt(0) == '/' || url.charAt(0) == '\\') {
        url = url.substr(1);
    }
    // Regular expression matching www.google.com like pattern
    if (url.match(/([a-zA-z0-9]\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)) {
        if (!(url.indexOf("http://") == 0 || url.indexOf("https://") == 0)) {
            url = window.location.protocol + "//" + url;
        }
    } else {
        url = window.location.origin + "//" + url;
    }
    return url;
}

setFontawesomeLinkToExtension = () => {
    var cssId = 'myCss';
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.extension.getURL("fontawesome/css/all.css");
        link.media = 'all';
        head.appendChild(link);
    }
}
