"use strict";
/**
 * URI.js
 *
 * @fileoverview An RFC 3986 compliant, scheme extendable URI parsing/validating/resolving library for JavaScript.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/uri-js
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2011 Gary Court. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court.
 */
var regexps_uri_1 = require("./regexps-uri");
var regexps_iri_1 = require("./regexps-iri");
var punycode_1 = require("punycode");
var util_1 = require("./util");
exports.SCHEMES = {};
function pctEncChar(chr) {
    var c = chr.charCodeAt(0);
    var e;
    if (c < 16)
        e = "%0" + c.toString(16).toUpperCase();
    else if (c < 128)
        e = "%" + c.toString(16).toUpperCase();
    else if (c < 2048)
        e = "%" + ((c >> 6) | 192).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
    else
        e = "%" + ((c >> 12) | 224).toString(16).toUpperCase() + "%" + (((c >> 6) & 63) | 128).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
    return e;
}
exports.pctEncChar = pctEncChar;
function pctDecChars(str) {
    var newStr = "";
    var i = 0;
    var il = str.length;
    while (i < il) {
        var c = parseInt(str.substr(i + 1, 2), 16);
        if (c < 128) {
            newStr += String.fromCharCode(c);
            i += 3;
        }
        else if (c >= 194 && c < 224) {
            if ((il - i) >= 6) {
                var c2 = parseInt(str.substr(i + 4, 2), 16);
                newStr += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            }
            else {
                newStr += str.substr(i, 6);
            }
            i += 6;
        }
        else if (c >= 224) {
            if ((il - i) >= 9) {
                var c2 = parseInt(str.substr(i + 4, 2), 16);
                var c3 = parseInt(str.substr(i + 7, 2), 16);
                newStr += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            }
            else {
                newStr += str.substr(i, 9);
            }
            i += 9;
        }
        else {
            newStr += str.substr(i, 3);
            i += 3;
        }
    }
    return newStr;
}
exports.pctDecChars = pctDecChars;
function _normalizeComponentEncoding(components, protocol) {
    function decodeUnreserved(str) {
        var decStr = pctDecChars(str);
        return (!decStr.match(protocol.UNRESERVED) ? str : decStr);
    }
    if (components.scheme)
        components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_SCHEME, "");
    if (components.userinfo !== undefined)
        components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, util_1.toUpperCase);
    if (components.host !== undefined)
        components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, util_1.toUpperCase);
    if (components.path !== undefined)
        components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved).replace((components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME), pctEncChar).replace(protocol.PCT_ENCODED, util_1.toUpperCase);
    if (components.query !== undefined)
        components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, util_1.toUpperCase);
    if (components.fragment !== undefined)
        components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, util_1.toUpperCase);
    return components;
}
;
function _stripLeadingZeros(str) {
    return str.replace(/^0*(.*)/, "$1") || "0";
}
function _normalizeIPv4(host, protocol) {
    var matches = host.match(protocol.IPV4ADDRESS) || [];
    var address = matches[1];
    if (address) {
        return address.split(".").map(_stripLeadingZeros).join(".");
    }
    else {
        return host;
    }
}
function _normalizeIPv6(host, protocol) {
    var matches = host.match(protocol.IPV6ADDRESS) || [];
    var address = matches[1], zone = matches[2];
    if (address) {
        var _a = address.toLowerCase().split('::').reverse(), last = _a[0], first = _a[1];
        var firstFields = first ? first.split(":").map(_stripLeadingZeros) : [];
        var lastFields = last.split(":").map(_stripLeadingZeros);
        var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]);
        var fieldCount = isLastFieldIPv4Address ? 7 : 8;
        var lastFieldsStart = lastFields.length - fieldCount;
        var fields = Array(fieldCount);
        for (var x = 0; x < fieldCount; ++x) {
            fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || '';
        }
        if (isLastFieldIPv4Address) {
            fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);
        }
        var allZeroFields = fields.reduce(function (acc, field, index) {
            if (!field || field === "0") {
                var lastLongest = acc[acc.length - 1];
                if (lastLongest && lastLongest.index + lastLongest.length === index) {
                    lastLongest.length++;
                }
                else {
                    acc.push({ index: index, length: 1 });
                }
            }
            return acc;
        }, []);
        var longestZeroFields = allZeroFields.sort(function (a, b) { return b.length - a.length; })[0];
        var newHost = void 0;
        if (longestZeroFields && longestZeroFields.length > 1) {
            var newFirst = fields.slice(0, longestZeroFields.index);
            var newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
            newHost = newFirst.join(":") + "::" + newLast.join(":");
        }
        else {
            newHost = fields.join(":");
        }
        if (zone) {
            newHost += "%" + zone;
        }
        return newHost;
    }
    else {
        return host;
    }
}
var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
var NO_MATCH_IS_UNDEFINED = ("").match(/(){0}/)[1] === undefined;
function parse(uriString, options) {
    if (options === void 0) { options = {}; }
    var components = {};
    var protocol = (options.iri !== false ? regexps_iri_1.default : regexps_uri_1.default);
    if (options.reference === "suffix")
        uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
    var matches = uriString.match(URI_PARSE);
    if (matches) {
        if (NO_MATCH_IS_UNDEFINED) {
            //store each component
            components.scheme = matches[1];
            components.userinfo = matches[3];
            components.host = matches[4];
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = matches[7];
            components.fragment = matches[8];
            //fix port number
            if (isNaN(components.port)) {
                components.port = matches[5];
            }
        }
        else { //IE FIX for improper RegExp matching
            //store each component
            components.scheme = matches[1] || undefined;
            components.userinfo = (uriString.indexOf("@") !== -1 ? matches[3] : undefined);
            components.host = (uriString.indexOf("//") !== -1 ? matches[4] : undefined);
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = (uriString.indexOf("?") !== -1 ? matches[7] : undefined);
            components.fragment = (uriString.indexOf("#") !== -1 ? matches[8] : undefined);
            //fix port number
            if (isNaN(components.port)) {
                components.port = (uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : undefined);
            }
        }
        if (components.host) {
            //normalize IP hosts
            components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);
        }
        //determine reference type
        if (components.scheme === undefined && components.userinfo === undefined && components.host === undefined && components.port === undefined && !components.path && components.query === undefined) {
            components.reference = "same-document";
        }
        else if (components.scheme === undefined) {
            components.reference = "relative";
        }
        else if (components.fragment === undefined) {
            components.reference = "absolute";
        }
        else {
            components.reference = "uri";
        }
        //check for reference errors
        if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
            components.error = components.error || "URI is not a " + options.reference + " reference.";
        }
        //find scheme handler
        var schemeHandler = exports.SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
        //check if scheme can't handle IRIs
        if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
            //if host component is a domain name
            if (components.host && (options.domainHost || (schemeHandler && schemeHandler.domainHost))) {
                //convert Unicode IDN -> ASCII IDN
                try {
                    components.host = punycode_1.default.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
                }
                catch (e) {
                    components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
                }
            }
            //convert IRI -> URI
            _normalizeComponentEncoding(components, regexps_uri_1.default);
        }
        else {
            //normalize encodings
            _normalizeComponentEncoding(components, protocol);
        }
        //perform scheme specific parsing
        if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(components, options);
        }
    }
    else {
        components.error = components.error || "URI can not be parsed.";
    }
    return components;
}
exports.parse = parse;
;
function _recomposeAuthority(components, options) {
    var protocol = (options.iri !== false ? regexps_iri_1.default : regexps_uri_1.default);
    var uriTokens = [];
    if (components.userinfo !== undefined) {
        uriTokens.push(components.userinfo);
        uriTokens.push("@");
    }
    if (components.host !== undefined) {
        //normalize IP hosts, add brackets and escape zone separator for IPv6
        uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function (_, $1, $2) { return "[" + $1 + ($2 ? "%25" + $2 : "") + "]"; }));
    }
    if (typeof components.port === "number") {
        uriTokens.push(":");
        uriTokens.push(components.port.toString(10));
    }
    return uriTokens.length ? uriTokens.join("") : undefined;
}
;
var RDS1 = /^\.\.?\//;
var RDS2 = /^\/\.(\/|$)/;
var RDS3 = /^\/\.\.(\/|$)/;
var RDS4 = /^\.\.?$/;
var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
function removeDotSegments(input) {
    var output = [];
    while (input.length) {
        if (input.match(RDS1)) {
            input = input.replace(RDS1, "");
        }
        else if (input.match(RDS2)) {
            input = input.replace(RDS2, "/");
        }
        else if (input.match(RDS3)) {
            input = input.replace(RDS3, "/");
            output.pop();
        }
        else if (input === "." || input === "..") {
            input = "";
        }
        else {
            var im = input.match(RDS5);
            if (im) {
                var s = im[0];
                input = input.slice(s.length);
                output.push(s);
            }
            else {
                throw new Error("Unexpected dot segment condition");
            }
        }
    }
    return output.join("");
}
exports.removeDotSegments = removeDotSegments;
;
function serialize(components, options) {
    if (options === void 0) { options = {}; }
    var protocol = (options.iri ? regexps_iri_1.default : regexps_uri_1.default);
    var uriTokens = [];
    //find scheme handler
    var schemeHandler = exports.SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
    //perform scheme specific serialization
    if (schemeHandler && schemeHandler.serialize)
        schemeHandler.serialize(components, options);
    if (components.host) {
        //if host component is an IPv6 address
        if (protocol.IPV6ADDRESS.test(components.host)) {
            //TODO: normalize IPv6 address as per RFC 5952
        }
        //if host component is a domain name
        else if (options.domainHost || (schemeHandler && schemeHandler.domainHost)) {
            //convert IDN via punycode
            try {
                components.host = (!options.iri ? punycode_1.default.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode_1.default.toUnicode(components.host));
            }
            catch (e) {
                components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
            }
        }
    }
    //normalize encoding
    _normalizeComponentEncoding(components, protocol);
    if (options.reference !== "suffix" && components.scheme) {
        uriTokens.push(components.scheme);
        uriTokens.push(":");
    }
    var authority = _recomposeAuthority(components, options);
    if (authority !== undefined) {
        if (options.reference !== "suffix") {
            uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (components.path && components.path.charAt(0) !== "/") {
            uriTokens.push("/");
        }
    }
    if (components.path !== undefined) {
        var s = components.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
            s = removeDotSegments(s);
        }
        if (authority === undefined) {
            s = s.replace(/^\/\//, "/%2F"); //don't allow the path to start with "//"
        }
        uriTokens.push(s);
    }
    if (components.query !== undefined) {
        uriTokens.push("?");
        uriTokens.push(components.query);
    }
    if (components.fragment !== undefined) {
        uriTokens.push("#");
        uriTokens.push(components.fragment);
    }
    return uriTokens.join(""); //merge tokens into a string
}
exports.serialize = serialize;
;
function resolveComponents(base, relative, options, skipNormalization) {
    if (options === void 0) { options = {}; }
    var target = {};
    if (!skipNormalization) {
        base = parse(serialize(base, options), options); //normalize base components
        relative = parse(serialize(relative, options), options); //normalize relative components
    }
    options = options || {};
    if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        //target.authority = relative.authority;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
    }
    else {
        if (relative.userinfo !== undefined || relative.host !== undefined || relative.port !== undefined) {
            //target.authority = relative.authority;
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
        }
        else {
            if (!relative.path) {
                target.path = base.path;
                if (relative.query !== undefined) {
                    target.query = relative.query;
                }
                else {
                    target.query = base.query;
                }
            }
            else {
                if (relative.path.charAt(0) === "/") {
                    target.path = removeDotSegments(relative.path);
                }
                else {
                    if ((base.userinfo !== undefined || base.host !== undefined || base.port !== undefined) && !base.path) {
                        target.path = "/" + relative.path;
                    }
                    else if (!base.path) {
                        target.path = relative.path;
                    }
                    else {
                        target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
                    }
                    target.path = removeDotSegments(target.path);
                }
                target.query = relative.query;
            }
            //target.authority = base.authority;
            target.userinfo = base.userinfo;
            target.host = base.host;
            target.port = base.port;
        }
        target.scheme = base.scheme;
    }
    target.fragment = relative.fragment;
    return target;
}
exports.resolveComponents = resolveComponents;
;
function resolve(baseURI, relativeURI, options) {
    var schemelessOptions = util_1.assign({ scheme: 'null' }, options);
    return serialize(resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
}
exports.resolve = resolve;
;
function normalize(uri, options) {
    if (typeof uri === "string") {
        uri = serialize(parse(uri, options), options);
    }
    else if (util_1.typeOf(uri) === "object") {
        uri = parse(serialize(uri, options), options);
    }
    return uri;
}
exports.normalize = normalize;
;
function equal(uriA, uriB, options) {
    if (typeof uriA === "string") {
        uriA = serialize(parse(uriA, options), options);
    }
    else if (util_1.typeOf(uriA) === "object") {
        uriA = serialize(uriA, options);
    }
    if (typeof uriB === "string") {
        uriB = serialize(parse(uriB, options), options);
    }
    else if (util_1.typeOf(uriB) === "object") {
        uriB = serialize(uriB, options);
    }
    return uriA === uriB;
}
exports.equal = equal;
;
function escapeComponent(str, options) {
    return str && str.toString().replace((!options || !options.iri ? regexps_uri_1.default.ESCAPE : regexps_iri_1.default.ESCAPE), pctEncChar);
}
exports.escapeComponent = escapeComponent;
;
function unescapeComponent(str, options) {
    return str && str.toString().replace((!options || !options.iri ? regexps_uri_1.default.PCT_ENCODED : regexps_iri_1.default.PCT_ENCODED), pctDecChars);
}
exports.unescapeComponent = unescapeComponent;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy91cmktanMvc3JjL3VyaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUVILDZDQUF5QztBQUN6Qyw2Q0FBeUM7QUFDekMscUNBQWdDO0FBQ2hDLCtCQUFxRDtBQWlEeEMsUUFBQSxPQUFPLEdBQXNDLEVBQUUsQ0FBQztBQUU3RCxTQUFnQixVQUFVLENBQUMsR0FBVTtJQUNwQyxJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBUSxDQUFDO0lBRWIsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMvQyxJQUFJLENBQUMsR0FBRyxHQUFHO1FBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BELElBQUksQ0FBQyxHQUFHLElBQUk7UUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7UUFDeEgs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LENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO0lBQzdOLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxTQUFTO1FBQUUsVUFBVSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO0lBQ2xRLElBQUksVUFBVSxDQUFDLEtBQUssS0FBSyxTQUFTO1FBQUUsVUFBVSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO0lBQ25OLElBQUksVUFBVSxDQUFDLFFBQVEsS0FBSyxTQUFTO1FBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO0lBRS9OLE9BQU8sVUFBVSxDQUFDO0FBQ25CLENB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QUFDO0FBRUYsU0FBZ0IsZUFBZSxDQUFDLEdBQVUsRUFBRSxPQUFtQjtJQUM5RCxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMxSCxDQUFDO0FBRkQsMENBRUM7QUFBQSxDQUFDO0FBRUYsU0FBZ0IsaUJBQWlCLENBQUMsR0FBVSxFQUFFLE9BQW1CO0lBQ2hFLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxxQkFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3JJLENBQUM7QUFGRCw4Q0FFQztBQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVSSS5qc1xuICpcbiAqIEBmaWxlb3ZlcnZpZXcgQW4gUkZDIDM5ODYgY29tcGxpYW50LCBzY2hlbWUgZXh0ZW5kYWJsZSBVUkkgcGFyc2luZy92YWxpZGF0aW5nL3Jlc29sdmluZyBsaWJyYXJ5IGZvciBKYXZhU2NyaXB0LlxuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmdhcnkuY291cnRAZ21haWwuY29tXCI+R2FyeSBDb3VydDwvYT5cbiAqIEBzZWUgaHR0cDovL2dpdGh1Yi5jb20vZ2FyeWNvdXJ0L3VyaS1qc1xuICovXG5cbi8qKlxuICogQ29weXJpZ2h0IDIwMTEgR2FyeSBDb3VydC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBhcmVcbiAqIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqICAgIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mXG4gKiAgICAgICBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKlxuICogICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3RcbiAqICAgICAgIG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzXG4gKiAgICAgICBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBHQVJZIENPVVJUIGBgQVMgSVMnJyBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRFxuICogV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEdBUlkgQ09VUlQgT1JcbiAqIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SXG4gKiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SXG4gKiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OXG4gKiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4gKiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUZcbiAqIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICpcbiAqIFRoZSB2aWV3cyBhbmQgY29uY2x1c2lvbnMgY29udGFpbmVkIGluIHRoZSBzb2Z0d2FyZSBhbmQgZG9jdW1lbnRhdGlvbiBhcmUgdGhvc2Ugb2YgdGhlXG4gKiBhdXRob3JzIGFuZCBzaG91bGQgbm90IGJlIGludGVycHJldGVkIGFzIHJlcHJlc2VudGluZyBvZmZpY2lhbCBwb2xpY2llcywgZWl0aGVyIGV4cHJlc3NlZFxuICogb3IgaW1wbGllZCwgb2YgR2FyeSBDb3VydC5cbiAqL1xuXG5pbXBvcnQgVVJJX1BST1RPQ09MIGZyb20gXCIuL3JlZ2V4cHMtdXJpXCI7XG5pbXBvcnQgSVJJX1BST1RPQ09MIGZyb20gXCIuL3JlZ2V4cHMtaXJpXCI7XG5pbXBvcnQgcHVueWNvZGUgZnJvbSBcInB1bnljb2RlXCI7XG5pbXBvcnQgeyB0b1VwcGVyQ2FzZSwgdHlwZU9mLCBhc3NpZ24gfSBmcm9tIFwiLi91dGlsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVVJJQ29tcG9uZW50cyB7XG5cdHNjaGVtZT86c3RyaW5nO1xuXHR1c2VyaW5mbz86c3RyaW5nO1xuXHRob3N0PzpzdHJpbmc7XG5cdHBvcnQ/Om51bWJlcnxzdHJpbmc7XG5cdHBhdGg/OnN0cmluZztcblx0cXVlcnk/OnN0cmluZztcblx0ZnJhZ21lbnQ/OnN0cmluZztcblx0cmVmZXJlbmNlPzpzdHJpbmc7XG5cdGVycm9yPzpzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVVJJT3B0aW9ucyB7XG5cdHNjaGVtZT86c3RyaW5nO1xuXHRyZWZlcmVuY2U/OnN0cmluZztcblx0dG9sZXJhbnQ/OmJvb2xlYW47XG5cdGFic29sdXRlUGF0aD86Ym9vbGVhbjtcblx0aXJpPzpib29sZWFuO1xuXHR1bmljb2RlU3VwcG9ydD86Ym9vbGVhbjtcblx0ZG9tYWluSG9zdD86Ym9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVUklTY2hlbWVIYW5kbGVyPENvbXBvbmVudHMgZXh0ZW5kcyBVUklDb21wb25lbnRzID0gVVJJQ29tcG9uZW50cywgT3B0aW9ucyBleHRlbmRzIFVSSU9wdGlvbnMgPSBVUklPcHRpb25zLCBQYXJlbnRDb21wb25lbnRzIGV4dGVuZHMgVVJJQ29tcG9uZW50cyA9IFVSSUNvbXBvbmVudHM+IHtcblx0c2NoZW1lOnN0cmluZztcblx0cGFyc2UoY29tcG9uZW50czpQYXJlbnRDb21wb25lbnRzLCBvcHRpb25zOk9wdGlvbnMpOkNvbXBvbmVudHM7XG5cdHNlcmlhbGl6ZShjb21wb25lbnRzOkNvbXBvbmVudHMsIG9wdGlvbnM6T3B0aW9ucyk6UGFyZW50Q29tcG9uZW50cztcblx0dW5pY29kZVN1cHBvcnQ/OmJvb2xlYW47XG5cdGRvbWFpbkhvc3Q/OmJvb2xlYW47XG5cdGFic29sdXRlUGF0aD86Ym9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVUklSZWdFeHBzIHtcblx0Tk9UX1NDSEVNRSA6IFJlZ0V4cCxcblx0Tk9UX1VTRVJJTkZPIDogUmVnRXhwLFxuXHROT1RfSE9TVCA6IFJlZ0V4cCxcblx0Tk9UX1BBVEggOiBSZWdFeHAsXG5cdE5PVF9QQVRIX05PU0NIRU1FIDogUmVnRXhwLFxuXHROT1RfUVVFUlkgOiBSZWdFeHAsXG5cdE5PVF9GUkFHTUVOVCA6IFJlZ0V4cCxcblx0RVNDQVBFIDogUmVnRXhwLFxuXHRVTlJFU0VSVkVEIDogUmVnRXhwLFxuXHRPVEhFUl9DSEFSUyA6IFJlZ0V4cCxcblx0UENUX0VOQ09ERUQgOiBSZWdFeHAsXG5cdElQVjRBRERSRVNTIDogUmVnRXhwLFxuXHRJUFY2QUREUkVTUyA6IFJlZ0V4cCxcbn1cblxuZXhwb3J0IGNvbnN0IFNDSEVNRVM6e1tzY2hlbWU6c3RyaW5nXTpVUklTY2hlbWVIYW5kbGVyfSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gcGN0RW5jQ2hhcihjaHI6c3RyaW5nKTpzdHJpbmcge1xuXHRjb25zdCBjID0gY2hyLmNoYXJDb2RlQXQoMCk7XG5cdGxldCBlOnN0cmluZztcblxuXHRpZiAoYyA8IDE2KSBlID0gXCIlMFwiICsgYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0ZWxzZSBpZiAoYyA8IDEyOCkgZSA9IFwiJVwiICsgYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0ZWxzZSBpZiAoYyA8IDIwNDgpIGUgPSBcIiVcIiArICgoYyA+PiA2KSB8IDE5MikudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkgKyBcIiVcIiArICgoYyAmIDYzKSB8IDEyOCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdGVsc2UgZSA9IFwiJVwiICsgKChjID4+IDEyKSB8IDIyNCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkgKyBcIiVcIiArICgoKGMgPj4gNikgJiA2MykgfCAxMjgpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpICsgXCIlXCIgKyAoKGMgJiA2MykgfCAxMjgpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXG5cdHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGN0RGVjQ2hhcnMoc3RyOnN0cmluZyk6c3RyaW5nIHtcblx0bGV0IG5ld1N0ciA9IFwiXCI7XG5cdGxldCBpID0gMDtcblx0Y29uc3QgaWwgPSBzdHIubGVuZ3RoO1xuXG5cdHdoaWxlIChpIDwgaWwpIHtcblx0XHRjb25zdCBjID0gcGFyc2VJbnQoc3RyLnN1YnN0cihpICsgMSwgMiksIDE2KTtcblxuXHRcdGlmIChjIDwgMTI4KSB7XG5cdFx0XHRuZXdTdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcblx0XHRcdGkgKz0gMztcblx0XHR9XG5cdFx0ZWxzZSBpZiAoYyA+PSAxOTQgJiYgYyA8IDIyNCkge1xuXHRcdFx0aWYgKChpbCAtIGkpID49IDYpIHtcblx0XHRcdFx0Y29uc3QgYzIgPSBwYXJzZUludChzdHIuc3Vic3RyKGkgKyA0LCAyKSwgMTYpO1xuXHRcdFx0XHRuZXdTdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAzMSkgPDwgNikgfCAoYzIgJiA2MykpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3U3RyICs9IHN0ci5zdWJzdHIoaSwgNik7XG5cdFx0XHR9XG5cdFx0XHRpICs9IDY7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPj0gMjI0KSB7XG5cdFx0XHRpZiAoKGlsIC0gaSkgPj0gOSkge1xuXHRcdFx0XHRjb25zdCBjMiA9IHBhcnNlSW50KHN0ci5zdWJzdHIoaSArIDQsIDIpLCAxNik7XG5cdFx0XHRcdGNvbnN0IGMzID0gcGFyc2VJbnQoc3RyLnN1YnN0cihpICsgNywgMiksIDE2KTtcblx0XHRcdFx0bmV3U3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMTUpIDw8IDEyKSB8ICgoYzIgJiA2MykgPDwgNikgfCAoYzMgJiA2MykpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3U3RyICs9IHN0ci5zdWJzdHIoaSwgOSk7XG5cdFx0XHR9XG5cdFx0XHRpICs9IDk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0bmV3U3RyICs9IHN0ci5zdWJzdHIoaSwgMyk7XG5cdFx0XHRpICs9IDM7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG5ld1N0cjtcbn1cblxuZnVuY3Rpb24gX25vcm1hbGl6ZUNvbXBvbmVudEVuY29kaW5nKGNvbXBvbmVudHM6VVJJQ29tcG9uZW50cywgcHJvdG9jb2w6VVJJUmVnRXhwcykge1xuXHRmdW5jdGlvbiBkZWNvZGVVbnJlc2VydmVkKHN0cjpzdHJpbmcpOnN0cmluZyB7XG5cdFx0Y29uc3QgZGVjU3RyID0gcGN0RGVjQ2hhcnMoc3RyKTtcblx0XHRyZXR1cm4gKCFkZWNTdHIubWF0Y2gocHJvdG9jb2wuVU5SRVNFUlZFRCkgPyBzdHIgOiBkZWNTdHIpO1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudHMuc2NoZW1lKSBjb21wb25lbnRzLnNjaGVtZSA9IFN0cmluZyhjb21wb25lbnRzLnNjaGVtZSkucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgZGVjb2RlVW5yZXNlcnZlZCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKHByb3RvY29sLk5PVF9TQ0hFTUUsIFwiXCIpO1xuXHRpZiAoY29tcG9uZW50cy51c2VyaW5mbyAhPT0gdW5kZWZpbmVkKSBjb21wb25lbnRzLnVzZXJpbmZvID0gU3RyaW5nKGNvbXBvbmVudHMudXNlcmluZm8pLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIGRlY29kZVVucmVzZXJ2ZWQpLnJlcGxhY2UocHJvdG9jb2wuTk9UX1VTRVJJTkZPLCBwY3RFbmNDaGFyKS5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCB0b1VwcGVyQ2FzZSk7XG5cdGlmIChjb21wb25lbnRzLmhvc3QgIT09IHVuZGVmaW5lZCkgY29tcG9uZW50cy5ob3N0ID0gU3RyaW5nKGNvbXBvbmVudHMuaG9zdCkucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgZGVjb2RlVW5yZXNlcnZlZCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKHByb3RvY29sLk5PVF9IT1NULCBwY3RFbmNDaGFyKS5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCB0b1VwcGVyQ2FzZSk7XG5cdGlmIChjb21wb25lbnRzLnBhdGggIT09IHVuZGVmaW5lZCkgY29tcG9uZW50cy5wYXRoID0gU3RyaW5nKGNvbXBvbmVudHMucGF0aCkucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgZGVjb2RlVW5yZXNlcnZlZCkucmVwbGFjZSgoY29tcG9uZW50cy5zY2hlbWUgPyBwcm90b2NvbC5OT1RfUEFUSCA6IHByb3RvY29sLk5PVF9QQVRIX05PU0NIRU1FKSwgcGN0RW5jQ2hhcikucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgdG9VcHBlckNhc2UpO1xuXHRpZiAoY29tcG9uZW50cy5xdWVyeSAhPT0gdW5kZWZpbmVkKSBjb21wb25lbnRzLnF1ZXJ5ID0gU3RyaW5nKGNvbXBvbmVudHMucXVlcnkpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIGRlY29kZVVucmVzZXJ2ZWQpLnJlcGxhY2UocHJvdG9jb2wuTk9UX1FVRVJZLCBwY3RFbmNDaGFyKS5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCB0b1VwcGVyQ2FzZSk7XG5cdGlmIChjb21wb25lbnRzLmZyYWdtZW50ICE9PSB1bmRlZmluZWQpIGNvbXBvbmVudHMuZnJhZ21lbnQgPSBTdHJpbmcoY29tcG9uZW50cy5mcmFnbWVudCkucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgZGVjb2RlVW5yZXNlcnZlZCkucmVwbGFjZShwcm90b2NvbC5OT1RfRlJBR01FTlQsIHBjdEVuY0NoYXIpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIHRvVXBwZXJDYXNlKTtcblxuXHRyZXR1cm4gY29tcG9uZW50cztcbn07XG5cbmZ1bmN0aW9uIF9zdHJpcExlYWRpbmdaZXJvcyhzdHI6c3RyaW5nKTpzdHJpbmcge1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UoL14wKiguKikvLCBcIiQxXCIpIHx8IFwiMFwiO1xufVxuXG5mdW5jdGlvbiBfbm9ybWFsaXplSVB2NChob3N0OnN0cmluZywgcHJvdG9jb2w6VVJJUmVnRXhwcyk6c3RyaW5nIHtcblx0Y29uc3QgbWF0Y2hlcyA9IGhvc3QubWF0Y2gocHJvdG9jb2wuSVBWNEFERFJFU1MpIHx8IFtdO1xuXHRjb25zdCBbLCBhZGRyZXNzXSA9IG1hdGNoZXM7XG5cdFxuXHRpZiAoYWRkcmVzcykge1xuXHRcdHJldHVybiBhZGRyZXNzLnNwbGl0KFwiLlwiKS5tYXAoX3N0cmlwTGVhZGluZ1plcm9zKS5qb2luKFwiLlwiKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gaG9zdDtcblx0fVxufVxuXG5mdW5jdGlvbiBfbm9ybWFsaXplSVB2Nihob3N0OnN0cmluZywgcHJvdG9jb2w6VVJJUmVnRXhwcyk6c3RyaW5nIHtcblx0Y29uc3QgbWF0Y2hlcyA9IGhvc3QubWF0Y2gocHJvdG9jb2wuSVBWNkFERFJFU1MpIHx8IFtdO1xuXHRjb25zdCBbLCBhZGRyZXNzLCB6b25lXSA9IG1hdGNoZXM7XG5cblx0aWYgKGFkZHJlc3MpIHtcblx0XHRjb25zdCBbbGFzdCwgZmlyc3RdID0gYWRkcmVzcy50b0xvd2VyQ2FzZSgpLnNwbGl0KCc6OicpLnJldmVyc2UoKTtcblx0XHRjb25zdCBmaXJzdEZpZWxkcyA9IGZpcnN0ID8gZmlyc3Quc3BsaXQoXCI6XCIpLm1hcChfc3RyaXBMZWFkaW5nWmVyb3MpIDogW107XG5cdFx0Y29uc3QgbGFzdEZpZWxkcyA9IGxhc3Quc3BsaXQoXCI6XCIpLm1hcChfc3RyaXBMZWFkaW5nWmVyb3MpO1xuXHRcdGNvbnN0IGlzTGFzdEZpZWxkSVB2NEFkZHJlc3MgPSBwcm90b2NvbC5JUFY0QUREUkVTUy50ZXN0KGxhc3RGaWVsZHNbbGFzdEZpZWxkcy5sZW5ndGggLSAxXSk7XG5cdFx0Y29uc3QgZmllbGRDb3VudCA9IGlzTGFzdEZpZWxkSVB2NEFkZHJlc3MgPyA3IDogODtcblx0XHRjb25zdCBsYXN0RmllbGRzU3RhcnQgPSBsYXN0RmllbGRzLmxlbmd0aCAtIGZpZWxkQ291bnQ7XG5cdFx0Y29uc3QgZmllbGRzID0gQXJyYXk8c3RyaW5nPihmaWVsZENvdW50KTtcblxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgZmllbGRDb3VudDsgKyt4KSB7XG5cdFx0XHRmaWVsZHNbeF0gPSBmaXJzdEZpZWxkc1t4XSB8fCBsYXN0RmllbGRzW2xhc3RGaWVsZHNTdGFydCArIHhdIHx8ICcnO1xuXHRcdH1cblxuXHRcdGlmIChpc0xhc3RGaWVsZElQdjRBZGRyZXNzKSB7XG5cdFx0XHRmaWVsZHNbZmllbGRDb3VudCAtIDFdID0gX25vcm1hbGl6ZUlQdjQoZmllbGRzW2ZpZWxkQ291bnQgLSAxXSwgcHJvdG9jb2wpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGFsbFplcm9GaWVsZHMgPSBmaWVsZHMucmVkdWNlPEFycmF5PHtpbmRleDpudW1iZXIsbGVuZ3RoOm51bWJlcn0+PigoYWNjLCBmaWVsZCwgaW5kZXgpID0+IHtcblx0XHRcdGlmICghZmllbGQgfHwgZmllbGQgPT09IFwiMFwiKSB7XG5cdFx0XHRcdGNvbnN0IGxhc3RMb25nZXN0ID0gYWNjW2FjYy5sZW5ndGggLSAxXTtcblx0XHRcdFx0aWYgKGxhc3RMb25nZXN0ICYmIGxhc3RMb25nZXN0LmluZGV4ICsgbGFzdExvbmdlc3QubGVuZ3RoID09PSBpbmRleCkge1xuXHRcdFx0XHRcdGxhc3RMb25nZXN0Lmxlbmd0aCsrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFjYy5wdXNoKHsgaW5kZXgsIGxlbmd0aCA6IDEgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBhY2M7XG5cdFx0fSwgW10pO1xuXG5cdFx0Y29uc3QgbG9uZ2VzdFplcm9GaWVsZHMgPSBhbGxaZXJvRmllbGRzLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpWzBdO1xuXG5cdFx0bGV0IG5ld0hvc3Q6c3RyaW5nO1xuXHRcdGlmIChsb25nZXN0WmVyb0ZpZWxkcyAmJiBsb25nZXN0WmVyb0ZpZWxkcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRjb25zdCBuZXdGaXJzdCA9IGZpZWxkcy5zbGljZSgwLCBsb25nZXN0WmVyb0ZpZWxkcy5pbmRleCkgO1xuXHRcdFx0Y29uc3QgbmV3TGFzdCA9IGZpZWxkcy5zbGljZShsb25nZXN0WmVyb0ZpZWxkcy5pbmRleCArIGxvbmdlc3RaZXJvRmllbGRzLmxlbmd0aCk7XG5cdFx0XHRuZXdIb3N0ID0gbmV3Rmlyc3Quam9pbihcIjpcIikgKyBcIjo6XCIgKyBuZXdMYXN0LmpvaW4oXCI6XCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRuZXdIb3N0ID0gZmllbGRzLmpvaW4oXCI6XCIpO1xuXHRcdH1cblxuXHRcdGlmICh6b25lKSB7XG5cdFx0XHRuZXdIb3N0ICs9IFwiJVwiICsgem9uZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3SG9zdDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gaG9zdDtcblx0fVxufVxuXG5jb25zdCBVUklfUEFSU0UgPSAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooW15cXC8/I0BdKilAKT8oXFxbW15cXC8/I1xcXV0rXFxdfFteXFwvPyM6XSopKD86XFw6KFxcZCopKT8pKT8oW14/I10qKSg/OlxcPyhbXiNdKikpPyg/OiMoKD86LnxcXG58XFxyKSopKT8vaTtcbmNvbnN0IE5PX01BVENIX0lTX1VOREVGSU5FRCA9ICg8UmVnRXhwTWF0Y2hBcnJheT4oXCJcIikubWF0Y2goLygpezB9LykpWzFdID09PSB1bmRlZmluZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZSh1cmlTdHJpbmc6c3RyaW5nLCBvcHRpb25zOlVSSU9wdGlvbnMgPSB7fSk6VVJJQ29tcG9uZW50cyB7XG5cdGNvbnN0IGNvbXBvbmVudHM6VVJJQ29tcG9uZW50cyA9IHt9O1xuXHRjb25zdCBwcm90b2NvbCA9IChvcHRpb25zLmlyaSAhPT0gZmFsc2UgPyBJUklfUFJPVE9DT0wgOiBVUklfUFJPVE9DT0wpO1xuXG5cdGlmIChvcHRpb25zLnJlZmVyZW5jZSA9PT0gXCJzdWZmaXhcIikgdXJpU3RyaW5nID0gKG9wdGlvbnMuc2NoZW1lID8gb3B0aW9ucy5zY2hlbWUgKyBcIjpcIiA6IFwiXCIpICsgXCIvL1wiICsgdXJpU3RyaW5nO1xuXG5cdGNvbnN0IG1hdGNoZXMgPSB1cmlTdHJpbmcubWF0Y2goVVJJX1BBUlNFKTtcblxuXHRpZiAobWF0Y2hlcykge1xuXHRcdGlmIChOT19NQVRDSF9JU19VTkRFRklORUQpIHtcblx0XHRcdC8vc3RvcmUgZWFjaCBjb21wb25lbnRcblx0XHRcdGNvbXBvbmVudHMuc2NoZW1lID0gbWF0Y2hlc1sxXTtcblx0XHRcdGNvbXBvbmVudHMudXNlcmluZm8gPSBtYXRjaGVzWzNdO1xuXHRcdFx0Y29tcG9uZW50cy5ob3N0ID0gbWF0Y2hlc1s0XTtcblx0XHRcdGNvbXBvbmVudHMucG9ydCA9IHBhcnNlSW50KG1hdGNoZXNbNV0sIDEwKTtcblx0XHRcdGNvbXBvbmVudHMucGF0aCA9IG1hdGNoZXNbNl0gfHwgXCJcIjtcblx0XHRcdGNvbXBvbmVudHMucXVlcnkgPSBtYXRjaGVzWzddO1xuXHRcdFx0Y29tcG9uZW50cy5mcmFnbWVudCA9IG1hdGNoZXNbOF07XG5cblx0XHRcdC8vZml4IHBvcnQgbnVtYmVyXG5cdFx0XHRpZiAoaXNOYU4oY29tcG9uZW50cy5wb3J0KSkge1xuXHRcdFx0XHRjb21wb25lbnRzLnBvcnQgPSBtYXRjaGVzWzVdO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7ICAvL0lFIEZJWCBmb3IgaW1wcm9wZXIgUmVnRXhwIG1hdGNoaW5nXG5cdFx0XHQvL3N0b3JlIGVhY2ggY29tcG9uZW50XG5cdFx0XHRjb21wb25lbnRzLnNjaGVtZSA9IG1hdGNoZXNbMV0gfHwgdW5kZWZpbmVkO1xuXHRcdFx0Y29tcG9uZW50cy51c2VyaW5mbyA9ICh1cmlTdHJpbmcuaW5kZXhPZihcIkBcIikgIT09IC0xID8gbWF0Y2hlc1szXSA6IHVuZGVmaW5lZCk7XG5cdFx0XHRjb21wb25lbnRzLmhvc3QgPSAodXJpU3RyaW5nLmluZGV4T2YoXCIvL1wiKSAhPT0gLTEgPyBtYXRjaGVzWzRdIDogdW5kZWZpbmVkKTtcblx0XHRcdGNvbXBvbmVudHMucG9ydCA9IHBhcnNlSW50KG1hdGNoZXNbNV0sIDEwKTtcblx0XHRcdGNvbXBvbmVudHMucGF0aCA9IG1hdGNoZXNbNl0gfHwgXCJcIjtcblx0XHRcdGNvbXBvbmVudHMucXVlcnkgPSAodXJpU3RyaW5nLmluZGV4T2YoXCI/XCIpICE9PSAtMSA/IG1hdGNoZXNbN10gOiB1bmRlZmluZWQpO1xuXHRcdFx0Y29tcG9uZW50cy5mcmFnbWVudCA9ICh1cmlTdHJpbmcuaW5kZXhPZihcIiNcIikgIT09IC0xID8gbWF0Y2hlc1s4XSA6IHVuZGVmaW5lZCk7XG5cblx0XHRcdC8vZml4IHBvcnQgbnVtYmVyXG5cdFx0XHRpZiAoaXNOYU4oY29tcG9uZW50cy5wb3J0KSkge1xuXHRcdFx0XHRjb21wb25lbnRzLnBvcnQgPSAodXJpU3RyaW5nLm1hdGNoKC9cXC9cXC8oPzoufFxcbikqXFw6KD86XFwvfFxcP3xcXCN8JCkvKSA/IG1hdGNoZXNbNF0gOiB1bmRlZmluZWQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChjb21wb25lbnRzLmhvc3QpIHtcblx0XHRcdC8vbm9ybWFsaXplIElQIGhvc3RzXG5cdFx0XHRjb21wb25lbnRzLmhvc3QgPSBfbm9ybWFsaXplSVB2Nihfbm9ybWFsaXplSVB2NChjb21wb25lbnRzLmhvc3QsIHByb3RvY29sKSwgcHJvdG9jb2wpO1xuXHRcdH1cblxuXHRcdC8vZGV0ZXJtaW5lIHJlZmVyZW5jZSB0eXBlXG5cdFx0aWYgKGNvbXBvbmVudHMuc2NoZW1lID09PSB1bmRlZmluZWQgJiYgY29tcG9uZW50cy51c2VyaW5mbyA9PT0gdW5kZWZpbmVkICYmIGNvbXBvbmVudHMuaG9zdCA9PT0gdW5kZWZpbmVkICYmIGNvbXBvbmVudHMucG9ydCA9PT0gdW5kZWZpbmVkICYmICFjb21wb25lbnRzLnBhdGggJiYgY29tcG9uZW50cy5xdWVyeSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb21wb25lbnRzLnJlZmVyZW5jZSA9IFwic2FtZS1kb2N1bWVudFwiO1xuXHRcdH0gZWxzZSBpZiAoY29tcG9uZW50cy5zY2hlbWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29tcG9uZW50cy5yZWZlcmVuY2UgPSBcInJlbGF0aXZlXCI7XG5cdFx0fSBlbHNlIGlmIChjb21wb25lbnRzLmZyYWdtZW50ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbXBvbmVudHMucmVmZXJlbmNlID0gXCJhYnNvbHV0ZVwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb21wb25lbnRzLnJlZmVyZW5jZSA9IFwidXJpXCI7XG5cdFx0fVxuXG5cdFx0Ly9jaGVjayBmb3IgcmVmZXJlbmNlIGVycm9yc1xuXHRcdGlmIChvcHRpb25zLnJlZmVyZW5jZSAmJiBvcHRpb25zLnJlZmVyZW5jZSAhPT0gXCJzdWZmaXhcIiAmJiBvcHRpb25zLnJlZmVyZW5jZSAhPT0gY29tcG9uZW50cy5yZWZlcmVuY2UpIHtcblx0XHRcdGNvbXBvbmVudHMuZXJyb3IgPSBjb21wb25lbnRzLmVycm9yIHx8IFwiVVJJIGlzIG5vdCBhIFwiICsgb3B0aW9ucy5yZWZlcmVuY2UgKyBcIiByZWZlcmVuY2UuXCI7XG5cdFx0fVxuXG5cdFx0Ly9maW5kIHNjaGVtZSBoYW5kbGVyXG5cdFx0Y29uc3Qgc2NoZW1lSGFuZGxlciA9IFNDSEVNRVNbKG9wdGlvbnMuc2NoZW1lIHx8IGNvbXBvbmVudHMuc2NoZW1lIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCldO1xuXG5cdFx0Ly9jaGVjayBpZiBzY2hlbWUgY2FuJ3QgaGFuZGxlIElSSXNcblx0XHRpZiAoIW9wdGlvbnMudW5pY29kZVN1cHBvcnQgJiYgKCFzY2hlbWVIYW5kbGVyIHx8ICFzY2hlbWVIYW5kbGVyLnVuaWNvZGVTdXBwb3J0KSkge1xuXHRcdFx0Ly9pZiBob3N0IGNvbXBvbmVudCBpcyBhIGRvbWFpbiBuYW1lXG5cdFx0XHRpZiAoY29tcG9uZW50cy5ob3N0ICYmIChvcHRpb25zLmRvbWFpbkhvc3QgfHwgKHNjaGVtZUhhbmRsZXIgJiYgc2NoZW1lSGFuZGxlci5kb21haW5Ib3N0KSkpIHtcblx0XHRcdFx0Ly9jb252ZXJ0IFVuaWNvZGUgSUROIC0+IEFTQ0lJIElETlxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbXBvbmVudHMuaG9zdCA9IHB1bnljb2RlLnRvQVNDSUkoY29tcG9uZW50cy5ob3N0LnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIHBjdERlY0NoYXJzKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdGNvbXBvbmVudHMuZXJyb3IgPSBjb21wb25lbnRzLmVycm9yIHx8IFwiSG9zdCdzIGRvbWFpbiBuYW1lIGNhbiBub3QgYmUgY29udmVydGVkIHRvIEFTQ0lJIHZpYSBwdW55Y29kZTogXCIgKyBlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnZlcnQgSVJJIC0+IFVSSVxuXHRcdFx0X25vcm1hbGl6ZUNvbXBvbmVudEVuY29kaW5nKGNvbXBvbmVudHMsIFVSSV9QUk9UT0NPTCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vbm9ybWFsaXplIGVuY29kaW5nc1xuXHRcdFx0X25vcm1hbGl6ZUNvbXBvbmVudEVuY29kaW5nKGNvbXBvbmVudHMsIHByb3RvY29sKTtcblx0XHR9XG5cblx0XHQvL3BlcmZvcm0gc2NoZW1lIHNwZWNpZmljIHBhcnNpbmdcblx0XHRpZiAoc2NoZW1lSGFuZGxlciAmJiBzY2hlbWVIYW5kbGVyLnBhcnNlKSB7XG5cdFx0XHRzY2hlbWVIYW5kbGVyLnBhcnNlKGNvbXBvbmVudHMsIG9wdGlvbnMpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRjb21wb25lbnRzLmVycm9yID0gY29tcG9uZW50cy5lcnJvciB8fCBcIlVSSSBjYW4gbm90IGJlIHBhcnNlZC5cIjtcblx0fVxuXG5cdHJldHVybiBjb21wb25lbnRzO1xufTtcblxuZnVuY3Rpb24gX3JlY29tcG9zZUF1dGhvcml0eShjb21wb25lbnRzOlVSSUNvbXBvbmVudHMsIG9wdGlvbnM6VVJJT3B0aW9ucyk6c3RyaW5nfHVuZGVmaW5lZCB7XG5cdGNvbnN0IHByb3RvY29sID0gKG9wdGlvbnMuaXJpICE9PSBmYWxzZSA/IElSSV9QUk9UT0NPTCA6IFVSSV9QUk9UT0NPTCk7XG5cdGNvbnN0IHVyaVRva2VuczpBcnJheTxzdHJpbmc+ID0gW107XG5cblx0aWYgKGNvbXBvbmVudHMudXNlcmluZm8gIT09IHVuZGVmaW5lZCkge1xuXHRcdHVyaVRva2Vucy5wdXNoKGNvbXBvbmVudHMudXNlcmluZm8pO1xuXHRcdHVyaVRva2Vucy5wdXNoKFwiQFwiKTtcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLmhvc3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdC8vbm9ybWFsaXplIElQIGhvc3RzLCBhZGQgYnJhY2tldHMgYW5kIGVzY2FwZSB6b25lIHNlcGFyYXRvciBmb3IgSVB2NlxuXHRcdHVyaVRva2Vucy5wdXNoKF9ub3JtYWxpemVJUHY2KF9ub3JtYWxpemVJUHY0KFN0cmluZyhjb21wb25lbnRzLmhvc3QpLCBwcm90b2NvbCksIHByb3RvY29sKS5yZXBsYWNlKHByb3RvY29sLklQVjZBRERSRVNTLCAoXywgJDEsICQyKSA9PiBcIltcIiArICQxICsgKCQyID8gXCIlMjVcIiArICQyIDogXCJcIikgKyBcIl1cIikpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjb21wb25lbnRzLnBvcnQgPT09IFwibnVtYmVyXCIpIHtcblx0XHR1cmlUb2tlbnMucHVzaChcIjpcIik7XG5cdFx0dXJpVG9rZW5zLnB1c2goY29tcG9uZW50cy5wb3J0LnRvU3RyaW5nKDEwKSk7XG5cdH1cblxuXHRyZXR1cm4gdXJpVG9rZW5zLmxlbmd0aCA/IHVyaVRva2Vucy5qb2luKFwiXCIpIDogdW5kZWZpbmVkO1xufTtcblxuY29uc3QgUkRTMSA9IC9eXFwuXFwuP1xcLy87XG5jb25zdCBSRFMyID0gL15cXC9cXC4oXFwvfCQpLztcbmNvbnN0IFJEUzMgPSAvXlxcL1xcLlxcLihcXC98JCkvO1xuY29uc3QgUkRTNCA9IC9eXFwuXFwuPyQvO1xuY29uc3QgUkRTNSA9IC9eXFwvPyg/Oi58XFxuKSo/KD89XFwvfCQpLztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKGlucHV0OnN0cmluZyk6c3RyaW5nIHtcblx0Y29uc3Qgb3V0cHV0OkFycmF5PHN0cmluZz4gPSBbXTtcblxuXHR3aGlsZSAoaW5wdXQubGVuZ3RoKSB7XG5cdFx0aWYgKGlucHV0Lm1hdGNoKFJEUzEpKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UoUkRTMSwgXCJcIik7XG5cdFx0fSBlbHNlIGlmIChpbnB1dC5tYXRjaChSRFMyKSkge1xuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKFJEUzIsIFwiL1wiKTtcblx0XHR9IGVsc2UgaWYgKGlucHV0Lm1hdGNoKFJEUzMpKSB7XG5cdFx0XHRpbnB1dCA9IGlucHV0LnJlcGxhY2UoUkRTMywgXCIvXCIpO1xuXHRcdFx0b3V0cHV0LnBvcCgpO1xuXHRcdH0gZWxzZSBpZiAoaW5wdXQgPT09IFwiLlwiIHx8IGlucHV0ID09PSBcIi4uXCIpIHtcblx0XHRcdGlucHV0ID0gXCJcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgaW0gPSBpbnB1dC5tYXRjaChSRFM1KTtcblx0XHRcdGlmIChpbSkge1xuXHRcdFx0XHRjb25zdCBzID0gaW1bMF07XG5cdFx0XHRcdGlucHV0ID0gaW5wdXQuc2xpY2Uocy5sZW5ndGgpO1xuXHRcdFx0XHRvdXRwdXQucHVzaChzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgZG90IHNlZ21lbnQgY29uZGl0aW9uXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvdXRwdXQuam9pbihcIlwiKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUoY29tcG9uZW50czpVUklDb21wb25lbnRzLCBvcHRpb25zOlVSSU9wdGlvbnMgPSB7fSk6c3RyaW5nIHtcblx0Y29uc3QgcHJvdG9jb2wgPSAob3B0aW9ucy5pcmkgPyBJUklfUFJPVE9DT0wgOiBVUklfUFJPVE9DT0wpO1xuXHRjb25zdCB1cmlUb2tlbnM6QXJyYXk8c3RyaW5nPiA9IFtdO1xuXG5cdC8vZmluZCBzY2hlbWUgaGFuZGxlclxuXHRjb25zdCBzY2hlbWVIYW5kbGVyID0gU0NIRU1FU1sob3B0aW9ucy5zY2hlbWUgfHwgY29tcG9uZW50cy5zY2hlbWUgfHwgXCJcIikudG9Mb3dlckNhc2UoKV07XG5cblx0Ly9wZXJmb3JtIHNjaGVtZSBzcGVjaWZpYyBzZXJpYWxpemF0aW9uXG5cdGlmIChzY2hlbWVIYW5kbGVyICYmIHNjaGVtZUhhbmRsZXIuc2VyaWFsaXplKSBzY2hlbWVIYW5kbGVyLnNlcmlhbGl6ZShjb21wb25lbnRzLCBvcHRpb25zKTtcblxuXHRpZiAoY29tcG9uZW50cy5ob3N0KSB7XG5cdFx0Ly9pZiBob3N0IGNvbXBvbmVudCBpcyBhbiBJUHY2IGFkZHJlc3Ncblx0XHRpZiAocHJvdG9jb2wuSVBWNkFERFJFU1MudGVzdChjb21wb25lbnRzLmhvc3QpKSB7XG5cdFx0XHQvL1RPRE86IG5vcm1hbGl6ZSBJUHY2IGFkZHJlc3MgYXMgcGVyIFJGQyA1OTUyXG5cdFx0fVxuXG5cdFx0Ly9pZiBob3N0IGNvbXBvbmVudCBpcyBhIGRvbWFpbiBuYW1lXG5cdFx0ZWxzZSBpZiAob3B0aW9ucy5kb21haW5Ib3N0IHx8IChzY2hlbWVIYW5kbGVyICYmIHNjaGVtZUhhbmRsZXIuZG9tYWluSG9zdCkpIHtcblx0XHRcdC8vY29udmVydCBJRE4gdmlhIHB1bnljb2RlXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb21wb25lbnRzLmhvc3QgPSAoIW9wdGlvbnMuaXJpID8gcHVueWNvZGUudG9BU0NJSShjb21wb25lbnRzLmhvc3QucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgcGN0RGVjQ2hhcnMpLnRvTG93ZXJDYXNlKCkpIDogcHVueWNvZGUudG9Vbmljb2RlKGNvbXBvbmVudHMuaG9zdCkpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRjb21wb25lbnRzLmVycm9yID0gY29tcG9uZW50cy5lcnJvciB8fCBcIkhvc3QncyBkb21haW4gbmFtZSBjYW4gbm90IGJlIGNvbnZlcnRlZCB0byBcIiArICghb3B0aW9ucy5pcmkgPyBcIkFTQ0lJXCIgOiBcIlVuaWNvZGVcIikgKyBcIiB2aWEgcHVueWNvZGU6IFwiICsgZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvL25vcm1hbGl6ZSBlbmNvZGluZ1xuXHRfbm9ybWFsaXplQ29tcG9uZW50RW5jb2RpbmcoY29tcG9uZW50cywgcHJvdG9jb2wpO1xuXG5cdGlmIChvcHRpb25zLnJlZmVyZW5jZSAhPT0gXCJzdWZmaXhcIiAmJiBjb21wb25lbnRzLnNjaGVtZSkge1xuXHRcdHVyaVRva2Vucy5wdXNoKGNvbXBvbmVudHMuc2NoZW1lKTtcblx0XHR1cmlUb2tlbnMucHVzaChcIjpcIik7XG5cdH1cblxuXHRjb25zdCBhdXRob3JpdHkgPSBfcmVjb21wb3NlQXV0aG9yaXR5KGNvbXBvbmVudHMsIG9wdGlvbnMpO1xuXHRpZiAoYXV0aG9yaXR5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRpZiAob3B0aW9ucy5yZWZlcmVuY2UgIT09IFwic3VmZml4XCIpIHtcblx0XHRcdHVyaVRva2Vucy5wdXNoKFwiLy9cIik7XG5cdFx0fVxuXG5cdFx0dXJpVG9rZW5zLnB1c2goYXV0aG9yaXR5KTtcblxuXHRcdGlmIChjb21wb25lbnRzLnBhdGggJiYgY29tcG9uZW50cy5wYXRoLmNoYXJBdCgwKSAhPT0gXCIvXCIpIHtcblx0XHRcdHVyaVRva2Vucy5wdXNoKFwiL1wiKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoY29tcG9uZW50cy5wYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRsZXQgcyA9IGNvbXBvbmVudHMucGF0aDtcblxuXHRcdGlmICghb3B0aW9ucy5hYnNvbHV0ZVBhdGggJiYgKCFzY2hlbWVIYW5kbGVyIHx8ICFzY2hlbWVIYW5kbGVyLmFic29sdXRlUGF0aCkpIHtcblx0XHRcdHMgPSByZW1vdmVEb3RTZWdtZW50cyhzKTtcblx0XHR9XG5cblx0XHRpZiAoYXV0aG9yaXR5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHMgPSBzLnJlcGxhY2UoL15cXC9cXC8vLCBcIi8lMkZcIik7ICAvL2Rvbid0IGFsbG93IHRoZSBwYXRoIHRvIHN0YXJ0IHdpdGggXCIvL1wiXG5cdFx0fVxuXG5cdFx0dXJpVG9rZW5zLnB1c2gocyk7XG5cdH1cblxuXHRpZiAoY29tcG9uZW50cy5xdWVyeSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dXJpVG9rZW5zLnB1c2goXCI/XCIpO1xuXHRcdHVyaVRva2Vucy5wdXNoKGNvbXBvbmVudHMucXVlcnkpO1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudHMuZnJhZ21lbnQgIT09IHVuZGVmaW5lZCkge1xuXHRcdHVyaVRva2Vucy5wdXNoKFwiI1wiKTtcblx0XHR1cmlUb2tlbnMucHVzaChjb21wb25lbnRzLmZyYWdtZW50KTtcblx0fVxuXG5cdHJldHVybiB1cmlUb2tlbnMuam9pbihcIlwiKTsgIC8vbWVyZ2UgdG9rZW5zIGludG8gYSBzdHJpbmdcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQ29tcG9uZW50cyhiYXNlOlVSSUNvbXBvbmVudHMsIHJlbGF0aXZlOlVSSUNvbXBvbmVudHMsIG9wdGlvbnM6VVJJT3B0aW9ucyA9IHt9LCBza2lwTm9ybWFsaXphdGlvbj86Ym9vbGVhbik6VVJJQ29tcG9uZW50cyB7XG5cdGNvbnN0IHRhcmdldDpVUklDb21wb25lbnRzID0ge307XG5cblx0aWYgKCFza2lwTm9ybWFsaXphdGlvbikge1xuXHRcdGJhc2UgPSBwYXJzZShzZXJpYWxpemUoYmFzZSwgb3B0aW9ucyksIG9wdGlvbnMpOyAgLy9ub3JtYWxpemUgYmFzZSBjb21wb25lbnRzXG5cdFx0cmVsYXRpdmUgPSBwYXJzZShzZXJpYWxpemUocmVsYXRpdmUsIG9wdGlvbnMpLCBvcHRpb25zKTsgIC8vbm9ybWFsaXplIHJlbGF0aXZlIGNvbXBvbmVudHNcblx0fVxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRpZiAoIW9wdGlvbnMudG9sZXJhbnQgJiYgcmVsYXRpdmUuc2NoZW1lKSB7XG5cdFx0dGFyZ2V0LnNjaGVtZSA9IHJlbGF0aXZlLnNjaGVtZTtcblx0XHQvL3RhcmdldC5hdXRob3JpdHkgPSByZWxhdGl2ZS5hdXRob3JpdHk7XG5cdFx0dGFyZ2V0LnVzZXJpbmZvID0gcmVsYXRpdmUudXNlcmluZm87XG5cdFx0dGFyZ2V0Lmhvc3QgPSByZWxhdGl2ZS5ob3N0O1xuXHRcdHRhcmdldC5wb3J0ID0gcmVsYXRpdmUucG9ydDtcblx0XHR0YXJnZXQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHJlbGF0aXZlLnBhdGggfHwgXCJcIik7XG5cdFx0dGFyZ2V0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHJlbGF0aXZlLnVzZXJpbmZvICE9PSB1bmRlZmluZWQgfHwgcmVsYXRpdmUuaG9zdCAhPT0gdW5kZWZpbmVkIHx8IHJlbGF0aXZlLnBvcnQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly90YXJnZXQuYXV0aG9yaXR5ID0gcmVsYXRpdmUuYXV0aG9yaXR5O1xuXHRcdFx0dGFyZ2V0LnVzZXJpbmZvID0gcmVsYXRpdmUudXNlcmluZm87XG5cdFx0XHR0YXJnZXQuaG9zdCA9IHJlbGF0aXZlLmhvc3Q7XG5cdFx0XHR0YXJnZXQucG9ydCA9IHJlbGF0aXZlLnBvcnQ7XG5cdFx0XHR0YXJnZXQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHJlbGF0aXZlLnBhdGggfHwgXCJcIik7XG5cdFx0XHR0YXJnZXQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFyZWxhdGl2ZS5wYXRoKSB7XG5cdFx0XHRcdHRhcmdldC5wYXRoID0gYmFzZS5wYXRoO1xuXHRcdFx0XHRpZiAocmVsYXRpdmUucXVlcnkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRhcmdldC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRhcmdldC5xdWVyeSA9IGJhc2UucXVlcnk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChyZWxhdGl2ZS5wYXRoLmNoYXJBdCgwKSA9PT0gXCIvXCIpIHtcblx0XHRcdFx0XHR0YXJnZXQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHJlbGF0aXZlLnBhdGgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICgoYmFzZS51c2VyaW5mbyAhPT0gdW5kZWZpbmVkIHx8IGJhc2UuaG9zdCAhPT0gdW5kZWZpbmVkIHx8IGJhc2UucG9ydCAhPT0gdW5kZWZpbmVkKSAmJiAhYmFzZS5wYXRoKSB7XG5cdFx0XHRcdFx0XHR0YXJnZXQucGF0aCA9IFwiL1wiICsgcmVsYXRpdmUucGF0aDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFiYXNlLnBhdGgpIHtcblx0XHRcdFx0XHRcdHRhcmdldC5wYXRoID0gcmVsYXRpdmUucGF0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGFyZ2V0LnBhdGggPSBiYXNlLnBhdGguc2xpY2UoMCwgYmFzZS5wYXRoLmxhc3RJbmRleE9mKFwiL1wiKSArIDEpICsgcmVsYXRpdmUucGF0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGFyZ2V0LnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyh0YXJnZXQucGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGFyZ2V0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG5cdFx0XHR9XG5cdFx0XHQvL3RhcmdldC5hdXRob3JpdHkgPSBiYXNlLmF1dGhvcml0eTtcblx0XHRcdHRhcmdldC51c2VyaW5mbyA9IGJhc2UudXNlcmluZm87XG5cdFx0XHR0YXJnZXQuaG9zdCA9IGJhc2UuaG9zdDtcblx0XHRcdHRhcmdldC5wb3J0ID0gYmFzZS5wb3J0O1xuXHRcdH1cblx0XHR0YXJnZXQuc2NoZW1lID0gYmFzZS5zY2hlbWU7XG5cdH1cblxuXHR0YXJnZXQuZnJhZ21lbnQgPSByZWxhdGl2ZS5mcmFnbWVudDtcblxuXHRyZXR1cm4gdGFyZ2V0O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmUoYmFzZVVSSTpzdHJpbmcsIHJlbGF0aXZlVVJJOnN0cmluZywgb3B0aW9ucz86VVJJT3B0aW9ucyk6c3RyaW5nIHtcblx0Y29uc3Qgc2NoZW1lbGVzc09wdGlvbnMgPSBhc3NpZ24oeyBzY2hlbWUgOiAnbnVsbCcgfSwgb3B0aW9ucyk7XG5cdHJldHVybiBzZXJpYWxpemUocmVzb2x2ZUNvbXBvbmVudHMocGFyc2UoYmFzZVVSSSwgc2NoZW1lbGVzc09wdGlvbnMpLCBwYXJzZShyZWxhdGl2ZVVSSSwgc2NoZW1lbGVzc09wdGlvbnMpLCBzY2hlbWVsZXNzT3B0aW9ucywgdHJ1ZSksIHNjaGVtZWxlc3NPcHRpb25zKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUodXJpOnN0cmluZywgb3B0aW9ucz86VVJJT3B0aW9ucyk6c3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSh1cmk6VVJJQ29tcG9uZW50cywgb3B0aW9ucz86VVJJT3B0aW9ucyk6VVJJQ29tcG9uZW50cztcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUodXJpOmFueSwgb3B0aW9ucz86VVJJT3B0aW9ucyk6YW55IHtcblx0aWYgKHR5cGVvZiB1cmkgPT09IFwic3RyaW5nXCIpIHtcblx0XHR1cmkgPSBzZXJpYWxpemUocGFyc2UodXJpLCBvcHRpb25zKSwgb3B0aW9ucyk7XG5cdH0gZWxzZSBpZiAodHlwZU9mKHVyaSkgPT09IFwib2JqZWN0XCIpIHtcblx0XHR1cmkgPSBwYXJzZShzZXJpYWxpemUoPFVSSUNvbXBvbmVudHM+dXJpLCBvcHRpb25zKSwgb3B0aW9ucyk7XG5cdH1cblxuXHRyZXR1cm4gdXJpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsKHVyaUE6c3RyaW5nLCB1cmlCOnN0cmluZywgb3B0aW9ucz86IFVSSU9wdGlvbnMpOmJvb2xlYW47XG5leHBvcnQgZnVuY3Rpb24gZXF1YWwodXJpQTpVUklDb21wb25lbnRzLCB1cmlCOlVSSUNvbXBvbmVudHMsIG9wdGlvbnM/OlVSSU9wdGlvbnMpOmJvb2xlYW47XG5leHBvcnQgZnVuY3Rpb24gZXF1YWwodXJpQTphbnksIHVyaUI6YW55LCBvcHRpb25zPzpVUklPcHRpb25zKTpib29sZWFuIHtcblx0aWYgKHR5cGVvZiB1cmlBID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dXJpQSA9IHNlcmlhbGl6ZShwYXJzZSh1cmlBLCBvcHRpb25zKSwgb3B0aW9ucyk7XG5cdH0gZWxzZSBpZiAodHlwZU9mKHVyaUEpID09PSBcIm9iamVjdFwiKSB7XG5cdFx0dXJpQSA9IHNlcmlhbGl6ZSg8VVJJQ29tcG9uZW50cz51cmlBLCBvcHRpb25zKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgdXJpQiA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHVyaUIgPSBzZXJpYWxpemUocGFyc2UodXJpQiwgb3B0aW9ucyksIG9wdGlvbnMpO1xuXHR9IGVsc2UgaWYgKHR5cGVPZih1cmlCKSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHVyaUIgPSBzZXJpYWxpemUoPFVSSUNvbXBvbmVudHM+dXJpQiwgb3B0aW9ucyk7XG5cdH1cblxuXHRyZXR1cm4gdXJpQSA9PT0gdXJpQjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVDb21wb25lbnQoc3RyOnN0cmluZywgb3B0aW9ucz86VVJJT3B0aW9ucyk6c3RyaW5nIHtcblx0cmV0dXJuIHN0ciAmJiBzdHIudG9TdHJpbmcoKS5yZXBsYWNlKCghb3B0aW9ucyB8fCAhb3B0aW9ucy5pcmkgPyBVUklfUFJPVE9DT0wuRVNDQVBFIDogSVJJX1BST1RPQ09MLkVTQ0FQRSksIHBjdEVuY0NoYXIpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlQ29tcG9uZW50KHN0cjpzdHJpbmcsIG9wdGlvbnM/OlVSSU9wdGlvbnMpOnN0cmluZyB7XG5cdHJldHVybiBzdHIgJiYgc3RyLnRvU3RyaW5nKCkucmVwbGFjZSgoIW9wdGlvbnMgfHwgIW9wdGlvbnMuaXJpID8gVVJJX1BST1RPQ09MLlBDVF9FTkNPREVEIDogSVJJX1BST1RPQ09MLlBDVF9FTkNPREVEKSwgcGN0RGVjQ2hhcnMpO1xufTtcbiJdfQ==