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

        var data = {};
        return{
            setProfile:setProfile,
            profile:profile,
            data:data
        }
    };

    module.factory("CurrentUser", CurrentUser);

}(angular.module("tothcommon")));