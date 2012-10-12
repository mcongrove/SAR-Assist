var NAVIBRIDGE = function() {
    Ti.API.trace("NAVIBRIDGE module initiated");
    var API = {
        Version: "1.4",
        URLBase: "navicon://",
        Install: {
            iOS: "http://itunes.apple.com/us/app/navibridge/id498898448?mt=8",
            Android: "http://appcappstore.s3.amazonaws.com/navibridge/NaviBridge_Appcelerator_test_v3.3f.apk"
        },
        ApplicationId: null,
        Platform: Ti.Platform.osname === "iphone" || Ti.Platform.osname === "ipad" ? "ios" : Ti.Platform.osname == "android" ? "android" : "mobileweb"
    };
    return API.setApplicationId = function(_id) {
        Ti.API.trace("NAVIBRIDGE.setApplicationId()"), API.isDefined(_id) && (API.ApplicationId = _id);
    }, API.SetApplicationID = function(_id) {
        Ti.API.info("NAVIBRIDGE.SetApplicationID() is deprecated; use NAVIBRIDGE.setApplicationId()"), API.setApplicationId(_id);
    }, API.openNavi = function() {
        Ti.API.trace("NAVIBRIDGE.openNavi()"), API.checkInstall() ? Ti.Platform.openURL(API.URLBase) : (Ti.API.error("NaviBridge is not installed"), API.installNavi());
    }, API.checkInstall = function() {
        return Ti.API.trace("NAVIBRIDGE.checkInstall()"), Ti.Platform.canOpenURL(API.URLBase) ? !0 : !0;
    }, API.installNavi = function() {
        Ti.API.trace("NAVIBRIDGE.installNavi()");
        if (!API.checkInstall()) {
            var alert = Ti.UI.createAlertDialog({
                title: "NaviBridge Not Installed",
                message: "This action requires you install the NaviBridge application",
                buttonNames: [ "OK", "Cancel" ],
                cancel: 1
            });
            alert.addEventListener("click", function(_event) {
                if (_event.index === 0) {
                    var installURL;
                    switch (API.Platform) {
                      case "ios":
                        installURL = API.Install.iOS;
                        break;
                      case "android":
                        installURL = API.Install.Android;
                        break;
                      case "mobileweb":
                        Ti.API.error("NaviBridge not available for mobile web");
                        return;
                    }
                    Ti.API.info("Installing NaviBridge application"), Ti.Platform.openURL(installURL);
                } else Ti.API.info("User aborted NaviBridge installation");
            }), alert.show();
        } else Ti.API.info("NaviBridge is already installed");
    }, API.addPOI = function(_poi) {
        Ti.API.trace("NAVIBRIDGE.addPOI()");
        if (!API.checkInstall()) return Ti.API.error("NaviBridge is not installed"), API.installNavi(), !1;
        if (typeof _poi != "object" || _poi === null) return Ti.API.error("Incorrect POI data type given (or null)"), !1;
        if ((!API.isDefined(_poi.lat) || !API.isDefined(_poi.lon)) && !API.isDefined(_poi.addr)) return Ti.API.error("POI object must have 'lat' and 'lon' properties, or 'addr' property"), !1;
        var appURL = API.URLBase + "setPOI?";
        appURL += API.appendURL("ver", API.Version), API.isDefined(_poi.lat) && API.isDefined(_poi.lon) && (appURL += API.appendURL("ll", _poi.lat + "," + _poi.lon)), appURL += API.appendURL("addr", _poi.address), appURL += API.appendURL("appName", API.ApplicationId), appURL += API.appendURL("title", _poi.title), appURL += API.appendURL("radKM", _poi.radiusKM), appURL += API.appendURL("radML", _poi.radiusMI), appURL += API.appendURL("tel", _poi.tel), appURL += API.appendURL("text", _poi.text), appURL += API.appendURL("callURL", _poi.callbackURL), Ti.API.info(appURL), Ti.Platform.openURL(appURL);
    }, API.addMultiPOI = function(_object) {
        Ti.API.trace("NAVIBRIDGE.addMultiPOI()");
        if (!API.checkInstall()) return Ti.API.error("NaviBridge is not installed"), API.installNavi(), !1;
        if (typeof _object != "object" || _object === null) return Ti.API.error("Incorrect POI data type given (or null)"), !1;
        if (!API.isDefined(_object.poi)) return Ti.API.error("No POIs found"), !1;
        _object.poi.length > 5 && Ti.API.info("Too many POI items provided; limiting to 5");
        var length = _object.poi.length > 5 ? 5 : _object.poi.length, appURL = API.URLBase + "setMultiPOI?";
        appURL += API.appendURL("ver", API.Version), appURL += API.appendURL("appName", API.ApplicationId);
        for (var i = 0; i < length; i++) {
            var poi = _object.poi[i];
            API.isDefined(poi.lat) && API.isDefined(poi.lon) && (appURL += API.appendURL("ll" + (i + 1), poi.lat + "," + poi.lon)), appURL += API.appendURL("addr" + (i + 1), poi.address), appURL += API.appendURL("title" + (i + 1), poi.title), appURL += API.appendURL("tel" + (i + 1), poi.tel);
        }
        appURL += API.appendURL("text", _object.text), appURL += API.appendURL("callURL", _object.callbackURL), Ti.API.info(appURL), Ti.Platform.openURL(appURL);
    }, API.appendURL = function(_key, _value) {
        return API.isDefined(_value) ? "&" + _key + "=" + _value : "";
    }, API.isDefined = function(_value) {
        return typeof _value != "undefined" && _value !== null ? !0 : !1;
    }, API;
}();

module.exports = NAVIBRIDGE;