/**
 * Created by Michael on 3/21/2016.
 */
homadeApp
    .config(function (ezfbProvider) {
    ezfbProvider.setInitParams({
        appId: '613002398781110'
    });})
    .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDpkTgTR--qces2l4LuT35p1todOQcimJg',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    })});