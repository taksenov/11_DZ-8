// ДЗ 2: Создать приложение для ВКонтакте, которое загружает список ваших
// друзей и выводит их на страницу в следующем формате:
// Фото, ФИО, Возраст, Дата рождения.
// Друзья должны быть отсортированы по дате рождения в порядке убывания.
// То есть на самом верху списка расположен друг с ближайший датой рождения.
// Использование шаблонизатора приветствуется.
// =============================================================================

// =============================================================================
// VK AppID = 5757533
// =============================================================================

// =============================================================================
// Установка HTTP-сервера:
// 1) npm install http-server -g
// Запуск HTTP-сервера:
// 2) http-server hm2 -p 7777 -a 127.0.0.1
// 3) http://localhost:7777/
// =============================================================================

let vkAppId = 5757533;
let headerUserFriendsVK = document.getElementById('headerUserFriendsVK');
let listOfDownloadedFriends = document.getElementById('listOfDownloadedFriends');
let allRenderedFriends = document.getElementById('allRenderedFriends');
let VK_ACCESS_FRIENDS = 2;

new Promise(function(resolve) {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.onload = resolve;
        }
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: vkAppId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, VK_ACCESS_FRIENDS);
        });
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.api('users.get', {'name_case': 'gen'}, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    headerUserFriendsVK.textContent = `Друзья ${response.response[0].first_name} ${response.response[0].last_name}`;
                    resolve();
                }
            });
        })
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.api('friends.get', {v: '5.8'}, function(serverAnswer) {
                if (serverAnswer.error) {
                    reject(new Error(serverAnswer.error.error_msg));
                } else {
                    // let tempArrOfObj = [];
                    // for (let i = 0; i < serverAnswer.response.items.length; i++) {
                    //     tempArrOfObj[i] = {id: serverAnswer.response.items[i]};
                    // }
                    //
                    // console.log(tempArrOfObj);
                    // let source = allRenderedFriends.innerHTML;
                    // let templateFn = Handlebars.compile(source);
                    // let template = templateFn({ list: tempArrOfObj });
                    // console.log(template);
                    // //
                    // listOfDownloadedFriends.innerHTML = template;
                    //serverAnswer.response.items
                    resolve(serverAnswer);
                }
            });
        });
    })
    .then( function(serverAnswer) {
        return new Promise(
            function(resolve, reject) {
                VK.api(
                    'users.get',
                    {
                        v: '5.8',
                        user_ids: serverAnswer.response.items,
                        fields: 'bdate'
                    },
                    function(serverAnswer) {
                        if (serverAnswer.error) {
                            reject(new Error(serverAnswer.error.error_msg));
                        } else {
                            console.log('serverAnswer', serverAnswer);
                            // let tempArrOfObj = [];
                            // for (let i = 0; i < serverAnswer.response.items.length; i++) {
                            //     tempArrOfObj[i] = {id: serverAnswer.response.items[i]};
                            // }
                            //
                            // console.log(tempArrOfObj);
                            // let source = allRenderedFriends.innerHTML;
                            // let templateFn = Handlebars.compile(source);
                            // let template = templateFn({ list: tempArrOfObj });
                            // console.log(template);
                            // //
                            // listOfDownloadedFriends.innerHTML = template;
                            //serverAnswer.response.items
                            resolve();
                        }
                });
            }
        );
    })
    .catch(function(e) {
        alert(`Ошибка: ${e.message}`);
    });
