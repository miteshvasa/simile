define([
	"dojo/_base/declare",
	"dojox/mobile/ScrollableView",
	"dijit/registry",
	"dojo/on",
	"dojo/_base/lang"
], function(declare, ScrollableView, registry, on, lang){
	return declare([ScrollableView], {
		feedView: '',
		userIdInput: '',
		pwdInput: '',
		startup: function () {
			this.inherited(arguments);
			this.mobileSearchView = registry.byId("mobileSearchView");
			this.userIdInput = registry.byId("userId");
			//this.pwdInput = registry.byId("pwd");

			// handler to update search query parameters when done button is selected
			registry.byId("login").on("click", lang.hitch(this, function () {
				// we are done with the settings: transition to FeedView
				this.performTransition("mobileSearchView");
				// force FeedView list refresh
				this.mobileSearchView.refresh();
				console.log("The user is:::::" + this.getUserId());
			}));
			// handler to get notified before a transition to the current view starts
			this.on("beforeTransitionIn", lang.hitch(this, function () {
				//this.setTags(flickrview.QUERY.tags);
				//this.setTagMode(flickrview.QUERY.tagmode);
				//this.selectedLanguage = flickrview.QUERY.lang;
				//registry.byId(this.selectedLanguage).set('checked', true);
			}));
		},
		setUserId: function (userId) {
			this.userIdInput.set('value', userId);
		},
		getUserId: function () {
			return this.userIdInput.get('value');
		}	
	});
});