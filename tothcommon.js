'use strict';

angular.module('tothcommon', [

])

    .config(function () {
        console.log("tothcommon");
        /*  $mdThemingProvider.theme('default')
         .primaryPalette('light-green', {
         'default': '400', // by default use shade 400 from the pink palette for primary intentions
         'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
         'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
         'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
         })*/

    });




'use strict';

angular.module('tothcommon.diagnostics', [

]);




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
'use strict';

(function(module){

    var localStorage = function($window){

        var store = $window.localStorage;

        var add = function (key, value){
            value = angular.toJson(value);
            store.setItem(key, value);
        };

        var get = function (key){
            var value = store.getItem(key);
            if(value){
                value = angular.fromJson(value);
            }
            return value;
        }

        var remove = function(key){
            store.removeItem(key);
        }

        return{
            add:add,
            get:get,
            remove:remove
        }
    };

    module.factory("localStorage", localStorage);

}(angular.module("tothcommon")));
'use strict';

(function(module){

    var oauth = function($http, formEncode, CurrentUser){

        var login = function(username, password){

            var config = {
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            };

            var data = formEncode({
                username:username,
                password:password,
                grant_type:"password"
            });

            return $http.post("/api/login", data, code)
                        .then(function(){
                            currentUser.setProfile(username,response.data.access_token);
                            return username;
                        });

        };

        return{
            login:login
        }
    };

    module.factory("oauth", oauth);

}(angular.module("tothcommon")));
'use strict';

(function(module){

    var addToken = function(CurrentUser, $q){

        //If the user is logged in on an HTTP request, add their token to headers
        var request = function(config){
            console.log("+-tothcommon.security: intercepting http request");
            if(CurrentUser.profile.loggedIn){
                config.headers.Authorization = "Bearer " + CurrentUser.profile.token;
            }

            return $q.when(config);
        }

        return{
           request:request
        }
    };

    module.factory("addToken", addToken);

    module.config(function($httpProvider){
        $httpProvider.interceptors.push("addToken");
    });

}(angular.module("tothcommon")));
'use strict';

(function(module){

    var loginRedirect = function($q, $location){
        var lastPath = "/";

        var responseError = function(response){
            console.log("+-tothcommon.security: intercepting http response error");
            if(response.status == 401){
                lastPath = $location.path();
                $location.path('/login');
            }
            return $q.reject(response);
        }

        var redirectPostLogin=function(){
            $location.path(lastPath);
            lastPath="/";
        }

        return{
            redirectPostLogin:redirectPostLogin,
            responseError:responseError
        }
    };

    module.factory("loginRedirect", loginRedirect);

    module.config(function($httpProvider){
        $httpProvider.interceptors.push("loginRedirect");
    });

}(angular.module("tothcommon")));
'use strict';

(function(module){

    var CurrentUser = function(localStorage){

        var USERKEY = "utoken";

        var setProfile = function(username, token){
            profile.username=username;
            profile.token = token;
            localStorage.add(USERKEY, profile);
        }

        var initialize = function(){

            var user ={
                username:"",
                token:"",
                get loggedIn() {
                    return this.token;
                }
            }
            var localUser = localStorage.get(USERKEY);
            if(localUser){
                user.username = localUser.username;
                user.token = localUser.token;
            }

            return user;
        }

        var profile = initialize();

        return{
            setProfile:setProfile,
            profile:profile
        }
    };

    module.factory("CurrentUser", CurrentUser);

}(angular.module("tothcommon")));