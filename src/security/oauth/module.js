'use strict';

angular.module('tothcommon.security.oauth', [
    'tothcommon.security',
    'angular-google-gapi'
])

    .run(function (GAuth, GApi, $state) {

        var CLIENT = '699007912539-32e3hft1eio7us5rcqql1fp142v1b8ea.apps.googleusercontent.com';
        var BASE = 'http://localhost:2004/api';

        GApi.load('myApiName','v1',BASE);

        GAuth.setClient(CLIENT);

        GAuth.checkAuth().then(
            function () {
                $state.go('webapp.home'); // an example of action if it's possible to
                // authenticate user at startup of the application
            },
            function() {
                $state.go('login');       // an example of action if it's impossible to
                // authenticate user at startup of the application
            }
        );


    });



