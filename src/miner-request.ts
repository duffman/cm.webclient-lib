/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

//require("./tspath-require");

import {Settings}                 from "../global";
import * as fs                    from "fs";
import * as request               from "request"
import * as querystring           from "querystring";

export enum RequestType {
	GET,
	POST,
	DELETE,
	PUT
}

export class MinerRequest {
	requestHeader: any;

	constructor(reqHeader: any = null) {
		this.requestHeader = reqHeader;
	}

	/**
	 * Execute a HTTP request with specified parameters
	 * @param {RequestType} reqType
	 * @param {string} reqUri
	 * @param payload
	 * @returns {Promise<any>}
	 */
	public executeRequest(reqType: RequestType, reqUri: string, payload: any = null): Promise<any> {
		return new Promise((resolve, reject) => {
			resolve(null);
		});
	}

	public postRequest(reqUri: string, payload: any = null): Promise<any> {
		let formData = querystring.stringify(payload);
		let contentLength = formData.length;

		let options2 = {
			uri: reqUri,
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
				//"content-type": "application/json;charset=UTF-8",
				"cache-control": "no-cache",
				'Content-Length': contentLength,
				'Content-Type': 'application/x-www-form-urlencoded',
				"accept": "*/*"
			},
			method: MinerRequest.RequestTypeToStr(RequestType.POST),
			//json: true,
			body: formData
		};

		/*
		if (payload != null) {
			options["body"] = payload;
		}
		*/
		let newRequest2 = request.defaults();

		let scope = this;

		return new Promise((resolve, reject) => {
			return newRequest2(options2, (error: any, response: any, body: any) => {
				if (!error && response.statusCode == 200) {
					resolve(body);
				}
				else {
					reject(error);
				}
			});
		});
	}

	public executeProxyRequest(reqType: RequestType, reqUri: string, payload: any = null): Promise<any> {
		let options = {
			uri: reqUri,
			ca: fs.readFileSync("./crawlera-ca.crt"),
			requestCert: true,
			rejectUnauthorized: true,
			headers: this.requestHeader,
			method: MinerRequest.RequestTypeToStr(reqType),
			json: true,
			gzip: true
		};

		if (payload != null) {
			options["body"] = payload;
		}

		let newRequest = request.defaults({
			'proxy': Settings.PROXY_URL
		});

		let scope = this;

		return new Promise((resolve, reject) => {
			function callback(error: any, response: any, body: any) {
				if (!error && response.statusCode == 200) {
					resolve(body);
				}
				else {
					reject(error);
				}
			}
			newRequest(options, callback);
		});
	}

	/**
	 * Convert RequestType to its string representation
	 * @param {RequestType} reqType
	 * @returns {string}
	 * @constructor
	 */
	public static RequestTypeToStr(reqType: RequestType): string {
		let result = "";
		switch (reqType) {
			case RequestType.GET:
				result = "GET";
				break;
			case RequestType.POST:
				result = "POST";
				break;
			case RequestType.DELETE:
				result = "DELETE";
				break;
			case RequestType.PUT:
				result = "PUT";
				break;
		}

		return result;
	}
}