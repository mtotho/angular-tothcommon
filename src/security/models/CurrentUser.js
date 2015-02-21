'use strict';

(function(module){

    var CurrentUser = function($http, formEncode){

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