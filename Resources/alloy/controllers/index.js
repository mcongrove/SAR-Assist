function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.GlobalWrapper = A$(Ti.UI.createWindow({
        navBarHidden: !0,
        exitOnClose: !0,
        backgroundColor: "#FFF",
        id: "GlobalWrapper"
    }), "Window", null), $.addTopLevelView($.__views.GlobalWrapper), _.extend($, $.__views);
    var APP = require("core");
    APP.GlobalWrapper = $.GlobalWrapper, APP.GlobalWrapper.open(), APP.init(), APP.handleNavigation({
        controller: "home"
    }), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;