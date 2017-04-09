(function(app, md5) {
  app.factory('usersService', [ '$http', '$cookieStore', 'postConverter',
    function($http, $cookieStore, postConverter) {

      var loginCookie = 'loginCookie';
      var passwordCookie = 'pass_cookie';

      var API_URLS = {
        'login': 'scripts/users.php/login'
      };
      var loggedUser = null;

      var usersServiceInstance = {
        login: function(login, password, callback) {
          $http({
              method: 'POST',
              url: API_URLS['login'],
              data: postConverter({ 'email': login, 'password': md5(password)})
          }).then(function(resp){
              var user = resp.data;
              $cookieStore.put(loginCookie, login);
              $cookieStore.put(passwordCookie, password);
              callback(user);
          }, function(response){
              throw new Error(response.data.error);
          });
        },
        getLogged: function(callback) {
          if (!loggedUser) {
            var login = $cookieStore.get(loginCookie),
              password = $cookieStore.get(passwordCookie);
            if (!login || !password) return;
            this.login(
              login,
              password,
              function(user) {
                loggedUser = user;
                callback(user);
              }
            );
          } else {
            callback(loggedUser);
          }
        },
        logout: function() {
          $cookieStore.remove(loginCookie);
          $cookieStore.remove(passwordCookie);
          loggedUser = null;
        }
      };

      return usersServiceInstance;

    }
  ])
})(window.app, window.md5)
