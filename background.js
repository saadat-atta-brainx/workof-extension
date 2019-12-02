let is_popup_opened = false;
chrome.browserAction.onClicked.addListener(function (tab) {

    if (is_popup_opened) {
        //Send message to close popup window
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { data: { type: "CLOSE_POPUP", content: '' } });
        });
    } else {
        //Send message to open popup window
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            fetch('popup_panel.html').then(data => data.text()).then(html => {
                chrome.tabs.sendMessage(tabs[0].id, { data: { type: "OPEN_POPUP", content: html } });
                chrome.tabs.sendMessage(tabs[0].id, { data: { type: "SET_POPUP_PRODUCT_IMAGE_PATH", content: chrome.extension.getURL("pointer-hand.jpg") } });
            });
        });
    }
    is_popup_opened = !is_popup_opened;

});