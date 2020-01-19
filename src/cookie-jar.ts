/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

export class CookieItem {
	constructor(
		public name: string,
		public value: string) {}
}

export class CookieJar {
	data: Array<string>;
	cookies = new Array<CookieItem>();

	constructor(data: any = null) {
		if (data instanceof Array) {
			this.parseCookie(data);
		}
	}

	public getCookie(name: string): CookieItem {
		let result: CookieItem = null;
		for (let i = 0; i < this.cookies.length; i++) {
			let item = this.cookies[i];
			if (item.name == name) {
				result = item;
				break;
			}
		}

		return result;
	}

	/**
	 * Returns session data for the default PHP session id
	 * @returns {string}
	 */
	public getPHPSession(): string {
		let item = this.getCookie("PHPSESSID");

		if (item == null) {
			return "";
		}

		let val = item.value != null ? item.value : "";
		let delimIndex = val.indexOf(";");

		if (delimIndex > -1) {
			val = val.substring(0, delimIndex);
		}

		if (val.length > 0) {
			val = item.name + "=" + val + ";";
		}

		return val;
	}

	public parseCookie(dataArray: Array<string>): void {
		this.data = dataArray;
		for (let i = 0; i < this.data.length; i++) {
			let dataStr = this.data[i];
			let parts = dataStr.split("=");
			this.cookies.push(
				new CookieItem(parts[0], parts[1])
			);
		}
	}
}