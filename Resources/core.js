var Alloy = require("alloy"), APP = {
    currentController: null,
    currentControllerId: null,
    GlobalWrapper: null,
    init: function() {
        Ti.Network.addEventListener("change", APP.networkObserver), Ti.App.addEventListener("pause", APP.exit), Ti.App.addEventListener("close", APP.exit), Ti.App.addEventListener("resumed", APP.resume), APP.createDatabase();
    },
    createDatabase: function() {
        var db = Ti.Database.open("SARA");
        db.execute("DELETE FROM marks"), db.execute("CREATE TABLE IF NOT EXISTS marks (latitude VARCHAR, longitude VARCHAR, bearing VARCHAR, timestamp VARCHAR, precision INTEGER);"), db.close();
    },
    handleNavigation: function(_params) {
        _params.controller ? _params.controller != APP.currentControllerId && (APP.currentControllerId = _params.controller, APP.removeCurrentScreen(function() {
            APP.currentController = Alloy.createController(_params.controller, _params), APP.GlobalWrapper.add(APP.currentController.wrapper);
        })) : _params.controller || Ti.API.error("APP.handleNavigation() - Controller is undefined");
    },
    removeCurrentScreen: function(_callback) {
        APP.currentController && (APP.GlobalWrapper.remove(APP.currentController.wrapper), APP.currentController = null), typeof _callback != "undefined" && _callback();
    },
    networkObserver: function(_event) {},
    exit: function() {},
    resume: function() {}
};

module.exports = APP;