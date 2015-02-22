'use strict';

angular.module('tothcommon.oauth', [
    'gapi'
]).value('GoogleApp', {
    apiKey: 'AIzaSyCYq35NHoCDCJLzk4yYwbznLiRYConavoo',
    clientId: '699007912539-32e3hft1eio7us5rcqql1fp142v1b8ea.apps.googleusercontent.com',
    scopes: [
        // whatever scopes you need for your app, for example:
        'profile'

        // ...
    ]
});




