/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2012            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Geo = {};

/**
 * Returns the point of intersection of two paths defined by point and bearing (see http://williams.best.vwh.net/avform.htm#Intersection)
 * @param   {Object} pointA: First point {latitude, longitude, bearing}
 * @param   {Object} pointB: Second point {latitude, longitude, bearing}
 * @returns {Object} Destination point {latitude, longitude} (null if no unique intersection defined)
 */
Geo.intersection = function(pointA, pointB) {
	pointA.latitude = typeof(pointA.latitude) == "number" ? pointA.latitude : typeof(pointA.latitude) == "string" && pointA.latitude.trim() != "" ? +pointA.latitude : NaN;
	pointB.latitude = typeof(pointB.latitude) == "number" ? pointB.latitude : typeof(pointB.latitude) == "string" && pointB.latitude.trim() != "" ? +pointB.latitude : NaN;
	pointA.longitude = typeof(pointA.longitude) == "number" ? pointA.longitude : typeof(pointA.longitude) == "string" && pointA.longitude.trim() != "" ? +pointA.longitude : NaN;
	pointB.longitude = typeof(pointB.longitude) == "number" ? pointB.longitude : typeof(pointB.longitude) == "string" && pointB.longitude.trim() != "" ? +pointB.longitude : NaN;
	pointA.bearing = typeof pointA.bearing == "number" ? pointA.bearing : typeof pointA.bearing == "string" && pointA.bearing.trim() != "" ? +pointA.bearing : NaN;
	pointB.bearing = typeof pointB.bearing == "number" ? pointB.bearing : typeof pointB.bearing == "string" && pointB.bearing.trim() != "" ? +pointB.bearing : NaN;
	
	lat1 = pointA.latitude.toRad(), lon1 = pointA.longitude.toRad();
	lat2 = pointB.latitude.toRad(), lon2 = pointB.longitude.toRad();
	
	pointA.bearing3 = pointA.bearing.toRad(), pointB.bearing3 = pointB.bearing.toRad();
	dLat = lat2 - lat1, dLon = lon2 - lon1;
	dist12 = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)));
	
	if(dist12 == 0) {
		 return null;
	}
	
	brngA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) / (Math.sin(dist12) * Math.cos(lat1)));
	
	if(isNaN(brngA)) {
		 brngA = 0;
	}
	
	brngB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) / (Math.sin(dist12) * Math.cos(lat2)));
	
	if(Math.sin(lon2 - lon1) > 0) {
		pointA.bearing2 = brngA;
		pointB.bearing1 = 2 * Math.PI - brngB;
	} else {
		pointA.bearing2 = 2 * Math.PI - brngA;
		pointB.bearing1 = brngB;
	}
	
	alpha1 = (pointA.bearing3 - pointA.bearing2 + Math.PI) % (2 * Math.PI) - Math.PI;
	alpha2 = (pointB.bearing1 - pointB.bearing3 + Math.PI) % (2 * Math.PI) - Math.PI;
	
	if(Math.sin(alpha1) == 0 && Math.sin(alpha2) == 0) {
		// infinite intersections
		return null;
	}
	
	if(Math.sin(alpha1) * Math.sin(alpha2) < 0) {
		// ambiguous intersection
		return null;
	}
	
	alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) + Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
	dist13 = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2), Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3));
	lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) + Math.cos(lat1) * Math.sin(dist13) * Math.cos(pointA.bearing3));
	dLon13 = Math.atan2(Math.sin(pointA.bearing3) * Math.sin(dist13) * Math.cos(lat1), Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
	
	lon3 = lon1 + dLon13;
	lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
	
	return {
		latitude: lat3.toDeg(),
		longitude: lon3.toDeg()
	};
};

/**
 * Returns the destination point from this point having travelled the given distance (in km) on the 
 * given initial bearing (bearing may vary before destination is reached) (see http://williams.best.vwh.net/avform.htm#LL)
 * @param   {Number} pointA.bearing: Initial bearing in degrees
 * @param   {Number} distance: distance in km
 * @returns {LatLon} Destination point
 */
Geo.destinationPoint = function(pointA, distance) {
	pointA.latitude = typeof(pointA.latitude) == "number" ? pointA.latitude : typeof(pointA.latitude) == "string" && pointA.latitude.trim() != "" ? +pointA.latitude : NaN;
	pointA.longitude = typeof(pointA.longitude) == "number" ? pointA.longitude : typeof(pointA.longitude) == "string" && pointA.longitude.trim() != "" ? +pointA.longitude : NaN;
	
	distance = typeof(distance) == "number" ? distance : typeof(distance) == "string" && distance.trim() != "" ? +distance : NaN;
	distance = (distance * 1.609344) / 6371;
	
	pointA.bearing = pointA.bearing.toRad();
	
	var lat1 = pointA.latitude.toRad(),
		lon1 = pointA.longitude.toRad();
		
	var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance) + Math.cos(lat1) * Math.sin(distance) * Math.cos(pointA.bearing));
	var lon2 = lon1 + Math.atan2(Math.sin(pointA.bearing) * Math.sin(distance) * Math.cos(lat1), Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2));
	
	lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
	
	return {
		latitude: lat2.toDeg(),
		longitude: lon2.toDeg()
	};
};

// Converts numeric degrees to radians
if(typeof Number.prototype.toRad == "undefined") {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
}

// Converts radians to numeric (signed) degrees
if(typeof Number.prototype.toDeg == "undefined") {
	Number.prototype.toDeg = function() {
		return this * 180 / Math.PI;
	}
}

// Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript)
if(typeof String.prototype.trim == "undefined") {
	String.prototype.trim = function() {
		return String(this).replace(/^\s\s*/, "").replace(/\s\s*$/, "");
	}
}

module.exports = Geo;