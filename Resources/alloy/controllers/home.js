function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    var $ = this, exports = {};
    $.__views.wrapper = A$(Ti.UI.createView({
        backgroundColor: "#333",
        layout: "vertical",
        id: "wrapper"
    }), "View", null), $.addTopLevelView($.__views.wrapper), $.__views.currentLocation = A$(Ti.UI.createView({
        backgroundImage: "/images/backgroundLocation.png",
        width: "320dp",
        height: "83dp",
        top: 0,
        left: 0,
        id: "currentLocation"
    }), "View", $.__views.wrapper), $.__views.wrapper.add($.__views.currentLocation), $.__views.currentCoordinates = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "26dp",
        top: "20dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        left: "20dp",
        id: "currentCoordinates"
    }), "Label", $.__views.currentLocation), $.__views.currentLocation.add($.__views.currentCoordinates), $.__views.currentBearing = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "26dp",
        top: "20dp",
        font: {
            fontSize: "24dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        right: "20dp",
        textAlign: "right",
        id: "currentBearing"
    }), "Label", $.__views.currentLocation), $.__views.currentLocation.add($.__views.currentBearing), $.__views.currentCoordinatesLabel = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "10dp",
        bottom: "20dp",
        font: {
            fontSize: "10dp",
            fontWeight: "bold"
        },
        color: "#008800",
        left: "20dp",
        id: "currentCoordinatesLabel",
        text: "CURRENT LOCATION"
    }), "Label", $.__views.currentLocation), $.__views.currentLocation.add($.__views.currentCoordinatesLabel), $.__views.currentBearingLabel = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "10dp",
        bottom: "20dp",
        font: {
            fontSize: "10dp",
            fontWeight: "bold"
        },
        color: "#008800",
        right: "20dp",
        textAlign: "right",
        id: "currentBearingLabel",
        text: "CURRENT BEARING"
    }), "Label", $.__views.currentLocation), $.__views.currentLocation.add($.__views.currentBearingLabel), $.__views.labelPrecision = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "10dp",
        top: "12dp",
        left: "20dp",
        font: {
            fontSize: "10dp",
            fontWeight: "bold"
        },
        color: "#008800",
        id: "labelPrecision",
        text: "SELECT SIGNAL STRENGTH AND PRECISION"
    }), "Label", $.__views.wrapper), $.__views.wrapper.add($.__views.labelPrecision), $.__views.buttonGroupPrecision = A$(Ti.UI.createView({
        height: "40dp",
        top: "10dp",
        left: "15dp",
        right: "20dp",
        layout: "horizontal",
        id: "buttonGroupPrecision"
    }), "View", $.__views.wrapper), $.__views.wrapper.add($.__views.buttonGroupPrecision), $.__views.buttonPrecisionLow = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: "5dp",
        id: "buttonPrecisionLow",
        index: "0"
    }), "View", $.__views.buttonGroupPrecision), $.__views.buttonGroupPrecision.add($.__views.buttonPrecisionLow), $.__views.__alloyId0 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        textAlign: "center",
        touchEnabled: !1,
        text: "LOW",
        id: "__alloyId0"
    }), "Label", $.__views.buttonPrecisionLow), $.__views.buttonPrecisionLow.add($.__views.__alloyId0), $.__views.buttonPrecisionMedium = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: "5dp",
        id: "buttonPrecisionMedium",
        index: "1"
    }), "View", $.__views.buttonGroupPrecision), $.__views.buttonGroupPrecision.add($.__views.buttonPrecisionMedium), $.__views.__alloyId1 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        textAlign: "center",
        touchEnabled: !1,
        text: "MED",
        id: "__alloyId1"
    }), "Label", $.__views.buttonPrecisionMedium), $.__views.buttonPrecisionMedium.add($.__views.__alloyId1), $.__views.buttonPrecisionHigh = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: "5dp",
        id: "buttonPrecisionHigh",
        index: "2"
    }), "View", $.__views.buttonGroupPrecision), $.__views.buttonGroupPrecision.add($.__views.buttonPrecisionHigh), $.__views.__alloyId2 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        textAlign: "center",
        touchEnabled: !1,
        text: "HIGH",
        id: "__alloyId2"
    }), "Label", $.__views.buttonPrecisionHigh), $.__views.buttonPrecisionHigh.add($.__views.__alloyId2), $.__views.labelDistance = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "10dp",
        top: "20dp",
        left: "20dp",
        font: {
            fontSize: "10dp",
            fontWeight: "bold"
        },
        color: "#008800",
        id: "labelDistance",
        text: "SELECT DESIRED DISTANCE TO NEXT MEASUREMENT"
    }), "Label", $.__views.wrapper), $.__views.wrapper.add($.__views.labelDistance), $.__views.buttonGroupDistance = A$(Ti.UI.createView({
        height: "40dp",
        top: "10dp",
        left: "15dp",
        right: "20dp",
        layout: "horizontal",
        id: "buttonGroupDistance"
    }), "View", $.__views.wrapper), $.__views.wrapper.add($.__views.buttonGroupDistance), $.__views.buttonDistance1 = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: "5dp",
        id: "buttonDistance1",
        index: "0"
    }), "View", $.__views.buttonGroupDistance), $.__views.buttonGroupDistance.add($.__views.buttonDistance1), $.__views.__alloyId3 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        textAlign: "center",
        touchEnabled: !1,
        text: "1MI",
        id: "__alloyId3"
    }), "Label", $.__views.buttonDistance1), $.__views.buttonDistance1.add($.__views.__alloyId3), $.__views.buttonDistance5 = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: "5dp",
        id: "buttonDistance5",
        index: "1"
    }), "View", $.__views.buttonGroupDistance), $.__views.buttonGroupDistance.add($.__views.buttonDistance5), $.__views.__alloyId4 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        textAlign: "center",
        touchEnabled: !1,
        text: "5MI",
        id: "__alloyId4"
    }), "Label", $.__views.buttonDistance5), $.__views.buttonDistance5.add($.__views.__alloyId4), $.__views.buttonDistance10 = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: "5dp",
        id: "buttonDistance10",
        index: "2"
    }), "View", $.__views.buttonGroupDistance), $.__views.buttonGroupDistance.add($.__views.buttonDistance10), $.__views.__alloyId5 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#00CC00",
        textAlign: "center",
        touchEnabled: !1,
        text: "10MI",
        id: "__alloyId5"
    }), "Label", $.__views.buttonDistance10), $.__views.buttonDistance10.add($.__views.__alloyId5), $.__views.buttonGroupAction = A$(Ti.UI.createView({
        height: "40dp",
        top: "20dp",
        left: "20dp",
        right: "20dp",
        id: "buttonGroupAction"
    }), "View", $.__views.wrapper), $.__views.wrapper.add($.__views.buttonGroupAction), $.__views.buttonMark = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "90dp",
        top: 0,
        left: 0,
        id: "buttonMark"
    }), "View", $.__views.buttonGroupAction), $.__views.buttonGroupAction.add($.__views.buttonMark), $.__views.__alloyId6 = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#FFF",
        textAlign: "center",
        touchEnabled: !1,
        text: "MARK",
        id: "__alloyId6"
    }), "Label", $.__views.buttonMark), $.__views.buttonMark.add($.__views.__alloyId6), $.__views.buttonGPS = A$(Ti.UI.createView({
        backgroundImage: "/images/button.png",
        height: "40dp",
        width: "185dp",
        top: 0,
        right: 0,
        touchEnabled: !1,
        id: "buttonGPS"
    }), "View", $.__views.buttonGroupAction), $.__views.buttonGroupAction.add($.__views.buttonGPS), $.__views.buttonGPSLabel = A$(Ti.UI.createLabel({
        width: Ti.UI.FILL,
        height: "40dp",
        top: 0,
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        color: "#555",
        textAlign: "center",
        touchEnabled: !1,
        id: "buttonGPSLabel",
        text: "ADD TO GPS"
    }), "Label", $.__views.buttonGPS), $.__views.buttonGPS.add($.__views.buttonGPSLabel), _.extend($, $.__views);
    var APP = require("core"), NAVIBRIDGE = require("ti.navibridge/ti.navibridge"), GEO = require("geo");
    $.currentLocation = {
        latitude: null,
        longitude: null,
        bearing: 320
    }, $.savedLocation = {
        latitude: null,
        longitude: null,
        bearing: null
    }, $.selectedOptions = {
        precision: null,
        distance: null
    }, NAVIBRIDGE.setApplicationId("ICiAV4Ay"), Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST, Ti.Geolocation.distanceFilter = 100, Ti.Geolocation.headingFilter = 2, Ti.Geolocation.purpose = "Geolocation", $.updateUserLocation = function() {
        $.currentCoordinates.text = Math.round($.currentLocation.latitude * 1e3) / 1e3 + ", " + Math.round($.currentLocation.longitude * 1e3) / 1e3, $.currentBearing.text = $.currentLocation.bearing + "°";
    }, $.locationObserver = function(_event) {
        $.currentLocation.latitude = _event.coords.latitude, $.currentLocation.longitude = _event.coords.longitude, $.updateUserLocation();
    }, $.bearingObserver = function(_event) {
        $.currentLocation.bearing = _event.heading.trueHeading, $.updateUserLocation();
    }, $.addEventHandlers = function() {
        var buttonsPrecision = [ $.buttonPrecisionLow, $.buttonPrecisionMedium, $.buttonPrecisionHigh ], buttonsDistance = [ $.buttonDistance1, $.buttonDistance5, $.buttonDistance10 ];
        for (var i = 0; i < buttonsPrecision.length; i++) buttonsPrecision[i].addEventListener("click", $.handlePrecisionClick);
        for (var i = 0; i < buttonsDistance.length; i++) buttonsDistance[i].addEventListener("click", $.handleDistanceClick);
    }, $.clearButtons = function() {
        var buttonsPrecision = [ $.buttonPrecisionLow, $.buttonPrecisionMedium, $.buttonPrecisionHigh ], buttonsDistance = [ $.buttonDistance1, $.buttonDistance5, $.buttonDistance10 ];
        for (var i = 0; i < buttonsPrecision.length; i++) buttonsPrecision[i].backgroundImage = "/images/button.png";
        for (var i = 0; i < buttonsDistance.length; i++) buttonsDistance[i].backgroundImage = "/images/button.png";
    }, $.handlePrecisionClick = function(_event) {
        if (typeof _event.source.index != "undefined") {
            $.toggleGPSButton(!1);
            var buttons = [ $.buttonPrecisionLow, $.buttonPrecisionMedium, $.buttonPrecisionHigh ];
            $.selectedOptions.precision = _event.source.index;
            for (var i = 0; i < buttons.length; i++) i == _event.source.index ? buttons[i].backgroundImage = "/images/buttonActive.png" : buttons[i].backgroundImage = "/images/button.png";
        }
    }, $.handleDistanceClick = function(_event) {
        if (typeof _event.source.index != "undefined") {
            $.toggleGPSButton(!1);
            var buttons = [ $.buttonDistance1, $.buttonDistance5, $.buttonDistance10 ];
            switch (_event.source.index) {
              case "0":
                $.selectedOptions.distance = 1;
                break;
              case "1":
                $.selectedOptions.distance = 5;
                break;
              case "2":
                $.selectedOptions.distance = 10;
            }
            for (var i = 0; i < buttons.length; i++) i == _event.source.index ? buttons[i].backgroundImage = "/images/buttonActive.png" : buttons[i].backgroundImage = "/images/button.png";
        }
    }, $.markLocation = function(_event) {
        var db = Ti.Database.open("SARA");
        db.execute("INSERT INTO marks VALUES(" + $.currentLocation.latitude + ", " + $.currentLocation.longitude + ", " + $.currentLocation.bearing + ", " + (new Date).getTime() / 1e3 + ", " + $.selectedOptions.precision + ");"), db.close(), $.savedLocation = {
            latitude: $.currentLocation.latitude,
            longitude: $.currentLocation.longitude,
            bearing: $.currentLocation.bearing
        }, $.determineDestination(), $.clearButtons(), $.toggleGPSButton(!0), setTimeout(function() {
            $.currentLocation.bearing = 355;
        }, 1e3);
    }, $.toggleGPSButton = function(_state) {
        _state ? ($.buttonGPS.touchEnabled = !0, $.buttonGPSLabel.color = "#FFF") : ($.buttonGPS.touchEnabled = !1, $.buttonGPSLabel.color = "#555");
    }, $.addToGPS = function(_event) {
        Ti.API.info($.savedLocation.bearing);
        var waypoint = GEO.destinationPoint($.savedLocation, $.selectedOptions.distance);
        $.toggleGPSButton(!1), Ti.API.info(waypoint.latitude + ", " + waypoint.longitude), NAVIBRIDGE.addPOI({
            lat: waypoint.latitude,
            lon: waypoint.longitude
        }), NAVIBRIDGE.addMultiPOI({
            poi: [ {
                lat: waypoint.latitude,
                lon: waypoint.longitude
            }, {
                lat: waypoint.latitude,
                lon: waypoint.longitude
            } ]
        });
    }, $.determineDestination = function() {
        var db = Ti.Database.open("SARA"), rowCount = db.execute("SELECT timestamp FROM marks;").rowCount;
        if (rowCount > 1) {
            var alert = Ti.UI.createAlertDialog({
                title: "Position Determined",
                message: "Would you like to load the calculated ELT position into your GPS unit?",
                cancel: 1,
                buttonNames: [ "Yes", "Cancel" ]
            });
            alert.addEventListener("click", function(_event) {
                if (_event.index == 0) {
                    var db = Ti.Database.open("SARA"), data = db.execute("SELECT * FROM marks ORDER BY timestamp DESC LIMIT 2;"), temp = [];
                    while (data.isValidRow()) temp.push({
                        latitude: data.fieldByName("latitude"),
                        longitude: data.fieldByName("longitude"),
                        bearing: data.fieldByName("bearing")
                    }), data.next();
                    data.close();
                    var waypoint = GEO.intersection(temp[0], temp[1]);
                    Ti.API.info("ELT: " + waypoint.latitude + ", " + waypoint.longitude), NAVIBRIDGE.addPOI({
                        lat: waypoint.latitude,
                        lon: waypoint.longitude
                    });
                }
            }), alert.show();
        }
        db.close();
    }, Ti.Geolocation.addEventListener("location", $.locationObserver), Ti.Geolocation.addEventListener("heading", $.bearingObserver), $.buttonMark.addEventListener("click", $.markLocation), $.buttonGPS.addEventListener("click", $.addToGPS), $.addEventHandlers(), _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A;

module.exports = Controller;