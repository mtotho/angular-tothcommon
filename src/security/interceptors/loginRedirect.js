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