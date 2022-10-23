var script = document.createElement('script');
script.src = chrome.runtime.getURL('js/script.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

var css = document.createElement('link');
css.src = chrome.runtime.getURL('insert.css');
css.rel = 'stylesheet'
css.type = 'text/css'
css.onload = function() {
    this.remove();
};
(document.head).appendChild(css)

var Not_search_course = document.createElement('div')
Not_search_course.setAttribute("id", "no-pay-courses")
Not_search_course.innerText = chrome.runtime.getURL("/images/Not-search-course.png");
Not_search_course.style.display = "none";
(document.head).appendChild(Not_search_course)

var Not_search_mastergroup = document.createElement('div')
Not_search_mastergroup.setAttribute("id", "no-pay-mastergroups")
Not_search_mastergroup.innerText = chrome.runtime.getURL("/images/Not-search-mastergroup.png");
Not_search_mastergroup.style.display = "none";
(document.head).appendChild(Not_search_mastergroup)

function add_to_storage() {
    chrome.storage.local.set({"mastergroup": true, "course": false}), function(){
        console.log("Успешное добавление в локальное хранилище");
    }
}

chrome.storage.local.get([ "mastergroup" , "course" ], function(result) {
    if (result.mastergroup == undefined || result.course == undefined ) {
        add_to_storage()
    } else if ( result.mastergroup == true && result.course == true ) {
        add_to_storage()
    } else if ( result.mastergroup == false && result.course == false ) {
        add_to_storage()
    }
});

window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received message: " + event.data.text);
        chrome.storage.local.get([ "mastergroup" , "course" ], function(result) {
            console.log("in ...", {"mastergroup": result.mastergroup, "course": result.course});
            return {"mastergroup": result.mastergroup, "course": result.course}
        })
    }
});