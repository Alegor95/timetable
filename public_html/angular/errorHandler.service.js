(function(app) {
  app.config(function($provide){
     $provide.decorator('$exceptionHandler', function($delegate, $injector) {

        var idSeq = 0;
        var errorShowTO = 1000;

        return function myExceptionHandler(exception, cause) {

          $delegate(exception, cause);

          var $rootScope = $injector.get("$rootScope");
          var $log = $injector.get("$log");
          var $timeout = $injector.get("$timeout");

          if (!$rootScope.errors) {
            $rootScope.errors = [];
          }
          var error = {
            id: idSeq++,
            exception: exception.message
          };
          $log.warn(error);
          $rootScope.errors.push(error);
          $timeout(function() {
            console.log($rootScope.errors.indexOf(error));
            $rootScope.errors.slice($rootScope.errors.indexOf(error), 1);
          }, errorShowTO);
        };
      });
  });
})(window.app);
