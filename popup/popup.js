function add_to_storage() {
    chrome.storage.local.set({"mastergroup": true, "course": false}), function(){
        console.log("Успешное добавление в локальное хранилище");
    }
    document.getElementById('popup_mastergroup').checked = true;
    document.getElementById('popup_course').checked = false;

}

chrome.storage.local.get([ "mastergroup" , "course" ], function(result) {
    if (result.mastergroup == undefined || result.course == undefined ) {
        add_to_storage()
    } else if ( result.mastergroup == true && result.course == true ) {
        add_to_storage()
    } else if ( result.mastergroup == false && result.course == false ) {
        add_to_storage()
    } else {
        document.getElementById('popup_mastergroup').checked = result.mastergroup;
        document.getElementById('popup_course').checked = result.course;
    }

});

document.getElementById('popup_mastergroup').onclick = function() {
    chrome.storage.local.set({"mastergroup": true, "course": false}), function(){
        browser.action.setBadgeText({ 'text': 'up!' })
        console.log("Успешное добавление в локальное хранилище");
    }
}

document.getElementById('popup_course').onclick = function() {
    chrome.storage.local.set({"mastergroup": false, "course": true}), function(){
        browser.action.setBadgeText({ 'text': 'up!' })
        console.log("Успешное добавление в локальное хранилище");
    }
}

