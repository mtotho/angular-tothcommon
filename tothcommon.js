'use strict';

angular.module('tothcommon', [

])

    .config(function () {
        console.log("tothcommon");

    });




'use strict';

angular.module('tothcommon.diagnostics', [

]);




'use strict';

angular.module('tothcommon.oauth', [
    'gapi'
]).value('GoogleApp', {
    apiKey: 'AIzaSyCYq35NHoCDCJLzk4yYwbznLiRYConavoo',
    clientId: '699007912539-32e3hft1eio7us5rcqql1fp142v1b8ea.apps.googleusercontent.com',
    scopes: [
        // whatever scopes you need for your app, for example:
        'profile'

        // ...
    ]
});





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
        var USERKEY = "uutoken";

        var model = {
            profile: {
                username: "",
                token: "",
                get loggedIn() {
                    return this.token;
                }
            },
            data:{}
        }


        var setProfile = function(username, token){
            model.profile.username=username;
            model.profile.token = token;
            localStorage.add(USERKEY,model);
        }

        var initialize = function(){

            var localUser = localStorage.get(USERKEY);
            if(localUser){

                setProfile(localUser.profile.username, localUser.profile.token);
                model.data = localUser.data;

            }

            console.log(model);
        }
        initialize();




        var setData = function(key, value){
            model.data[key] = value;

            localStorage.add(USERKEY,model);
        }
        return{
            setProfile:setProfile,
            setData:setData,
            profile:model.profile,
            data:model.data
        }
    };

    module.factory("CurrentUser", CurrentUser);

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

}(angular.module("tothcommon.oauth")));