(function(app) {
  app.config(function($provide){
     $provide.decorator('$exceptionHandler', function($delegate, $injector) {

        var idSeq = 0;
        var errorShowTO = 3000;

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
          $log.warn(exception);
          $rootScope.errors.push(error);
          $timeout(function() {
            $rootScope.errors.splice($rootScope.errors.indexOf(error), 1);
          }, errorShowTO);
        };
      });
  });
})(window.app);
