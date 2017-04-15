(function(app) {
  app.factory('settingsService', function($cookieStore) {
    var COOKIE_KEY = "lessonsTime_";

    var instance = {
      get: function(user, callback) {
          callback(JSON.parse($cookieStore.get(COOKIE_KEY + user.ID))||[]);
      },
      save: function(user, newTime) {
        $cookieStore.put(COOKIE_KEY + user.ID, JSON.stringify(newTime))
      }
    }

    return instance;
  });
})(window.app);
