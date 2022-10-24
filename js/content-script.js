function add_to_dom() {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL('insert.js');
    script.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(script);

    var css = document.createElement('link');
    css.src = chrome.runtime.getURL('../css/insert.css');
    css.rel = 'stylesheet'
    css.type = 'text/css'
    css.onload = function() {
        this.remove();
    };
    (document.head).appendChild(css)

    var Not_search_course = document.createElement('div')
    Not_search_course.setAttribute("id", "no-pay-courses")
    Not_search_course.innerText = chrome.runtime.getURL("../images/Not-search-course.png");
    Not_search_course.style.display = "none";
    (document.head).appendChild(Not_search_course)

    var Not_search_mastergroup = document.createElement('div')
    Not_search_mastergroup.setAttribute("id", "no-pay-mastergroups")
    Not_search_mastergroup.innerText = chrome.runtime.getURL("../images/Not-search-mastergroup.png");
    Not_search_mastergroup.style.display = "none";
    (document.head).appendChild(Not_search_mastergroup)
}

add_to_dom()

function add_to_storage() {
    chrome.storage.local.set({"mastergroup": true, "course": false}), function(){
        let settings = document.createElement('div')
        settings.setAttribute("id", "setting_block")
        settings.setAttribute("style", "display: none;")
        settings.innerHTML = 'mastergroup:' + result.mastergroup + '|course:' + result.course

        let spam_block = document.getElementsByClassName('_ui_item_spam')
        spam_block[0].after(settings)
    }
}

chrome.storage.local.get([ "mastergroup" , "course" ], function(result) {
    if (result.mastergroup == undefined || result.course == undefined ) {
        add_to_storage()
    } else if ( result.mastergroup == true && result.course == true ) {
        add_to_storage()
    } else if ( result.mastergroup == false && result.course == false ) {
        add_to_storage()
    } else {
        let settings = document.createElement('div')
        settings.setAttribute("id", "setting_block")
        settings.setAttribute("style", "display: none;")
        settings.innerHTML = 'mastergroup:' + result.mastergroup + '|course:' + result.course

        let spam_block = document.getElementsByClassName('_ui_item_spam')
        spam_block[0].after(settings)
    }
});


function check_update() {
    chrome.action.setBadgeBackgroundColor({ color: '#00FF00' })
    chrome.action.setBadgeText({ text: 'up!' })
           
    console.log(1)
}

function tick() {
    let next = new Date(Date.now() + 60 * 1000);
    // next.setMinutes(0);
    next.setSeconds(0);
    next.setMilliseconds(0);

    localStorage.savedTimestamp = next.getTime();

    check_update();
}

function checkTimestamp() {
    if (localStorage.savedTimestamp) {
        let timestamp = parseInt(localStorage.savedTimestamp);

        if (Date.now() >= timestamp) {
            tick();
        }
    } else {
        tick();
    }
}

setInterval(checkTimestamp, 10000);