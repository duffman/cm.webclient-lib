/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

export interface MinerSessionData {
	id?        : number;
	sessionKey?: string;
	minerName? : string;
	created?   : string;
	vendorId?  : number;
	completed? : number;
}

export interface MinerQueueData {
	id        : number;
	barcode   : string;
}

export class MinerWorkItemUpdate {
	constructor(
		public id: number,
		public sessionId: number,
		public accepted: boolean,
		public price: number,
		public message: string
	) {}
}

export namespace MinerDataConvert {
	export function toMinerSessionData(json: string): MinerSessionData {
		return JSON.parse(json);
	}

	export function minerSessionDataToJson(value: MinerSessionData): string {
		return JSON.stringify(value);
	}

	export function toMinerQueueData(json: string): MinerQueueData[] {
		return JSON.parse(json);
	}

	export function minerQueueDataToJson(value: MinerQueueData[]): string {
		return JSON.stringify(value);
	}
}