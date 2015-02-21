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

angular.module('tothcommon.security', [])

.config(function () {
    console.log("tothcommon.security");
    /*  $mdThemingProvider.theme('default')
     .primaryPalette('light-green', {
     'default': '400', // by default use shade 400 from the pink palette for primary intentions
     'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
     'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
     'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
     })*/

});




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

}(angular.module("tothcommon.security")));
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

}(angular.module("tothcommon.security")));
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

}(angular.module("tothcommon.security")));
'use strict';

(function(module){

    var CurrentUser = function(){

        var setProfile = function(username, token){
            profile.username=username;
            profile.token = token;
        }

        var profile = {
            username:"",
            token:"",
            get loggedIn(){
                return this.token;
            }
        };

        return{
            setProfile:setProfile,
            profile:profile
        }
    };

    module.factory("CurrentUser", CurrentUser);

}(angular.module("tothcommon.security")));