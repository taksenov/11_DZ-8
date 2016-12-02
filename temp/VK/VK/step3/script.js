Handlebars.registerHelper('formatTime', function(time) {
  let minutes = parseInt(time / 60);
  let seconds = time - minutes * 60;

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return minutes + ':' + seconds;
});

new Promise(function(resolve) {
  if (document.readyState === 'complete') {
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
    VK.api('users.get', {'name_case': 'gen'}, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        headerInfo.textContent = `Музыка на странице ${response.response[0].first_name} ${response.response[0].last_name}`;

        resolve();
      }
    });
  })
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.api('audio.get', {v: '5.53'}, function(serverAnswer) {
      console.log(serverAnswer);
      if (serverAnswer.error) {
        reject(new Error(serverAnswer.error.error_msg));
      } else {
        let source = playerItemTemplate.innerHTML;
        let templateFn = Handlebars.compile(source);
        let template = templateFn({ list: serverAnswer.response.items });

        results.innerHTML = template;

        resolve();
      }
    });
  });
}).catch(function(e) {
  alert(`Ошибка: ${e.message}`);
});

