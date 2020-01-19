/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import * as request               from "request"
import { CookieJar }              from "@core/cookie-jar";

export class SessionRetriever {
	public getPHPSessionId(): Promise<string> {
		let options = {
			uri: "https://zapper.co.uk/",
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
				"cache-control": "no-cache",
				"accept": "*/*",
			},
			method: "GET",
		};

		let newRequest = request.defaults();

		return new Promise((resolve, reject) => {
			newRequest(options, (error: any, response: any, body: any) => {
				if (!error && response.statusCode == 200) {

					let reqCookie = response.headers['set-cookie'];
					if (reqCookie != null) {
						let jar = new CookieJar(reqCookie);
						let sessId = jar.getPHPSession();

						resolve(sessId);

					} else {
						reject(
							new Error("PHP Session Id Missing")
						);
					}
				}
				else {
					reject(error);
				}
			});
		});

	}

	public initSessionId(id: string): Promise<string> {
		let options = {
			uri: "https://zapper.co.uk/",
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
				"cache-control": "no-cache",
				"accept": "*/*",
				"cookie": id // "PHPSESSID=mkcn91rh75s29glptm53oid1g4;"
			},
			method: "GET",
		};

		let newRequest = request.defaults();

		return new Promise((resolve, reject) => {
			newRequest(options, (error: any, response: any, body: any) => {
				if (!error && response.statusCode == 200) {

					let reqCookie = response.headers['set-cookie'];
					if (reqCookie != null) {
						let jar = new CookieJar(reqCookie);
						let sessId = jar.getPHPSession();

						resolve(sessId);

					} else {
						reject(
							new Error("PHP Session Id Missing")
						);
					}
				}
				else {
					reject(error);
				}
			});
		});

	}

}


let app = new SessionRetriever();
app.getPHPSessionId().then((res) => {
	//console.log("DONE", res);

}).catch((err) => {
	console.log("ERO", err);
});