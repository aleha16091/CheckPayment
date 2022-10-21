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