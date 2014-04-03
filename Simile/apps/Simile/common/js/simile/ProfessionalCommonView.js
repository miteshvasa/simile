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
	 "dojo/dom-construct"
], function(declare, ScrollableView, registry, lang, array, locale, domClass, ProgressIndicator, scriptRequest, ListItem, map, dom, query, domConstruct){

	return declare([ScrollableView], {
		refreshButton: null,
		professionalCommon: null,
		professionalCommonHeading: null,
		progressIndicator: null,
		startup: function() {
			this.inherited(arguments);

			// retain widgets references
			//this.refreshButton = registry.byId("refreshButton");
			this.professionalCommon = dom.byId("professionalCommon");
			this.professionalCommonHeading = registry.byId("professionalCommonHeading");

			this.progressIndicator = ProgressIndicator.getInstance();

			// add click handler to the button that call refresh
			lang.hitch(this,this.refresh());
			
			//the icons in the sub heading are not coming properly
			//query(".mblTabBarButtonIconArea").style({ width:"100% !important"});
			//query(".mblToolBarButtonIcon").style({ 'padding-left':"0px"});
			
			//this.refreshButton.on("click", lang.hitch(this, this.refresh) );
		},
		// refresh view with content from Flickr
		refresh: function() {
			//console.log('The map is:::::'+ this.map);
			this.professionalCommon.appendChild(this.progressIndicator.domNode);
			this.progressIndicator.start();
			
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// restore the title
			this.professionalCommonHeading.set('label','Common Traits');
			
			//var professionalCompatibilty = this.totalCompatibility.commonInterests;
		},
		// error handler
		onError: function(error) {
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// display error message
			this.professionalCommonHeading.set('label',error);
			alert(error);
		},
		//  response handler
		onResponse: function(result) {
			
			// remove progress indicator
			this.progressIndicator.stop();
			//this.feedList.destroyDescendants();
			// restore the title
			this.professionalCommonHeading.set('label','Common Traits');
			
			

			//populate the map
		   // this.mapLoc = new Map("map", {
		     //   baseLayerType : dojox.geo.openlayers.BaseLayerType.GOOGLE
		    //});
		    //this.mapLoc.fitTo([ -160, 70, 160, -70 ]);
			
		}
	});
});
