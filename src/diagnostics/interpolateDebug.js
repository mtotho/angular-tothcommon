(function(module){

    module.config(function($provide){

        $provide.decorator("$interpolate", function($delegate, $log){

            //keep track of bindings of the same name so we dont spam the console
            var previousBindings = {};

            var serviceWrapper = function(){
                var bindingFunction = $delegate.apply(this, arguments);
                if(angular.isFunction(bindingFunction) && arguments[0]){
                    return bindingWrapper(bindingFunction, arguments[0].trim());
                }

                return bindingFunction;
            };

            var bindingWrapper = function(bindingFunction, bindingExpression){
                return function(){
                    var result = bindingFunction.apply(this, arguments);
                    var trimmedResult = result.trim();

                    if(!previousBindings[trimmedResult]){
                        var log = trimmedResult ? $log.info : $log.warn;
                        if(!trimmedResult) {
                            log.call($log, "BINDING ERROR: " + bindingExpression + " = " + trimmedResult)
                        }else{
                            log.call($log, "BINDING Success: " + bindingExpression + " = " + trimmedResult)
                        }

                        previousBindings[trimmedResult]=1;
                    }

                    return result;
                }
            }
            angular.extend(serviceWrapper, $delegate)
            return serviceWrapper;
        });
    });
}(angular.module("tothcommon.diagnostics")));