// ДЗ 3 (не обязательное):
//
// Создать страничку с текстовым полем.
// После загрузки странички, загрузить список городов при помощи AJAX.
// При вводе текста в тестовое поле, выводить под текстовым полем список тех городов,
// в названиях которых есть введенный текст. Использование промисов обязательно.
// Запрещено использование любых библиотек (включая jQuery) и фреймворков.

// задать настройки
let downloadBtn = document.getElementById('downloadThenOrderCities');
let downloadUl = document.getElementById('listOfDownloadedCities');
let searchInput = document.getElementById('searchInput');
let searchUl = document.getElementById('listOfLiveSerchedCities');
let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
let method = 'GET';
let flatCityList = []; // плоский список городов
let flatCityListSearch = []; // плоский список отобранных городов

//вспомогательные функции
function getflatCityListElem(node){
    let result = [];
    for(let city of node){
        if (city['name']){
            result.push(city['name']);
        }
    }
    return result;
} //getflatCityListElem

function searchCity(textInput){
    let result = [];
    for(let city of flatCityList){
        if (~city.toLowerCase().indexOf(textInput.toLowerCase())) {
            result.push(city);
        }
    }
    return result;
} //searchCity

function addNewLi(content, parent) {
    var newLi = document.createElement('li');
    newLi.textContent = content;
    parent.appendChild(newLi);
} // addNewLi

// handler для обработки загрузки даных и размещение на странице
function downloadJSON(e, methodXHR, urlXHR) {
    return new Promise(( resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open( methodXHR, urlXHR, true );
        xhr.send();
        xhr.addEventListener(
            'load',
            () => { resolve( xhr.response ); }
        );
        xhr.addEventListener(
            'error',
            () => { reject(); }
        );
    });
} // downloadJSON

function liveCitySearch( e, searchString ) {
    searchUl.innerHTML = '';
    if ( searchString === '' || !searchString ) {
        searchUl.innerHTML = '';
        return;
    }
    flatCityListSearch = searchCity(searchString);
    flatCityListSearch = flatCityListSearch.slice().sort();
    for (let i = 0; i < flatCityListSearch.length; i++) {
        addNewLi(flatCityListSearch[i], searchUl);
    }
    flatCityListSearch = [];
} // liveCitySearch

//Вызвать событие обработки клика по кнопке
downloadBtn.addEventListener(
    'click',
    (e) => { downloadJSON(e, method, url)
                .then(
                    (result) => {
                        flatCityList = getflatCityListElem(result);
                        flatCityList = flatCityList.slice().sort();
                        for (let i = 0; i < flatCityList.length; i++) {
                            addNewLi(flatCityList[i], downloadUl);
                        }
                        searchInput.disabled='';
                    }
                )
            }
);

// событие ввода текста для input
searchInput.addEventListener(
    'input',
    (e) => {
        liveCitySearch(e, searchInput.value );
    }
);
