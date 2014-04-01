/*
 * COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
 * these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
 * application programs conforming to the application programming interface for the operating platform for which the sample code is written.
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
 * EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
 * IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.
 */
//display the position to the user
function displayPosition(pos) {
	$('div.longitude').text('Longitude: ' + pos.coords.longitude);
	$('div.latitude').text('Latitude: ' + pos.coords.latitude);
	$('div.timestamp').text('Timestamp: ' + new Date(pos.timestamp));
}

function alertOnGeoAcquisitionErr(geoErr) {
	window.alert('Error acquiring geo (' + geoErr.code + '): ' + geoErr.message);
}


function getFirstPositionAndTrack() {
	window.alert('Click OK to proceed to acquire starting position');

	// use GPS to get the user's location
	var geoPolicy = WL.Device.Geo.Profiles.LiveTracking();
	geoPolicy.timeout = 60000; // set timeout to 1 minute
	geoPolicy.maximumAge = 10000; // allow to use a position that is 10 seconds old
	
	// note: to see at high-accuracy, change RoughTracking above to LiveTracking
	
	// get the user's current position
	WL.Device.Geo.acquirePosition(
			function(pos) {
				// when we receive the position, we display it and start on-going acquisition
				displayPosition(pos);
				
				
				var triggers = {
					Geo: {
						posChange: { // display all movement
							type: "PositionChange",
							callback: function(deviceContext) {
									displayPosition(deviceContext.Geo);
								}
						},
						
						leftArea: { // alert when we have left the area
							type: "Exit",
							circle: {
								longitude: pos.coords.longitude,
								latitude: pos.coords.latitude,
								radius: 200
							},
							callback: function() {
								
								//invoke the adapter
								 var invocationData = {
								            adapter : 'CaptureLocation',
								            procedure : 'getAccountTransactions1',
								            parameters : []
								        };

								    WL.Client.invokeProcedure(invocationData,{
								        onSuccess : function showResponse(response){
								        	window.alert('I have persisted the data to database::::');
								        	},
								        onFailure : function GetUserRIDFailure(response){
								        	window.alert('Sorry Master, I failed!!!!');
								        	},
								    });

								window.alert('Left the area');
							}
						},
						
						dwellArea: { // alert when we have stayed in the vicinity for 3 seconds
							type: "DwellInside",
							circle: {
								longitude: pos.coords.longitude,
								latitude: pos.coords.latitude,
								radius: 50
							},
							dwellingTime: 3000,
							callback: function() {
								window.alert('Still in the vicinity');
							}
						}
					}	
				};
				
				WL.Device.startAcquisition({ Geo: geoPolicy }, triggers, { Geo: alertOnGeoAcquisitionErr } );
			},
			function(geoErr) {
				alertOnGeoAcquisitionErr(geoErr);
				// try again:
				getFirstPositionAndTrack();
			},
			geoPolicy
		); 
}

function wlCommonInit(){

	/*
	 * Application is started in offline mode as defined by a connectOnStartup property in initOptions.js file.
	 * In order to begin communicating with Worklight Server you need to either:
	 * 
	 * 1. Change connectOnStartup property in initOptions.js to true. 
	 *    This will make Worklight framework automatically attempt to connect to Worklight Server as a part of application start-up.
	 *    Keep in mind - this may increase application start-up time.
	 *    
	 * 2. Use WL.Client.connect() API once connectivity to a Worklight Server is required. 
	 *    This API needs to be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 *    Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */	
	// Common initialization code goes here
	
	//console.log('Checking if it reaches here!!!!!!!');
	
	//google.maps.event.addDomListener(window, 'load', initialize);
	
	initialize();
	
	

}

function initialize(){
	
	initilizeStartupData();
	
	initializeMap();
	
	totalCompatibility = mineCompatibiltyResults();
}


function initializeMap(){
	
	
	//This is AllenTown
	var latLang = new google.maps.LatLng(40.635477, -75.500488); 
    var mapOptions = { 
        center: latLang, 
        zoom: 7, 
        mapTypeId: google.maps.MapTypeId.ROADMAP 
    }; 
    mapLoc = new google.maps.Map(document.getElementById("map"), mapOptions);  	
   
}




/**
 * This is were the JSON store is created
 */
function initilizeStartupData(){}


function mineCompatibiltyResults(){
	
    var temp;
    var compatibilityResults;
	require(["dojo/json"], function(JSON){	
	
	compatibilityResults ={"commonLocations" : [
			                     //This is Allentown
			                     {"lat": "40.635477", "long": "-75.500488"},
			                     //This is New York , Star Bucks
			                     {"lat": "40.710927", "long": "-74.009858"},
			                     //This is Philadelphia Museum of Art
			                     {"lat": "39.965572", "long": "-75.182177"}
			                     ],
		    "commonInterests" :  [],		    
		    "commonProfessional" : []
		};
	
		
		/*
		//This is Allentown
        {"lat": 40.635477, "long": -75.500488},
        //This is New York , Star Bucks
        {"lat": 40.710927, "long": -74.009858},
        //This is Philadelphia Museum of Art
        {"lat": 39.965572, "long": -75.182177}*/
		//temp = JSON.parse('{"commonLocations" : [{"lat": "40.635477", "long": "-75.500488"},{"lat": "40.710927", "long": "-74.009858"},{"lat": "39.965572", "long": "-75.182177"}],"commonInterests" : [],"commonProfessional":[]}');
		 
		temp = JSON.parse(JSON.stringify(compatibilityResults));
		  //return temp;
		});
	
	return temp;
}