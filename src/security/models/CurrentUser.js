'use strict';

(function(module){

    var CurrentUser = function(localStorage){

        var USERKEY = "utoken";

        var setProfile = function(username, token){
            model.profile.username=username;
            model.profile.token = token;
            localStorage.add(USERKEY,model);
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

        var model = {
            profile:initialize(),
            data:{}
        }

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