/*
START:
28.175475
-80.661

NEXT:
28.265044
-80.782353
*/

// Controller dependencies
var APP = require("core");
var NAVIBRIDGE = require("ti.navibridge/ti.navibridge");
var GEO = require("geo");

// Variables
$.currentLocation = {
	latitude: null,
	longitude: null,
	bearing: 320 // @TODO: Set this to null
};

$.savedLocation = {
	latitude: null,
	longitude: null,
	bearing: null
	// @TODO: Do we need distance here?
};

$.selectedOptions = {
	precision: null,
	distance: null
};

// Set up NaviBridge library
NAVIBRIDGE.setApplicationId("ICiAV4Ay");

// Geo-location parameters
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 100;
Ti.Geolocation.headingFilter = 2;
Ti.Geolocation.purpose = "Geolocation";

/**
 * Updates the current location on the screen
 */
$.updateUserLocation = function() {
	$.currentCoordinates.text = (Math.round($.currentLocation.latitude * 1000) / 1000) + ", " + (Math.round($.currentLocation.longitude * 1000) / 1000);
	$.currentBearing.text = $.currentLocation.bearing + "°";
};

/**
 * Global location event handler
 * @param  {Object} _event Standard Ti callback
 */
$.locationObserver = function(_event) {
	$.currentLocation.latitude = _event.coords.latitude;
	$.currentLocation.longitude = _event.coords.longitude;
	
	$.updateUserLocation();
};

/**
 * Global bearing event handler
 * @param  {Object} _event Standard Ti callback
 */
$.bearingObserver = function(_event) {
	$.currentLocation.bearing = _event.heading.trueHeading; // magneticHeading?
	
	$.updateUserLocation();
};

/**
 * Add event handlers to each button
 */
$.addEventHandlers = function() {
	var buttonsPrecision = [ $.buttonPrecisionLow, $.buttonPrecisionMedium, $.buttonPrecisionHigh ];
	var buttonsDistance = [ $.buttonDistance1, $.buttonDistance5, $.buttonDistance10 ];
	
	for(var i = 0; i < buttonsPrecision.length; i++) {
		buttonsPrecision[i].addEventListener("click", $.handlePrecisionClick);
	}
	
	for(var i = 0; i < buttonsDistance.length; i++) {
		buttonsDistance[i].addEventListener("click", $.handleDistanceClick);
	}
};

/**
 * Clears the active state for the buttons
 */
$.clearButtons = function() {
	var buttonsPrecision = [ $.buttonPrecisionLow, $.buttonPrecisionMedium, $.buttonPrecisionHigh ];
	var buttonsDistance = [ $.buttonDistance1, $.buttonDistance5, $.buttonDistance10 ];
		
	for(var i = 0; i < buttonsPrecision.length; i++) {
		buttonsPrecision[i].backgroundImage = "/images/button.png";
	}
		
	for(var i = 0; i < buttonsDistance.length; i++) {
		buttonsDistance[i].backgroundImage = "/images/button.png";
	}
};

/**
 * Handles a click on a precision button
 */
$.handlePrecisionClick = function(_event) {
	if(typeof _event.source.index != "undefined") {
		$.toggleGPSButton(false);
		
		var buttons = [ $.buttonPrecisionLow, $.buttonPrecisionMedium, $.buttonPrecisionHigh ];
		
		$.selectedOptions.precision = _event.source.index;
		
		for(var i = 0; i < buttons.length; i++) {
			if(i == _event.source.index) {
				buttons[i].backgroundImage = "/images/buttonActive.png";
			} else {
				buttons[i].backgroundImage = "/images/button.png";
			}
		}
	}
};

/**
 * Handles a click on a precision button
 */
$.handleDistanceClick = function(_event) {
	if(typeof _event.source.index != "undefined") {
		$.toggleGPSButton(false);
		
		var buttons = [ $.buttonDistance1, $.buttonDistance5, $.buttonDistance10 ];
		
		switch(_event.source.index) {
			case "0":
				$.selectedOptions.distance = 1;
				break;
			case "1":
				$.selectedOptions.distance = 5;
				break;
			case "2":
				$.selectedOptions.distance = 10;
				break;
		}
		
		for(var i = 0; i < buttons.length; i++) {
			if(i == _event.source.index) {
				buttons[i].backgroundImage = "/images/buttonActive.png";
			} else {
				buttons[i].backgroundImage = "/images/button.png";
			}
		}
	}
};

/**
 * Marks the users position, saves to the DB
 */
$.markLocation = function(_event) {
	var db = Ti.Database.open("SARA");
	
	db.execute("INSERT INTO marks VALUES(" + $.currentLocation.latitude + ", " + $.currentLocation.longitude + ", " + $.currentLocation.bearing + ", " + (new Date().getTime() / 1000) + ", " + $.selectedOptions.precision + ");");
	
	db.close();
	
	$.savedLocation = {
		latitude: $.currentLocation.latitude,
		longitude: $.currentLocation.longitude,
		bearing: $.currentLocation.bearing
	};
	
	$.determineDestination();
	
	$.clearButtons();
	$.toggleGPSButton(true);
	
	// TODO: REMOVE!
	setTimeout(function() {
		$.currentLocation.bearing = 355;
	}, 1000);
};

/**
 * Enables / disables the "Add to GPS" button
 */
$.toggleGPSButton = function(_state) {
	if(_state) {
		// Enabled
		$.buttonGPS.touchEnabled = true;
		$.buttonGPSLabel.color = "#FFF";
	} else {
		// Disabled
		$.buttonGPS.touchEnabled = false;
		$.buttonGPSLabel.color = "#555";
	}
};

/**
 * Calculate and add the next waypoint to the GPS
 */
$.addToGPS = function(_event) {
	Ti.API.info($.savedLocation.bearing);
	
	var waypoint = GEO.destinationPoint($.savedLocation, $.selectedOptions.distance);
	
	$.toggleGPSButton(false);
	
	Ti.API.info(waypoint.latitude + ", " + waypoint.longitude);
	
	NAVIBRIDGE.addPOI({
		lat: waypoint.latitude,
		lon: waypoint.longitude
	});
	
	NAVIBRIDGE.addMultiPOI({
		poi: [
			{
				lat: waypoint.latitude,
				lon: waypoint.longitude
			},
			{
				lat: waypoint.latitude,
				lon: waypoint.longitude
			}
		]
	});
};

/**
 * Determines where the ELT is
 */
$.determineDestination = function() {
	var db = Ti.Database.open("SARA");
	
	var rowCount = db.execute("SELECT timestamp FROM marks;").rowCount;
	
	if(rowCount > 1) {
		// We have enough data to calcaulte!
		var alert = Ti.UI.createAlertDialog({
			title: "Position Determined",
			message: "Would you like to load the calculated ELT position into your GPS unit?",
			cancel: 1,
			buttonNames: [ "Yes", "Cancel" ]
		});
		
		alert.addEventListener("click", function(_event) {
			if(_event.index == 0) {
				var db = Ti.Database.open("SARA");
				
				var data = db.execute("SELECT * FROM marks ORDER BY timestamp DESC LIMIT 2;");
				
				var temp = [];
		
				while(data.isValidRow()) {
					// Clean up the data we receive before passing it along
					temp.push({
						latitude: data.fieldByName("latitude"),
						longitude: data.fieldByName("longitude"),
						bearing: data.fieldByName("bearing")
					});
					
					data.next();
				}
				
				data.close();
				
				var waypoint = GEO.intersection(temp[0], temp[1]);
				
				Ti.API.info("ELT: " + waypoint.latitude + ", " + waypoint.longitude);
				
				NAVIBRIDGE.addPOI({
					lat: waypoint.latitude,
					lon: waypoint.longitude
				});
			}
		});
		
		alert.show();
	}
	
	db.close();
};

// Event handlers
Ti.Geolocation.addEventListener("location", $.locationObserver);
Ti.Geolocation.addEventListener("heading", $.bearingObserver);

$.buttonMark.addEventListener("click", $.markLocation);
$.buttonGPS.addEventListener("click", $.addToGPS);

// Kick off the script
$.addEventHandlers();