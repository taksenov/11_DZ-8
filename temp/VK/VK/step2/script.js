new Promise(function(resolve) {
  if (document.readyState == 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5267932
    });

    VK.Auth.login(function(response) {
      if (response.session) {
        resolve(response);
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 8);
  });
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.api('users.get', {'name_case': 'gen'}, response => {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        let userData = response.response[0];
        
        headerInfo.textContent = `Музыка на странице ${userData.first_name} ${userData.last_name}`;

        resolve();
      }
    });
  });
}).catch(function(e) {
  alert(`Ошибка: ${e.message}`);
});

