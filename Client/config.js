/**
 * Created by Michael on 3/21/2016.
 */
homadeApp
    .config(function (ezfbProvider) {
        var appid;
        if (window.location.hostname == 'localhost') appid = '1020897501324929';
        if (window.location.hostname == 'homade.herokuapp.com') appid = '613002398781110';
    ezfbProvider.setInitParams({
        //appId: '613002398781110' // Prod
        //appId: '1020897501324929' // Test
        appId: appid
    });})
    .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDpkTgTR--qces2l4LuT35p1todOQcimJg',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    })})
    .config(function (cloudinaryProvider) {
        cloudinaryProvider.config({
            upload_endpoint: 'https://api.cloudinary.com/v1_1/dzidemhzt', // default
            cloud_name: 'dzidemhzt' // required
        });
    });