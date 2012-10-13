// Controller dependencies
var APP = require("core");
var NAVIBRIDGE = require("ti.navibridge/ti.navibridge");
var GEO = require("geo");

// Variables
$.currentLocation = {
	latitude: null,
	longitude: null,
	bearing: null
};

$.waypointLocation = {
	latitude: null,
	longitude: null
};

$.eltLocation = {
	latitude: null,
	longitude: null
};

$.selectedOptions = {
	precision: 0,
	distance: 1
};

$.modalOpen = false;
$.waypointCount = 0;
$.mapInitialized = false;

// Set up NaviBridge library
NAVIBRIDGE.setApplicationId("ICiAV4Ay");

// Geo-location parameters
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 100;
Ti.Geolocation.headingFilter = 2;
Ti.Geolocation.purpose = "Geolocation";

/**
 * Clones an object to fix the pass-by-reference stupidity
 * @param {Object} source The object to clone
 */
function cloneObject(source) {
    for(i in source) {
        if(typeof source[i] == "source") {
            this[i] = new cloneObject(source[i]);
        } else {
            this[i] = source[i];
        }
    }
}

/**
 * Updates the current location on the screen
 */
$.updateUserLocation = function() {
	$.locationCurrentCoordinatesValue.text = (Math.round($.currentLocation.latitude * 1000) / 1000) + ", " + (Math.round($.currentLocation.longitude * 1000) / 1000);
	$.locationCurrentBearingValue.text = $.currentLocation.bearing + "°";
};

/**
 * Global location event handler
 * @param  {Object} _event Standard Ti callback
 */
$.locationObserver = function(_event) {
	$.currentLocation.latitude = _event.coords.latitude;
	$.currentLocation.longitude = _event.coords.longitude;
	
	$.updateUserLocation();
	
	if($.mapInitialized) {
		$.map.setLocation({
			latitude: $.currentLocation.latitude,
			longitude: $.currentLocation.longitude
		});
	} else {
		$.map.setLocation({
			latitude: $.currentLocation.latitude,
			longitude: $.currentLocation.longitude,
			latitudeDelta: 0.3,
			longitudeDelta: 0.3
		});
	}
	
	if($.waypointLocation.latitude !== null) {
		$.locationNextWaypointDistanceValue.text = (Math.round(GEO.distanceBetween($.currentLocation, $.waypointLocation) * 100) / 100) + "MI";
	}
	
	if($.eltLocation.latitude !== null) {
		$.locationELTDistanceValue.text = (Math.round(GEO.distanceBetween($.currentLocation, $.eltLocation) * 100) / 100) + "MI";
	}
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
	
	$.selectedOptions = {
		precision: 0,
		distance: 1
	};
};

/**
 * Handles a click on a precision button
 */
$.handlePrecisionClick = function(_event) {
	if(typeof _event.source.index != "undefined") {
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
 * Handles a click on an annotation
 */
$.handleAnnotationClick = function(_event) {
	if(_event.clicksource === "pin") {
		NAVIBRIDGE.addPOI({
			lat: _event.latitude,
			lon: _event.longitude
		});
	}
};

/**
 * Marks the users position, saves to the DB
 */
$.markLocation = function(_event) {
	// Creates the different points, while fixing the pass-by-reference stupidity
	var points = {
		current: new cloneObject($.currentLocation),
		destination: GEO.destinationPoint(new cloneObject($.currentLocation), $.selectedOptions.distance),
		vector: GEO.destinationPoint(new cloneObject($.currentLocation), 20)
	};
	
	var db = Ti.Database.open("SARA");
	db.execute("INSERT INTO marks VALUES(" + points.current.latitude + ", " + points.current.longitude + ", " + points.current.bearing + ", " + (new Date().getTime() / 1000) + ", " + $.selectedOptions.precision + ");");
	db.close();
	
	var annotationCurrent = Ti.Map.createAnnotation({
		title: "Mark " + ($.waypointCount + 1),
		latitude: points.current.latitude,
		longitude: points.current.longitude,
		subtitle: (Math.round(points.current.latitude * 100000) / 100000) + ", " + (Math.round(points.current.longitude * 100000) / 100000),
		image: "/images/pinStart.png"
	});
	
	var annotationWaypoint = Ti.Map.createAnnotation({
		title: "Waypoint " + ($.waypointCount + 1),
		latitude: points.destination.latitude,
		longitude: points.destination.longitude,
		subtitle: (Math.round(points.destination.latitude * 100000) / 100000) + ", " + (Math.round(points.destination.longitude * 100000) / 100000),
		image: "/images/pinWaypoint.png"
	});
	
	var vectorRoute = {
		color: "#00FF00",
		name: "Vector " + ($.waypointCount + 1),
		width: "3dp",
		points: [ points.current, points.vector ]
	};
	
	$.map.addAnnotations([ annotationCurrent, annotationWaypoint ]);
	$.map.addRoute(vectorRoute);
	
	$.locationNextWaypointCoordinatesValue.text = (Math.round(points.destination.latitude * 1000) / 1000) + ", " + (Math.round(points.destination.longitude * 1000) / 1000);
	$.locationNextWaypointDistanceValue.text = (Math.round(GEO.distanceBetween(points.current, points.destination) * 100) / 100) + "MI";
	
	$.waypointLocation = {
		latitude: points.destination.latitude,
		longitude: points.destination.longitude
	};
	
	NAVIBRIDGE.addPOI({
		lat: points.destination.latitude,
		lon: points.destination.longitude
	});
	
	$.clearButtons();
	$.toggleMeasurementModal();
	
	$.waypointCount++;
	
	$.determineELT();
	
	// TODO: REMOVE! We're faking it!
	$.fakeIt();
};

/**
 * Determines where the ELT is
 */
$.determineELT = function() {
	var db = Ti.Database.open("SARA");
	
	var rowCount = db.execute("SELECT timestamp FROM marks;").rowCount;
	
	if(rowCount > 1) {
		// We have enough data to calcaulte!
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
		
		var annotationELT = Ti.Map.createAnnotation({
			title: "ELT Location",
			latitude: waypoint.latitude,
			longitude: waypoint.longitude,
			subtitle: (Math.round(waypoint.latitude * 100000) / 100000) + ", " + (Math.round(waypoint.longitude * 100000) / 100000),
			image: "/images/pinELT.png"
		});
		
		$.map.addAnnotation(annotationELT);
		
		$.map.setLocation({
			latitude: waypoint.latitude,
			longitude: waypoint.longitude,
			latitudeDelta: 0.1,
			longitudeDelta: 0.1
		});
		
		$.locationELTCoordinatesValue.text = (Math.round(waypoint.latitude * 1000) / 1000) + ", " + (Math.round(waypoint.longitude * 1000) / 1000);
		$.locationELTDistanceValue.text = (Math.round(GEO.distanceBetween($.currentLocation, waypoint) * 100) / 100) + "MI";
		
		$.locationWrapper.scrollToView(2);
		
		var alert = Ti.UI.createAlertDialog({
			title: "ELT Located",
			message: "The location of the ELT has been determined",
			ok: "Continue"
		});
		
		alert.show();
		
		$.eltLocation = {
			latitude: waypoint.latitude,
			longitude: waypoint.longitude
		};
		
		NAVIBRIDGE.addPOI({
			lat: waypoint.latitude,
			lon: waypoint.longitude
		});
	}
	
	db.close();
};

/**
 * Opens the measurement modal
 */
$.toggleMeasurementModal = function(_event) {
	if($.modalOpen) {
		// Close modal
		var animationModal = Ti.UI.createAnimation({
			duration: 500,
			right: "-250dp"
		});
		
		var animationMap = Ti.UI.createAnimation({
			duration: 500,
			left: "0dp"
		});
		
		animationModal.addEventListener("complete", function(_event) {
			$.modalAddMeasurement.right = "-250dp";
		});
		
		animationMap.addEventListener("complete", function(_event) {
			$.map.left = "0dp";
		});
		
		$.modalAddMeasurement.animate(animationModal);
		$.map.animate(animationMap);
		
		$.modalOpen = false;
	} else {
		// Open modal
		var animationModal = Ti.UI.createAnimation({
			duration: 500,
			right: "0dp"
		});
		
		var animationMap = Ti.UI.createAnimation({
			duration: 500,
			left: "-250dp"
		});
		
		animationModal.addEventListener("complete", function(_event) {
			$.modalAddMeasurement.right = "0dp";
		});
		
		animationMap.addEventListener("complete", function(_event) {
			$.map.left = "-250dp";
		});
		
		$.modalAddMeasurement.animate(animationModal);
		$.map.animate(animationMap);
		
		$.modalOpen = true;
	}
};

// Add event listeners
$.buttonAddMeasurement.addEventListener("click", $.toggleMeasurementModal);
$.buttonMark.addEventListener("click", $.markLocation);
$.map.addEventListener("click", $.handleAnnotationClick);

// Kick off the script
$.addEventHandlers();











// FAKE IT!
// TEMPORARY DATA
// This is necessary because it's hard to demo driving 10 miles!
// TODO: Remove!
$.map.userLocation = false;

$.fakeLocations = [
	{
		latitude: "28.175475",
		longitude: "-80.661",
		bearing: 320
	},
	{
		latitude: "28.265044",
		longitude: "-80.782353",
		bearing: 355
	},
	{
		latitude: "28.307135097263988",
		longitude: "-80.78653566982092",
		bearing: 360
	}
];

$.fakeItIndex = 0;

$.fakeIt = function() {
	$.bearingObserver({ heading: { trueHeading: $.fakeLocations[$.fakeItIndex].bearing }});
	$.locationObserver({ coords: { latitude: $.fakeLocations[$.fakeItIndex].latitude, longitude: $.fakeLocations[$.fakeItIndex].longitude }});
	
	if($.fakeItIndex == 2) {
		$.fakeItIndex = 0;	
	} else {
		$.fakeItIndex++;
	}
};

$.fakeIt();