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