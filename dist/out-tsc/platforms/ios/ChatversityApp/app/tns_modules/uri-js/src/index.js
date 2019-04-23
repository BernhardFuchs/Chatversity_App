"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var uri_1 = require("./uri");
var http_1 = require("./schemes/http");
uri_1.SCHEMES[http_1.default.scheme] = http_1.default;
var https_1 = require("./schemes/https");
uri_1.SCHEMES[https_1.default.scheme] = https_1.default;
var mailto_1 = require("./schemes/mailto");
uri_1.SCHEMES[mailto_1.default.scheme] = mailto_1.default;
var urn_1 = require("./schemes/urn");
uri_1.SCHEMES[urn_1.default.scheme] = urn_1.default;
var urn_uuid_1 = require("./schemes/urn-uuid");
uri_1.SCHEMES[urn_uuid_1.default.scheme] = urn_uuid_1.default;
__export(require("./uri"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy91cmktanMvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkJBQWdDO0FBRWhDLHVDQUFrQztBQUNsQyxhQUFPLENBQUMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGNBQUksQ0FBQztBQUU1Qix5Q0FBb0M7QUFDcEMsYUFBTyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxlQUFLLENBQUM7QUFFOUIsMkNBQXNDO0FBQ3RDLGFBQU8sQ0FBQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFNLENBQUM7QUFFaEMscUNBQWdDO0FBQ2hDLGFBQU8sQ0FBQyxhQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsYUFBRyxDQUFDO0FBRTFCLCtDQUFzQztBQUN0QyxhQUFPLENBQUMsa0JBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxrQkFBSSxDQUFDO0FBRTVCLDJCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNDSEVNRVMgfSBmcm9tIFwiLi91cmlcIjtcblxuaW1wb3J0IGh0dHAgZnJvbSBcIi4vc2NoZW1lcy9odHRwXCI7XG5TQ0hFTUVTW2h0dHAuc2NoZW1lXSA9IGh0dHA7XG5cbmltcG9ydCBodHRwcyBmcm9tIFwiLi9zY2hlbWVzL2h0dHBzXCI7XG5TQ0hFTUVTW2h0dHBzLnNjaGVtZV0gPSBodHRwcztcblxuaW1wb3J0IG1haWx0byBmcm9tIFwiLi9zY2hlbWVzL21haWx0b1wiO1xuU0NIRU1FU1ttYWlsdG8uc2NoZW1lXSA9IG1haWx0bztcblxuaW1wb3J0IHVybiBmcm9tIFwiLi9zY2hlbWVzL3VyblwiO1xuU0NIRU1FU1t1cm4uc2NoZW1lXSA9IHVybjtcblxuaW1wb3J0IHV1aWQgZnJvbSBcIi4vc2NoZW1lcy91cm4tdXVpZFwiO1xuU0NIRU1FU1t1dWlkLnNjaGVtZV0gPSB1dWlkO1xuXG5leHBvcnQgKiBmcm9tIFwiLi91cmlcIjtcbiJdfQ==