/**
 * 
 */
package com.ibm.simile.analytics;

import org.json.JSONException;
import org.json.JSONObject;

import com.ibm.simile.mobileid.Facebook;
import com.ibm.simile.mobileid.FourSquare;

/**
 * @author Mitesh Vasa
 * 
 */
public class CommonPatterns {

	public static JSONObject findCommonality(String mobileid1, String mobileid2) throws JSONException {
		JSONObject finalObj = new JSONObject();
		
		// FB friends comparison
		JSONObject o1 = Facebook.fetchFriends(mobileid1);
		JSONObject o2 = Facebook.fetchFriends(mobileid2);
		JSONObject o3 = UserProfiles.findCommonFacebookFriends(o1, o2);
		finalObj.put("commonFriends", o3);
		
		// FB interest comparison
		o1 = Facebook
				.fetchQueryResults(
						mobileid1,
						"SELECT name, email, sex, activities, birthday_date, books, education, hometown_location, current_location, inspirational_people, interests, languages, movies, music, political, relationship_status, religion, sports, tv, work FROM user WHERE uid=me()");
		o2 = Facebook
				.fetchQueryResults(
						mobileid2,
						"SELECT name, email, sex, activities, birthday_date, books, education, hometown_location, current_location, inspirational_people, interests, languages, movies, music, political, relationship_status, religion, sports, tv, work FROM user WHERE uid=me()");
		o3 = UserProfiles.compareFacebookProfiles(o1, o2);
		finalObj.put("commonInterests", o3);
		
		// Location comparison using F-square
		o1 = FourSquare.fetchUserVenues(mobileid1);
		o2 = FourSquare.fetchUserVenues(mobileid2);
		o3 = Location.compareLocations(o1, o2);
		finalObj.put("commonLocations", o3);

		// Professional bio comparison using Linkedin
		// TODO: use LinkedIn
		finalObj.put("commonProfessional", "");
		
		return finalObj;
	}

	public static void main(String[] args) {
		try {
			CommonPatterns.findCommonality("0014437391899", "0014502468901");
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

}