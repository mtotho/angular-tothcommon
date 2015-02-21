(function(module){

    module.config(function($provide){

        $provide.decorator("$exceptionHandler", function($delegate){

            return function(exception, cause){
                console.log(exception);
                console.log(cause);
                $delegate(exception, cause);
            };
        });
    });




}(angular.module("tothcommon.diagnostics")));