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
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom",
	"dojo/query",
	 "dojo/NodeList-dom"	
], function(declare, ScrollableView, registry, lang, array, locale, domClass, ProgressIndicator, scriptRequest, ListItem, domConstruct, domStyle, dom, query){

	return declare([ScrollableView], {
		mobileSearchForm: null,
		mobileBody: null,
		mobileSearchHeading: null,
		mobileSearchButton: null,
		progressIndicator: null,
		//detailsContainer:null,
		//detailsHeading:null,
		// Create a template string for a photo ListItem
		
		
		/*
		 <div data-dojo-type="dojox/mobile/FormLayout" data-dojo-props="columns:'two'">
			<div>
				<label for="orderNo">Enter Order No</label>
				<fieldset>
					<input type="text" id="orderNo" data-dojo-type="dojox/mobile/TextBox" data-dojo-props="value:''">
				</fieldset>
			</div>			
		</div>
		 */
		flickrviewItemTemplateString:			
			'<div>Hello ${name}</div>',
			/*'<div data-dojo-type="dojox/mobile/FormLayout" data-dojo-props="columns:\x27two\x27>' +
				'<div>'+
				'<label for=\x22orderNo\x22>Order No</label>' +
				'<fieldset>' + 
				'<input type="text" id="orderNo" data-dojo-type="dojox/mobile/TextBox" data-dojo-props="value:\x27\x27">' + 
				'</fieldset>' +
				'</div>' +
			'</div>',*/

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
			this.mobileSearchForm = registry.byId("mobileSearchView");
			this.mobileSearchHeading = registry.byId("mobileSearchHeading");
			this.mobileBody = dom.byId("mobileBody");
			//this.detailsContainer = registry.byId("detailsContainer");
			//this.detailsHeading = registry.byId("detailsHeading");
			this.mobileSearchButton = registry.byId("mobileSearchButton");

			this.progressIndicator = ProgressIndicator.getInstance();
			
			//query(".mblToolBarButtonIcon").style({ 'padding-left':"0px"});			
		},
		// refresh view with content from Flickr
		refresh: function() {
			// remove all list items
			//this.mobileSearchForm.destroyDescendants();
			// reset scroll to make sur progress indicator is visible
			this.scrollTo({x:0,y:0});
			// add progress indicator
			this.mobileSearchHeading.set('label',"Logging...");
			this.mobileSearchForm.domNode.appendChild(this.progressIndicator.domNode);
			this.progressIndicator.start();
			
			//This will to call to get data from Social sites will happen here
			// request feed from Flickr
			this.requestOptions.query = flickrview.QUERY;
			scriptRequest.get(this.requestUrl, this.requestOptions).then(lang.hitch(this, this.onFlickrResponse), lang.hitch(this, this.onFlickrError));
		},
		// error handler
		onFlickrError: function(error) {
			// remove progress indicator
			this.progressIndicator.stop();
			//this.mobileSearchForm.destroyDescendants();
			// display error message
			this.mobileSearchHeading.set('label',error);
			alert(error);
		},
		//  response handler
		onFlickrResponse: function(result) {
			// remove progress indicator
			this.progressIndicator.stop();
			//this.mobileSearchForm.destroyDescendants();
			// restore the title
			this.mobileSearchHeading.set('label','');
			
			domStyle.set(this.mobileSearchForm.domNode, "visibility", "visible");
			
/*			domConstruct.place(this.substitute(this.flickrviewItemTemplateString, {
				name: 'Mukesh',
			}),this.mobileSearchForm.domNode, "first");*/
			

			this.mobileSearchButton.onClick = lang.hitch(this, function(){
				this.performTransition("mapCommonView");
				registry.byId("mapCommonView").refresh();
			});
			
			//this.performTransition("orderContainer");
			// populate the list
			/*array.forEach(result.items, lang.hitch(this, function (resultItem) {
				// Create a new ListItem at the end of the list
				var listItem = new ListItem({}).placeAt(this.mobileSearchForm, "last");
				// set custom style
				domClass.add(listItem.domNode, "photoListItem");
				// create and insert content from template and JSON response
				listItem.containerNode.innerHTML = this.substitute(this.flickrviewItemTemplateString, {
					photo: resultItem.media.m,
					title: resultItem.title,
					published: locale.format(new Date(resultItem.published), {locale:flickrview.QUERY.lang}),
					author: resultItem.author
				});
				listItem.onClick = lang.hitch(this, function(){
					// update details view before transitioning to it
					this.detailsContainer.domNode.innerHTML = resultItem.description.replace(/href=/ig,"target=\"_blank\" href=");
					listItem.set("transition","slide");
					listItem.transitionTo("details");
				});
				listItem.set("moveTo","#");
			}));*/
		},
		// Pushes data into a template - primitive
		substitute: function(template,obj) {
			return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
				return obj[key];
			});
		}
	});
});
