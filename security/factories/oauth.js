'use strict';

(function(module){

    var oauth = function($http, formEncode){

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

            return $http.post("/api/login", data, code);

        };

        return{
            login:login
        }
    };

    module.factory("oauth", oauth);

}(angular.module("tothcommon.security")));