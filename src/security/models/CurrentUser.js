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