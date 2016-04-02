/**
 * Created by Dudu on 08/03/2016.
 */
var homadeApp = angular.module('homadeApp', ['ngRoute', 'appRoutes', 'ezfb', 'ngTagsInput', 'uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAYVxd-QsXLQQ_Q1DVIlzF_RzWvEZNycKA',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});
