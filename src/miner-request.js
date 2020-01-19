"use strict";
//require("./tspath-require");
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../global");
const fs = require("fs");
const request = require("request");
var RequestType;
(function (RequestType) {
    RequestType[RequestType["GET"] = 0] = "GET";
    RequestType[RequestType["POST"] = 1] = "POST";
    RequestType[RequestType["DELETE"] = 2] = "DELETE";
    RequestType[RequestType["PUT"] = 3] = "PUT";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
class MinerRequest {
    constructor(reqHeader = null) {
        this.requestHeader = reqHeader;
    }
    /**
     * Execute a HTTP request with specified parameters
     * @param {RequestType} reqType
     * @param {string} reqUri
     * @param payload
     * @returns {Promise<any>}
     */
    executeRequest(reqType, reqUri, payload = null) {
        let requestHeader = {
            "referer": "http://api.topzap.com",
            "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            "content-type": "application/json;charset=UTF-8",
            "origin": "http://api.topzap.com",
            "cache-control": "no-cache",
            "accept": "*/*"
        };
        let options = {
            uri: reqUri,
            headers: requestHeader,
            method: MinerRequest.RequestTypeToStr(reqType),
            json: true
        };
        if (payload != null) {
            options["body"] = payload;
        }
        let newRequest = request.defaults();
        let scope = this;
        return new Promise((resolve, reject) => {
            return newRequest(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    executeProxyRequest(reqType, reqUri, payload = null) {
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
            'proxy': global_1.Settings.PROXY_URL
        });
        let scope = this;
        return new Promise((resolve, reject) => {
            function callback(error, response, body) {
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
    static RequestTypeToStr(reqType) {
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
exports.MinerRequest = MinerRequest;
