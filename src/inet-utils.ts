/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import {Logger} from '@clicom/cli.logger';
import * as http from 'http';
import * as https from 'https';

/*const http = require("http");
const https = require("https");
const request = require('request');
*/

const log = console.log;

export enum UrlType {
	Unknown,
	Http,
	Https
}

export class InetUtils {
	public static getHttps(url: string): Promise<string> {
		return new Promise( (resolve, reject) => {
			https.get(url, res => {
				let source = "";

				res.setEncoding("utf8");
				res.on("data", buffer => {
					source += buffer.toString();
				});
				res.on("end", () => {
					resolve(source);
				});

			}).on('error', (e) => {
				reject(e);
			});
		});
	}

	public static getHttp(url: string): Promise<string> {
		return new Promise( (resolve, reject) => {
			http.get(url, res => {
				let source = "";

				res.setEncoding("utf8");
				res.on("data", buffer => {
					source += buffer.toString();
				});
				res.on("end", () => {
					resolve(source);
				});

			}).on('error', (e) => {
				reject(e);
			});
		});
	}

	/**
	 * Returns the HTTP protocol type from a given URL
	 * @param {string} url
	 * @returns {UrlType}
	 */
	public static getUrlType(url: string): UrlType {
		let result = UrlType.Unknown;
		url = url.toLowerCase();

		let pUrl = url.substr(0, url.indexOf("://"));

		switch (pUrl) {
			case "http":
				result = UrlType.Http;
				break;

			case "https":
				result = UrlType.Https;
				break;
		}

		return result;
	}

	/**
	 * Returns a string representation of a given UrlType
	 * @param {UrlType} urlType
	 * @returns {string}
	 */
	public static urlTypeToString(urlType: UrlType): string {
		let result = "Unknown";
		switch (urlType) {
			case UrlType.Http:
				result = "UrlType.Http";
				break;

			case UrlType.Https:
				result = "UrlType.Https";
				break;
		}

		return result;
	}


	/**
	 * Retrieves the source of a given URL, it will detect
	 * Url type to seamlessly support both HTTP & HTTPS
	 * @param string - url to extract source from
	 * @returns Promise<string> - the source returned
	 */
	public static getUrlContents(url: string): Promise<string> {
		let scope = this;
		let urlType = InetUtils.getUrlType(url);
		let contents: string;

		return new Promise((resolve, reject) => {
			let urlTypeStr = InetUtils.urlTypeToString(urlType);

			if (urlType == UrlType.Http) {
				InetUtils.getHttp(url).then((contents) => {
					resolve(contents);
				}).catch((err) => {
					Logger.logError("getUrlContents (HTTP) : " + err.code, url);
					reject(err);
				});

			} else if (urlType == UrlType.Https) {
				InetUtils.getHttps(url).then((contents) => {
					resolve(contents);
				}).catch((err) => {
					Logger.logError("getUrlContents (HTTPS) : " + err.code, url);
					reject(err);
				});

			} else {
				let error = new Error("Unknown protocol");
				reject(error);
			}
		});
	}

	public static conntionRefused(err: any): boolean {
		return (err != null && err.code == "ECONNREFUSED");
	}
}