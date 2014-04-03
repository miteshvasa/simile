// Dojo Mobile tutorial | Flickrview | Part III
define([
	"dojo/_base/declare",
	"dojox/mobile/ScrollableView",
	"dijit/registry",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/date/locale",
	"dojo/dom-class",
	"dojox/mobile/ProgressIndicator",
	"dojo/request/script",
	"dojox/mobile/ListItem",
	"dojox/geo/openlayers/Map",
	"dojo/dom",
	"dojo/query",
	 "dojo/NodeList-dom",
	 "dojo/_base/array",
	 "dojox/mobile/parser"
], function(declare, ScrollableView, registry, lang, array, locale, domClass, ProgressIndicator, scriptRequest, ListItem, map, dom, query, array){

	return declare([ScrollableView], {
		refreshButton: null,
		map: null,
		commonHeading: null,
		progressIndicator: null,
		commonPlacesLatLong : [],
		// Create a template string for a photo ListItem
		flickrviewItemTemplateString:
			'<img src="${photo}" width="80px" height="80px" alt="${title}" style="float:left;"/>' +
			'<div class="photoSummary">' +
				'<div class="photoTitle">${title}</div>' +
				'<div class="publishedTime">${published}</div>' +
				'<div class="author troncatedText">${author}</div>' +
			'</div><div class="summaryClear"></div>',

		// Flickr public feed URL to pull recent photo uploads from
		requestUrl: "http://api.flickr.com/services/feeds/photos_public.gne",
		// JSONP request options and query parameters
		requestOptions: {
			jsonp: "jsoncallback",
			preventCache: true,
			timeout: 10000,
			query: null
		},
		// init variables and handlers
		startup: function() {
			this.inherited(arguments);

			// retain widgets references
			//this.refreshButton = registry.byId("refreshButton");
			this.map = dom.byId("map");
			this.commonHeading = registry.byId("mapCommonHeading");

			this.progressIndicator = ProgressIndicator.getInstance();

			// add click handler to the button that call refresh
			this.refresh();
			
			
			//also load the personal preferences column
			this.commonHeading = registry.byId("mapCommonHeading");

			//the icons in the sub heading are not coming properly
			//query(".mblTabBarButtonIconArea").style({ width:"100% !important"});
			//query(".mblToolBarButtonIcon").style({ 'padding-left':"0px"});
			
			//this.refreshButton.on("click", lang.hitch(this, this.refresh) );
		},
		// refresh view with content from Flickr
		refresh: function() {
			this.commonHeading.set('label',"Finding...");
			//console.log('The map is:::::'+ this.map);
			this.map.appendChild(this.progressIndicator.domNode);
			this.progressIndicator.start();
			
			//console.log('Is the result available here??????:::::'+ totalCompatibility);
			
			//call the get location details adapter here in a for loop
			if(totalCompatibility){
				
				//var arrOfLatLong = [{},{},{}];
				
				for (var i = 0; i< totalCompatibility.commonLocations.length; i++)
				{
					this.getCommonPlaceLatLong(totalCompatibility.commonLocations[i]);
				}
			}
			
			// request feed from Flickr
			this.requestOptions.query = flickrview.QUERY;
			scriptRequest.get(this.requestUrl, this.requestOptions).then(lang.hitch(this, this.onResponse), lang.hitch(this, this.onError));
		},
		// error handler
		onError: function(error) {

		},

		
		
		getCommonPlaceLatLong : function(latlong){
			var latLong = latlong.lat + ","+  latlong.long;
			
			var invocationData = {
                    adapter : 'GetLocationDetails',
                    procedure : 'getLocationDetails',
                    parameters : [latLong]
                    };

            //console.log("+++about to invoke procedure+++"+ JSON.stringify(invocationData)); 
            WL.Client.invokeProcedure(invocationData,{
                onSuccess : lang.hitch(this, this.gMapLatLngSuccess),
                onFailure : lang.hitch(this,this.gMapLatLngFailure)
            });
		},
		
		gMapLatLngSuccess : function(result){
			//var resultTemp = JSON.stringify(result);
			
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// restore the title
			this.commonHeading.set('label','Common Traits');			

			var resultInClazz;
			
			require(["dojo/json"], function(JSON){
				
				resultInClazz = JSON.parse(JSON.stringify(result));
			});
			
			var lat = parseFloat(resultInClazz.invocationResult.results[0].geometry.location.lat);
			var long = parseFloat(resultInClazz.invocationResult.results[0].geometry.location.lng);
			
			console.log('The lat is:::'+ lat);
			console.log('The long is:::'+ long);
			
			var latLong = new google.maps.LatLng(lat,long); 
			
			//var latLong = new google.maps.LatLng(40.635477, -75.500488);
			
			//add a marker to the map
			var marker = new google.maps.Marker({
		        position: latLong,
		        map: mapLoc,
		        title:resultInClazz.invocationResult.results[0].name    
		     });
			
			

			  var infowindow = new google.maps.InfoWindow({
			      content: 'Starbucks@Default Street',
			      maxWidth: '100px'
			  });
			 

			 google.maps.event.addListener(marker, 'click', function() {
			 					var contentStr = resultInClazz.invocationResult.results[0].name;
			                  infowindow.setContent(contentStr);
			                  infowindow.open(mapLoc, marker);
			     });	
			
			
			
			console.log('The success is::::::'+ resultInClazz.invocationResult.results[0].name);
			
		},
		
		gMapLatLngFailure : function(result,latlong){
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// display error message
			this.commonHeading.set('label',error);
			alert(error);
		},
		// Pushes data into a template - primitive
		substitute: function(template,obj) {
			return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
				return obj[key];
			});
		}
	});
});
