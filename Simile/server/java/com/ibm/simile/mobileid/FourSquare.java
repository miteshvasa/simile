/**
 * 
 */
package com.ibm.simile.mobileid;

import org.json.JSONObject;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

/**
 * @author Mitesh
 * 
 */
public class FourSquare {

	public static JSONObject fetchUserCheckins(String userID) {
		HttpResponse<JsonNode> response;
		try {
			response = Unirest
					.get("http://irldxvm052.irl.in.ibm.com:8002/users/"
							+ userID + "/checkins")
					.header("content-type", "application/json; charset=utf-8")
					.header("origin", "https://api.pok.ibm.com")
					.header("dnt", "1")
					.header("x-sse-authorization", Constants.AUTH_KEY).asJson();
			return response.getBody().getObject();
		} catch (UnirestException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static JSONObject fetchUserVenues(String userID) {
		HttpResponse<JsonNode> response;
		try {
			response = Unirest
					.get("http://irldxvm052.irl.in.ibm.com:8002/users/"
							+ userID + "/venues")
					.header("content-type", "application/json; charset=utf-8")
					.header("origin", "https://api.pok.ibm.com")
					.header("dnt", "1")
					.header("x-sse-authorization", Constants.AUTH_KEY).asJson();
			return response.getBody().getObject();
		} catch (UnirestException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String[] args) {
		System.out.println(FourSquare.fetchUserCheckins("0014502468901").toString());
		System.out.println(FourSquare.fetchUserVenues("0014502468901").toString());
	}

}
