

var Module = require('module');
var sysReq = Module.prototype.require;

Module.prototype.require = function(){
	//console.log("Require override");
	return sysReq.apply(this, arguments);
};