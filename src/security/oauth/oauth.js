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

}(angular.module("tothcommon.security.oauth")));