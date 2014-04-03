/**
 * 
 */
package com.ibm.simile.mobileid;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.json.JSONObject;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

/**
 * @author Mitesh Vasa
 * 
 */
public class Facebook {

	public static JSONObject fetchUserBasicProfile(String userID) {
		HttpResponse<JsonNode> response;
		try {
			response = Unirest
					.get("http://irldxvm052.irl.in.ibm.com:8002/users/"
							+ userID)
					.header("content-type", "application/json; charset=utf-8")
					.header("origin", "https://api.pok.ibm.com")
					.header("x-sse-authorization", Constants.AUTH_KEY).asJson();
			return response.getBody().getObject();
		} catch (UnirestException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static JSONObject fetchFriends(String userID) {
		HttpResponse<JsonNode> response;
		try {
			response = Unirest
					.get("http://irldxvm052.irl.in.ibm.com:8002/users/"
							+ userID + "/friends")
					.header("content-type", "application/json; charset=utf-8")
					.header("origin", "https://api.pok.ibm.com")
					.header("x-sse-authorization", Constants.AUTH_KEY).asJson();
			return response.getBody().getObject();
		} catch (UnirestException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static JSONObject fetchStatuses(String userID) {
		HttpResponse<JsonNode> response;
		try {
			response = Unirest
					.get("http://irldxvm052.irl.in.ibm.com:8002/users/"
							+ userID + "/statuses")
					.header("content-type", "application/json; charset=utf-8")
					.header("origin", "https://api.pok.ibm.com")
					.header("x-sse-authorization", Constants.AUTH_KEY).asJson();
			return response.getBody().getObject();
		} catch (UnirestException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static JSONObject fetchQueryResults(String userID, String query) {
		HttpResponse<JsonNode> response;
		try {
			response = Unirest
					.get("http://irldxvm052.irl.in.ibm.com:8002/users/"
							+ userID + "/fql?q="
							+ URLEncoder.encode(query, "UTF-8"))
					.header("content-type", "application/json; charset=utf-8")
					.header("origin", "https://api.pok.ibm.com")
					.header("x-sse-authorization", Constants.AUTH_KEY).asJson();
			return response.getBody().getObject();
		} catch (UnirestException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String[] args) {
		// Facebook.fetchUserBasicProfile("0014437391899");
		// Facebook.fetchUserBasicProfile("0014502468901");
		System.out.println(Facebook.fetchFriends("0014437391899").toString());
		System.out.println(Facebook.fetchFriends("0014502468901").toString());
		// Facebook.fetchStatuses("0014437391899");
		// Facebook.fetchStatuses("0014502468901");
		Facebook.fetchQueryResults(
				"0014437391899",
				"SELECT name, email, sex, timezone, meeting_sex, activities, birthday_date, books, education, hometown_location, current_location, inspirational_people, interests, languages, movies, music, political, relationship_status, religion, sports, tv, work FROM user WHERE uid=me()");
	}

}
