// ДЗ 1: переделать предыдущее ДЗ с загрузкой списка городов по AJAX.
// После загрузки страницы, происходит загрузка городов через AJAX.
// Города сортируются по имени и выводятся на странице при помощи шаблонизатора Handlebars.
// При вводе значений в текстовое поле, должны скрываться те города,
// в названии которых нет подстроки, указанной в текстовом поле.

// СТАРОЕ ДЗ! ==================================================================
// ДЗ 3 (не обязательное):
// Создать страничку с текстовым полем.
// После загрузки странички, загрузить список городов при помощи AJAX.
// При вводе текста в тестовое поле, выводить под текстовым полем список тех городов,
// в названиях которых есть введенный текст. Использование промисов обязательно.
// Запрещено использование любых библиотек (включая jQuery) и фреймворков.
// СТАРОЕ ДЗ! ==================================================================

// задать настройки
let downloadBtn = document.getElementById('downloadThenOrderCities');
let downloadUl = document.getElementById('listOfDownloadedCities');
let listOfDownloadedCities = document.getElementById('listOfDownloadedCities');
let searchInput = document.getElementById('searchInput');
let searchUl = document.getElementById('listOfLiveSerchedCities');
let allRenderedCities = document.getElementById('allRenderedCities');
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

// todo переписать с учетом появления handlebars
function addNewLi(content, parent) {
    var newLi = document.createElement('li');
    newLi.textContent = content;
    parent.appendChild(newLi);
} // addNewLi

// handler для обработки загрузки даных и размещение на странице
function downloadJSON(e, methodXHR, urlXHR) {
    return new Promise(( resolve, reject) => {
        let xhr = new XMLHttpRequest();
        // xhr.responseType = 'json';
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

function setupCitiesDownload(e) {
    downloadJSON(e, method, url)
        .then(
            (result) => {
                flatCityList = getflatCityListElem(JSON.parse(result));
                flatCityList = flatCityList.slice().sort();
                let tempArrOfObj = [];
                for (let i = 0; i < flatCityList.length; i++) {
                    tempArrOfObj[i] = {name: flatCityList[i]};
                }
                let source = allRenderedCities.innerHTML;
                let templateFn = Handlebars.compile(source);
                let template = templateFn( { list: tempArrOfObj } );
                listOfDownloadedCities.innerHTML = template;
                searchInput.disabled='';
            }
        )
}

function liveCitySearch( e, searchString ) {
    if ( searchString === '' || !searchString ) {
        setupCitiesDownload();
        return;
    }
    flatCityList = searchCity(searchString);
    flatCityList = flatCityList.slice().sort();
    let tempArrOfObj = [];
    for (let i = 0; i < flatCityList.length; i++) {
        tempArrOfObj[i] = {name: flatCityList[i]};
    }
    let source = allRenderedCities.innerHTML;
    let templateFn = Handlebars.compile(source);
    let template = templateFn( { list: tempArrOfObj } );
    listOfDownloadedCities.innerHTML = template;
    flatCityListSearch = [];
} // liveCitySearch

//Вызвать событие обработки клика по кнопке
downloadBtn.addEventListener(
    'click',
    setupCitiesDownload
);

// событие ввода текста для input
searchInput.addEventListener(
    'input',
    (e) => {
        liveCitySearch(e, searchInput.value );
    }
);
