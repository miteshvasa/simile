/**
 * 
 */
package com.ibm.simile.analytics;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.StringTokenizer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ibm.simile.mobileid.Facebook;

/**
 * @author Mitesh
 * 
 */
public class UserProfiles {

	public static JSONObject compareFacebookProfiles(JSONObject o1,
			JSONObject o2) {
		JSONObject commonObj = new JSONObject();
		if (o1 != null && o2 != null) {
			try {
				JSONObject obj1 = o1.getJSONObject("result")
						.getJSONArray("data").getJSONObject(0);
				JSONObject obj2 = o2.getJSONObject("result")
						.getJSONArray("data").getJSONObject(0);

				compare(obj1, obj2, commonObj, "relationship_status");
				compare(obj1, obj2, commonObj, "tv");
				compare(obj1, obj2, commonObj, "movies");
				compare(obj1, obj2, commonObj, "music");
				compare(obj1, obj2, commonObj, "religion");
				compare(obj1, obj2, commonObj, "political");
				compareBirthday(obj1, obj2, commonObj, "birthday_date");
				
				
				// obj.getJSONArray("education")
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		return commonObj;
	}

	private static JSONObject compare(JSONObject obj1, JSONObject obj2,
			JSONObject commonObj, String item) throws JSONException {
		String str1 = obj1.get(item).toString();
		String str2 = obj2.get(item).toString();
		StringTokenizer tok1 = new StringTokenizer(str1, ",");
		StringTokenizer tok2 = new StringTokenizer(str2, ",");
		Set<String> set1 = new HashSet<String>();
		Set<String> set2 = new HashSet<String>();
		if (tok1.countTokens() > 1) {
			while (tok1.hasMoreTokens()) {
				set1.add(tok1.nextToken().trim().toLowerCase());
			}
		} else {
			set1.add(str1.trim().toLowerCase());
		}

		if (tok2.countTokens() > 1) {
			while (tok2.hasMoreTokens()) {
				set2.add(tok2.nextToken().trim().toLowerCase());
			}
		} else {
			set2.add(str2.trim().toLowerCase());
		}

		set1.retainAll(set2);
		commonObj.put(item, set1);
		return commonObj;
	}

	private static JSONObject compareBirthday(JSONObject obj1, JSONObject obj2,
			JSONObject commonObj, String item) throws JSONException {
		String str1 = obj1.get(item).toString();
		String str2 = obj2.get(item).toString();
		StringTokenizer tok1 = new StringTokenizer(str1, "/");
		StringTokenizer tok2 = new StringTokenizer(str2, "/");
		Calendar cal1 = Calendar.getInstance();
		cal1.set(Calendar.MONTH, Integer.parseInt(tok1.nextToken()));
		cal1.set(Calendar.DATE, Integer.parseInt(tok1.nextToken()));
		cal1.set(Calendar.YEAR, Integer.parseInt(tok1.nextToken()));
				
		Calendar cal2 = Calendar.getInstance();
		cal2.set(Calendar.MONTH, Integer.parseInt(tok2.nextToken()));
		cal2.set(Calendar.DATE, Integer.parseInt(tok2.nextToken()));
		cal2.set(Calendar.YEAR, Integer.parseInt(tok2.nextToken()));
		
		boolean day = false, month = false, year = false;
		if (cal1.get(Calendar.MONTH) == cal2.get(Calendar.MONTH)) {
			month = true;
		}
		if (cal1.get(Calendar.DATE) == cal2.get(Calendar.DATE)) {
			day = true;
		}
		if (cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR)) {
			year = true;
		}
		
		String message = "Both of you are born";
		if (day) {
			message += " on the same day: " + cal1.get(Calendar.DATE);
		}
		if (month) {
			message += " in the same month: " + cal1.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.US);
		}
		if (year) {
			message += " in the same year: " + cal1.get(Calendar.YEAR);
		}
		if (day || month || year) {
			commonObj.put(item, message);
		} else {
			commonObj.put(item, "");
		}
		
		return commonObj;
	}

	public static JSONObject findCommonFacebookFriends(JSONObject o1,
			JSONObject o2) {
		JSONObject commonObj = new JSONObject();
		if (o1 != null && o2 != null) {
			try {
				JSONArray a1 = o1.getJSONArray("result");
				Set<String> set1 = new HashSet<String>();
				for (int i = 0; i < a1.length(); i++) {
					set1.add(a1.get(i).toString().trim().toLowerCase());
				}
				JSONArray a2 = o2.getJSONArray("result");
				Set<String> set2 = new HashSet<String>();
				for (int i = 0; i < a2.length(); i++) {
					set2.add(a2.get(i).toString().trim().toLowerCase());
				}
				if (set1.retainAll(set2)) {
					commonObj.put("friends", set1);
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		return commonObj;
	}

	public static void main(String[] args) {
		JSONObject o1 = Facebook.fetchFriends("0014437391899");
		JSONObject o2 = Facebook.fetchFriends("0014502468901");
		JSONObject o3 = findCommonFacebookFriends(o1, o2);
		System.out.println(o3.toString());

		o1 = Facebook
				.fetchQueryResults(
						"0014437391899",
						"SELECT name, email, sex, activities, birthday_date, books, education, hometown_location, current_location, inspirational_people, interests, languages, movies, music, political, relationship_status, religion, sports, tv, work FROM user WHERE uid=me()");
		o2 = Facebook
				.fetchQueryResults(
						"0014502468901",
						"SELECT name, email, sex, activities, birthday_date, books, education, hometown_location, current_location, inspirational_people, interests, languages, movies, music, political, relationship_status, religion, sports, tv, work FROM user WHERE uid=me()");
		o3 = compareFacebookProfiles(o1, o2);
		System.out.println(o1.toString());
		System.out.println(o2.toString());
		System.out.println(o3.toString());
	}

}
