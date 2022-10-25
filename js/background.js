function check_update() {        
    chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            console.log(response);
        });
      }); 
}

function tick() {
    let next = new Date(Date.now() + 60 * 1000);
    // next.setMinutes(0);
    next.setSeconds(0);
    next.setMilliseconds(0);

    chrome.storage.local.set({"savedTimestamp": next.getTime()});

    if (check_update()) {
        chrome.action.setBadgeText({ text: `UP!` });
        chrome.action.setBadgeBackgroundColor({ color: "red" });
    }
}

function checkTimestamp() {
    chrome.storage.local.get(['savedTimestamp'], function(result) {
        console.log(result.savedTimestamp)
        if (result.savedTimestamp) {
            let timestamp = parseInt(result.savedTimestamp);

            if (Date.now() >= timestamp) {
                tick();
            }
        } else {
            tick();
        }
    })
}

setInterval(checkTimestamp, 60 * 100);