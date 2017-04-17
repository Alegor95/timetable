(function(app) {
  app.factory('settingsService', function($cookieStore) {
    var COOKIE_KEY = "lessonsTime_";
    var DEFAULT = JSON.stringify([
      {start: 08 * 3600 + 00 * 60, finish: 09 * 3600 + 35 * 60},
      {start: 09 * 3600 + 45 * 60, finish: 11 * 3600 + 20 * 60},
      {start: 11 * 3600 + 30 * 60, finish: 13 * 3600 + 05 * 60},
      {start: 13 * 3600 + 25 * 60, finish: 15 * 3600 + 00 * 60},
      {start: 15 * 3600 + 10 * 60, finish: 16 * 3600 + 45 * 60},
      {start: 16 * 3600 + 55 * 60, finish: 18 * 3600 + 30 * 60},
      {start: 18 * 3600 + 40 * 60, finish: 20 * 3600 + 00 * 60}
    ])

    var instance = {
      get: function(user, callback) {
          callback(JSON.parse($cookieStore.get(COOKIE_KEY + user.ID) || DEFAULT));
      },
      save: function(user, newTime) {
        $cookieStore.put(COOKIE_KEY + user.ID, JSON.stringify(newTime))
      }
    }

    return instance;
  });
})(window.app);
