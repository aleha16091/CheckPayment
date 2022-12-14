let appDiv = document.createElement("div")
appDiv.classList.add('app-conteiner')
appDiv.innerHTML = `<div id="info-user">
<div class="main-user-conteiner">
    <div class="user-conteiner">
        ID пользователя:
        <div id="inser-id"></div>
    </div>
</div>
</div>
<div class="info-payment loaded">
<div class="tabs-app">
    <input type="radio" name="tab-btn" id="tab-btn-1">
    <label for="tab-btn-1">мастер-группы <span id="count_master_app_umsch">0</span></label>
    <input type="radio" name="tab-btn" id="tab-btn-2">
    <label for="tab-btn-2">курсы <span id="count_course_app_umsch">0</span></label>
    <div id="mastergpoup-payment"></div>
    <div id="cours-payment"></div>
</div>
<div class="clock-box">
    <div class="clock"></div>
</div>
</div>`;

let null_mastergroup = document.createElement('div')
null_mastergroup.setAttribute("id", "no-pay-mastergroup");
null_mastergroup.setAttribute("style", "background-image: url(" + document.getElementById('no-pay-mastergroups').textContent + "); background-size: 70%");

let null_course = document.createElement('div')
null_course.setAttribute('id', "no-pay-course");
null_course.setAttribute("style", "background-image: url(" + document.getElementById('no-pay-courses').textContent + "); background-size: 70%");

const true_icon = '✅'
const false_icon = '❌'

class Condition {
    in_dialog = false;
    actual_id = 0;
    actual_name = 0;
}

function get_icon(name){
    if (name == 'На сайте') {
        return  '🖥';
    } else if (name == 'По реквизитам') {
        return '🏦';
    } else if (name == 'Бесплатник') {
        return '🆓';
    } else if (name == 'Перенос с другого предмета') {
        return '🔀';
    } else if (name == 'Штат(без уведомлений)') {
        return '👷‍♂️';
    } else if (name == 'Отсрочник') {
        return '⏳';
    } else if (name == 'Автооплата') {
        return '🔄';
    } else if (name == 'Подарочный') {
        return '🎁';
    } else if (name == 'По подписке') {
        return '📝';
    } else {
        return '❓'
    }
}

class Status_tabs {
    constructor() {
        this.refresh_all()
    }

    refresh_all() {
        this.bool_masterguop = false
        this.bool_course= false
        this.table_mastergroup = document.createElement("table")
        this.table_mastergroup.setAttribute('id', 'table_mastergroup')
        this.table_mastergroup.append(document.createElement("tbody"))
        this.table_course = document.createElement("table")
        this.table_course.setAttribute('id', 'table_course')
        this.table_course.append(document.createElement("tbody"))
    }

    get_table_mastergroup() {
        return this.table_mastergroup
    }
    
    get_table_course() {
        return this.table_course
    }

    create_element(name, price, valid, time, type_pay) {
        let tr = document.createElement("tr");
        tr.setAttribute('width', '319')

        let name_block = document.createElement('td')
        name_block.innerHTML = name

        let price_block = document.createElement('td')
        price_block.classList.add('price-block')
        if (valid) {
            price_block.innerHTML = price + true_icon
        } else {
            price_block.innerHTML = price + false_icon
        }
        name_block.classList.add('tooltip')
        let tooltip = document.createElement('span')
        tooltip.classList.add('tooltiptext')
        tooltip.innerHTML = time
        name_block.append(tooltip)

        let type_block = document.createElement('td')
        type_block.innerHTML = get_icon(type_pay)
        type_block.classList.add('type-block')
        type_block.classList.add('tooltip')
        let icon_tooltip = document.createElement('span')
        icon_tooltip.classList.add('tooltiptext')
        icon_tooltip.innerHTML = type_pay
        type_block.append(icon_tooltip)

        name_block.setAttribute('width', '240')
        type_block.setAttribute('width', '19')
        price_block.setAttribute('width', '60')

        tr.append(name_block)
        tr.append(type_block)
        tr.append(price_block)
        return tr
    }

    add_element_mastergroup(name, price, valid, time, type_pay) {
        this.table_mastergroup.append(this.create_element(name, price, valid, time, type_pay))
    }

    add_element_course(name, price, valid, time, type_pay) {
        this.table_course.append(this.create_element(name, price, valid, time, type_pay))
    }
}

function send_request() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://umschools.xyz/check/vk", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ "vk_id": cond.actual_id, "vk_name": cond.actual_name}));

    let months = {
        '01': 'января',
        '02': 'февраля',
        '03': 'марта',
        '04': 'апреля',
        '05': 'мая',
        '06': 'июня',
        '07': 'июля',
        '08': 'августа',
        '09': 'сентября',
        '10': 'октября',
        '11': 'ноября',
        '12': 'декабря',
    }

    xhr.onload  = function() {
        var jsonResponse = JSON.parse(xhr.responseText);
        document.getElementsByClassName('info-payment')[0].classList.remove('loaded')
        
        console.log(jsonResponse)

        if (jsonResponse['mastergroup'].length == 0) {
            document.getElementById('mastergpoup-payment').append(null_mastergroup)
        } else {
            for (let key in jsonResponse['mastergroup']) {
                tabs.add_element_mastergroup(
                    jsonResponse['mastergroup'][key]['__values__']['product'],
                    jsonResponse['mastergroup'][key]['__values__']['paid_cost'],
                    jsonResponse['mastergroup'][key]['__values__']['valid'],
                    `${jsonResponse['mastergroup'][key]['__values__']['data_paid'].split('T')[0].split('-')[2]} ${months[jsonResponse['mastergroup'][key]['__values__']['data_paid'].split('T')[0].split('-')[1]]} ${jsonResponse['mastergroup'][key]['__values__']['data_paid'].split('T')[0].split('-')[0]} в ${jsonResponse['mastergroup'][key]['__values__']['data_paid'].split('T')[1].split(':')[0]}:${jsonResponse['mastergroup'][key]['__values__']['data_paid'].split('T')[1].split(':')[1]} мск`,
                    jsonResponse['mastergroup'][key]['__values__']['type_pay']
                )
            }
            document.getElementById('count_master_app_umsch').innerHTML = jsonResponse['mastergroup'].length
            document.getElementById('mastergpoup-payment').append(tabs.get_table_mastergroup())
        };  
        
        if (jsonResponse['course'].length == 0) {
            document.getElementById('cours-payment').append(null_course)
        } else {
            for (let key in jsonResponse['course']) {
                tabs.add_element_course(
                    jsonResponse['course'][key]['__values__']['product'],
                    jsonResponse['course'][key]['__values__']['paid_cost'],
                    jsonResponse['course'][key]['__values__']['valid'],
                    `${jsonResponse['course'][key]['__values__']['data_paid'].split('T')[0].split('-')[2]} ${months[jsonResponse['course'][key]['__values__']['data_paid'].split('T')[0].split('-')[1]]} ${jsonResponse['course'][key]['__values__']['data_paid'].split('T')[0].split('-')[0]} в ${jsonResponse['course'][key]['__values__']['data_paid'].split('T')[1].split(':')[0]}:${jsonResponse['course'][key]['__values__']['data_paid'].split('T')[1].split(':')[1]} мск`,
                    jsonResponse['course'][key]['__values__']['type_pay']
                )
            }
            document.getElementById('count_course_app_umsch').innerHTML = jsonResponse['course'].length
            document.getElementById('cours-payment').append(tabs.get_table_course())  
        }
    };
}

function remove_old_data(tabs_) {
    tabs_.refresh_all();

    let mastergpoup_table = document.getElementById('mastergpoup-payment')
    while (mastergpoup_table.firstChild) {
        mastergpoup_table.removeChild(mastergpoup_table.firstChild);
    }
    let course_table = document.getElementById('cours-payment')
    while (course_table.firstChild) {
        course_table.removeChild(course_table.firstChild);
    }
    document.getElementById('count_master_app_umsch').innerHTML = 0
    document.getElementById('count_course_app_umsch').innerHTML = 0

}

(function addToDOM(){
    let spam_block = document.getElementsByClassName('_ui_item_spam')

    // Каждые 0.1 секунды, пока не получится, пробовать найти блок спама
    if (spam_block.length) {
        spam_block[0].after(appDiv);
        let setting_block = document.getElementById('setting_block')
        let mastergpoup_bool = ('true' === setting_block.innerHTML.split('|')[0].split(':')[1])
        let course_bool = ('true' === setting_block.innerHTML.split('|')[1].split(':')[1])
        document.getElementById("tab-btn-1").checked = mastergpoup_bool;
        document.getElementById("tab-btn-2").checked = course_bool;
        cond = new Condition();
        tabs = new Status_tabs();
        var copyText_elem = document.getElementById("inser-id");

        // Копирование айди, при клике на него
        copyText_elem.addEventListener('click', () => {
            var copyText = document.getElementById("inser-id").textContent || document.getElementById("inser-id").innerText;
            navigator.clipboard.writeText(copyText);
        })

        // Проверка места надождения
        if (window.location.href.includes('sel=')) {
            document.getElementsByClassName('app-conteiner')[0].style.display = 'block';
            cond.in_dialog = true;
            cond.actual_id = window.location.href.split('sel=')[1].split('&')[0]
            cond.actual_name = (document.getElementsByClassName('im-page--title-main-inner')[0].href).split('https://vk.com/')[1]
            document.getElementById('inser-id').innerHTML = cond.actual_id;
            send_request();
        }
        else {
            document.getElementsByClassName('app-conteiner')[0].style.display = 'none';
            cond.in_dialog = false;
        };
    
        function callBackEditDOM(mutationsList, observer) {
            if (window.location.href.includes('sel=')) {
                if (window.location.href.split('sel=')[1].includes(cond.actual_id) && (cond.actual_id != 0)) {
                    console.log("Остался в этом же диалоге")
                } else {
                    let app = document.getElementsByClassName('app-conteiner')
                    if (app.length) {
                        app[0].style.display = 'block';
                        cond.in_dialog = true;
                        if (cond.actual_id == 0) {
                            console.log('Зашли в диалог.')
                        } else {console.log('Поменяли диалог.')}
                        document.getElementById('inser-id').innerHTML = cond.actual_id = window.location.href.split('sel=')[1].split('&')[0];
                        remove_old_data(tabs);    
                        send_request();
                    } else {
                        if (cond.actual_id == 0) {
                            console.log('Вход в диалог с ошибкой. Блок приложения не найден. Перезапуск функции.')
                        } else {console.log('Смена диалога с ошибкой. Блок приложения не найден. Перезапуск функции.')}
                        observer.disconnect()
                        addToDOM()
                    }
                } 
            } else {
                if (cond.actual_id == 0) {
                    console.log('Так же остался вне диалога')
                    return
                } else {
                    let app = document.getElementsByClassName('app-conteiner')
                    if (app.length) {
                        app[0].style.display = 'none';
                        console.log('Успешно вышли из диалога.')
                        cond.in_dialog = false;
                        cond.actual_id = 0;
                        cond.actual_name = 0;
                        remove_old_data(tabs);
                    } else {
                        console.log('Выход из диалога с ошибкой. Блок приложения не найден. Перезапуск функции.')
                        observer.disconnect()
                        addToDOM()
                    }
                }
            }
        };
        var observer = new MutationObserver(callBackEditDOM);
        (function addObserver() {
            let bsRightPanel = document.getElementsByClassName('slide-panel-right')[0];
            if (!bsRightPanel) {
                window.setTimeout(addObserver, 350);
            } else {
                console.log('Правая панель найдена')
                observer.observe(bsRightPanel, {subtree: true, attributes: true});
            }
        })();
    } else {
        console.log('Блок спама не найден.')
        window.setTimeout(addToDOM, 100);
    }
})()