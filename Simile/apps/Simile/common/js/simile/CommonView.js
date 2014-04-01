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
	 "dojo/NodeList-dom"
], function(declare, ScrollableView, registry, lang, array, locale, domClass, ProgressIndicator, scriptRequest, ListItem, map, dom, query){

	return declare([ScrollableView], {
		refreshButton: null,
		map: null,
		commonHeading: null,
		progressIndicator: null,
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
			this.commonHeading = registry.byId("commonHeading");

			this.progressIndicator = ProgressIndicator.getInstance();

			// add click handler to the button that call refresh
			this.refresh();
			
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
			// request feed from Flickr
			this.requestOptions.query = flickrview.QUERY;
/*			setTimeout(function() {
		        // Call it
		        this.onFlickrResponse('abc');
		    }, 2000);*/
			scriptRequest.get(this.requestUrl, this.requestOptions).then(lang.hitch(this, this.onResponse), lang.hitch(this, this.onError));
		},
		// error handler
		onError: function(error) {
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// display error message
			this.commonHeading.set('label',error);
			alert(error);
		},
		//  response handler
		onResponse: function(result) {
			
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// restore the title
			this.commonHeading.set('label','Common Traits');
			
			

			//populate the map
		   // this.mapLoc = new Map("map", {
		     //   baseLayerType : dojox.geo.openlayers.BaseLayerType.GOOGLE
		    //});
		    //this.mapLoc.fitTo([ -160, 70, 160, -70 ]);
			
		},
		// Pushes data into a template - primitive
		substitute: function(template,obj) {
			return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
				return obj[key];
			});
		}
	});
});
