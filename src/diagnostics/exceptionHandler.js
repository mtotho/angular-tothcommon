(function(module){

    module.config(function($provide){

        $provide.decorator("$exceptionHandler", function($delegate){

            return function(exception, cause){
                console.log("===DIAGNOSTICS: Exception");
                console.log({
                    exception:exception,
                    cause:cause
                });

                $delegate(exception, cause);
            };
        });
    });




}(angular.module("tothcommon.diagnostics")));