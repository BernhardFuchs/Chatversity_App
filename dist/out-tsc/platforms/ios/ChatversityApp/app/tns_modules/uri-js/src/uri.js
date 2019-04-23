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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvdXJpLWpzL3NyYy91cmkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFFSCw2Q0FBeUM7QUFDekMsNkNBQXlDO0FBQ3pDLHFDQUFnQztBQUNoQywrQkFBcUQ7QUFpRHhDLFFBQUEsT0FBTyxHQUFzQyxFQUFFLENBQUM7QUFFN0QsU0FBZ0IsVUFBVSxDQUFDLEdBQVU7SUFDcEMsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixJQUFJLENBQVEsQ0FBQztJQUViLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDL0MsSUFBSSxDQUFDLEdBQUcsR0FBRztRQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwRCxJQUFJLENBQUMsR0FBRyxJQUFJO1FBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7O1FBQ3hILENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFB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bUI7SUFDOUQsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMscUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHFCQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDMUgsQ0FBQztBQUZELDBDQUVDO0FBQUEsQ0FBQztBQUVGLFNBQWdCLGlCQUFpQixDQUFDLEdBQVUsRUFBRSxPQUFtQjtJQUNoRSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMscUJBQVksQ0FBQyxXQUFXLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNySSxDQUFDO0FBRkQsOENBRUM7QUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVUkkuanNcbiAqXG4gKiBAZmlsZW92ZXJ2aWV3IEFuIFJGQyAzOTg2IGNvbXBsaWFudCwgc2NoZW1lIGV4dGVuZGFibGUgVVJJIHBhcnNpbmcvdmFsaWRhdGluZy9yZXNvbHZpbmcgbGlicmFyeSBmb3IgSmF2YVNjcmlwdC5cbiAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpnYXJ5LmNvdXJ0QGdtYWlsLmNvbVwiPkdhcnkgQ291cnQ8L2E+XG4gKiBAc2VlIGh0dHA6Ly9naXRodWIuY29tL2dhcnljb3VydC91cmktanNcbiAqL1xuXG4vKipcbiAqIENvcHlyaWdodCAyMDExIEdhcnkgQ291cnQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgYXJlXG4gKiBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAgICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZlxuICogICAgICAgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICpcbiAqICAgIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0XG4gKiAgICAgICBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFsc1xuICogICAgICAgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgR0FSWSBDT1VSVCBgYEFTIElTJycgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRURcbiAqIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkRcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBHQVJZIENPVVJUIE9SXG4gKiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUlxuICogQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUlxuICogU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuICogQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xuICogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGXG4gKiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqXG4gKiBUaGUgdmlld3MgYW5kIGNvbmNsdXNpb25zIGNvbnRhaW5lZCBpbiB0aGUgc29mdHdhcmUgYW5kIGRvY3VtZW50YXRpb24gYXJlIHRob3NlIG9mIHRoZVxuICogYXV0aG9ycyBhbmQgc2hvdWxkIG5vdCBiZSBpbnRlcnByZXRlZCBhcyByZXByZXNlbnRpbmcgb2ZmaWNpYWwgcG9saWNpZXMsIGVpdGhlciBleHByZXNzZWRcbiAqIG9yIGltcGxpZWQsIG9mIEdhcnkgQ291cnQuXG4gKi9cblxuaW1wb3J0IFVSSV9QUk9UT0NPTCBmcm9tIFwiLi9yZWdleHBzLXVyaVwiO1xuaW1wb3J0IElSSV9QUk9UT0NPTCBmcm9tIFwiLi9yZWdleHBzLWlyaVwiO1xuaW1wb3J0IHB1bnljb2RlIGZyb20gXCJwdW55Y29kZVwiO1xuaW1wb3J0IHsgdG9VcHBlckNhc2UsIHR5cGVPZiwgYXNzaWduIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVSSUNvbXBvbmVudHMge1xuXHRzY2hlbWU/OnN0cmluZztcblx0dXNlcmluZm8/OnN0cmluZztcblx0aG9zdD86c3RyaW5nO1xuXHRwb3J0PzpudW1iZXJ8c3RyaW5nO1xuXHRwYXRoPzpzdHJpbmc7XG5cdHF1ZXJ5PzpzdHJpbmc7XG5cdGZyYWdtZW50PzpzdHJpbmc7XG5cdHJlZmVyZW5jZT86c3RyaW5nO1xuXHRlcnJvcj86c3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVSSU9wdGlvbnMge1xuXHRzY2hlbWU/OnN0cmluZztcblx0cmVmZXJlbmNlPzpzdHJpbmc7XG5cdHRvbGVyYW50Pzpib29sZWFuO1xuXHRhYnNvbHV0ZVBhdGg/OmJvb2xlYW47XG5cdGlyaT86Ym9vbGVhbjtcblx0dW5pY29kZVN1cHBvcnQ/OmJvb2xlYW47XG5cdGRvbWFpbkhvc3Q/OmJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVVJJU2NoZW1lSGFuZGxlcjxDb21wb25lbnRzIGV4dGVuZHMgVVJJQ29tcG9uZW50cyA9IFVSSUNvbXBvbmVudHMsIE9wdGlvbnMgZXh0ZW5kcyBVUklPcHRpb25zID0gVVJJT3B0aW9ucywgUGFyZW50Q29tcG9uZW50cyBleHRlbmRzIFVSSUNvbXBvbmVudHMgPSBVUklDb21wb25lbnRzPiB7XG5cdHNjaGVtZTpzdHJpbmc7XG5cdHBhcnNlKGNvbXBvbmVudHM6UGFyZW50Q29tcG9uZW50cywgb3B0aW9uczpPcHRpb25zKTpDb21wb25lbnRzO1xuXHRzZXJpYWxpemUoY29tcG9uZW50czpDb21wb25lbnRzLCBvcHRpb25zOk9wdGlvbnMpOlBhcmVudENvbXBvbmVudHM7XG5cdHVuaWNvZGVTdXBwb3J0Pzpib29sZWFuO1xuXHRkb21haW5Ib3N0Pzpib29sZWFuO1xuXHRhYnNvbHV0ZVBhdGg/OmJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVVJJUmVnRXhwcyB7XG5cdE5PVF9TQ0hFTUUgOiBSZWdFeHAsXG5cdE5PVF9VU0VSSU5GTyA6IFJlZ0V4cCxcblx0Tk9UX0hPU1QgOiBSZWdFeHAsXG5cdE5PVF9QQVRIIDogUmVnRXhwLFxuXHROT1RfUEFUSF9OT1NDSEVNRSA6IFJlZ0V4cCxcblx0Tk9UX1FVRVJZIDogUmVnRXhwLFxuXHROT1RfRlJBR01FTlQgOiBSZWdFeHAsXG5cdEVTQ0FQRSA6IFJlZ0V4cCxcblx0VU5SRVNFUlZFRCA6IFJlZ0V4cCxcblx0T1RIRVJfQ0hBUlMgOiBSZWdFeHAsXG5cdFBDVF9FTkNPREVEIDogUmVnRXhwLFxuXHRJUFY0QUREUkVTUyA6IFJlZ0V4cCxcblx0SVBWNkFERFJFU1MgOiBSZWdFeHAsXG59XG5cbmV4cG9ydCBjb25zdCBTQ0hFTUVTOntbc2NoZW1lOnN0cmluZ106VVJJU2NoZW1lSGFuZGxlcn0gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBjdEVuY0NoYXIoY2hyOnN0cmluZyk6c3RyaW5nIHtcblx0Y29uc3QgYyA9IGNoci5jaGFyQ29kZUF0KDApO1xuXHRsZXQgZTpzdHJpbmc7XG5cblx0aWYgKGMgPCAxNikgZSA9IFwiJTBcIiArIGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdGVsc2UgaWYgKGMgPCAxMjgpIGUgPSBcIiVcIiArIGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdGVsc2UgaWYgKGMgPCAyMDQ4KSBlID0gXCIlXCIgKyAoKGMgPj4gNikgfCAxOTIpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpICsgXCIlXCIgKyAoKGMgJiA2MykgfCAxMjgpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXHRlbHNlIGUgPSBcIiVcIiArICgoYyA+PiAxMikgfCAyMjQpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpICsgXCIlXCIgKyAoKChjID4+IDYpICYgNjMpIHwgMTI4KS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKSArIFwiJVwiICsgKChjICYgNjMpIHwgMTI4KS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblxuXHRyZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBjdERlY0NoYXJzKHN0cjpzdHJpbmcpOnN0cmluZyB7XG5cdGxldCBuZXdTdHIgPSBcIlwiO1xuXHRsZXQgaSA9IDA7XG5cdGNvbnN0IGlsID0gc3RyLmxlbmd0aDtcblxuXHR3aGlsZSAoaSA8IGlsKSB7XG5cdFx0Y29uc3QgYyA9IHBhcnNlSW50KHN0ci5zdWJzdHIoaSArIDEsIDIpLCAxNik7XG5cblx0XHRpZiAoYyA8IDEyOCkge1xuXHRcdFx0bmV3U3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG5cdFx0XHRpICs9IDM7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGMgPj0gMTk0ICYmIGMgPCAyMjQpIHtcblx0XHRcdGlmICgoaWwgLSBpKSA+PSA2KSB7XG5cdFx0XHRcdGNvbnN0IGMyID0gcGFyc2VJbnQoc3RyLnN1YnN0cihpICsgNCwgMiksIDE2KTtcblx0XHRcdFx0bmV3U3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyKGksIDYpO1xuXHRcdFx0fVxuXHRcdFx0aSArPSA2O1xuXHRcdH1cblx0XHRlbHNlIGlmIChjID49IDIyNCkge1xuXHRcdFx0aWYgKChpbCAtIGkpID49IDkpIHtcblx0XHRcdFx0Y29uc3QgYzIgPSBwYXJzZUludChzdHIuc3Vic3RyKGkgKyA0LCAyKSwgMTYpO1xuXHRcdFx0XHRjb25zdCBjMyA9IHBhcnNlSW50KHN0ci5zdWJzdHIoaSArIDcsIDIpLCAxNik7XG5cdFx0XHRcdG5ld1N0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyKGksIDkpO1xuXHRcdFx0fVxuXHRcdFx0aSArPSA5O1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyKGksIDMpO1xuXHRcdFx0aSArPSAzO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBuZXdTdHI7XG59XG5cbmZ1bmN0aW9uIF9ub3JtYWxpemVDb21wb25lbnRFbmNvZGluZyhjb21wb25lbnRzOlVSSUNvbXBvbmVudHMsIHByb3RvY29sOlVSSVJlZ0V4cHMpIHtcblx0ZnVuY3Rpb24gZGVjb2RlVW5yZXNlcnZlZChzdHI6c3RyaW5nKTpzdHJpbmcge1xuXHRcdGNvbnN0IGRlY1N0ciA9IHBjdERlY0NoYXJzKHN0cik7XG5cdFx0cmV0dXJuICghZGVjU3RyLm1hdGNoKHByb3RvY29sLlVOUkVTRVJWRUQpID8gc3RyIDogZGVjU3RyKTtcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLnNjaGVtZSkgY29tcG9uZW50cy5zY2hlbWUgPSBTdHJpbmcoY29tcG9uZW50cy5zY2hlbWUpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIGRlY29kZVVucmVzZXJ2ZWQpLnRvTG93ZXJDYXNlKCkucmVwbGFjZShwcm90b2NvbC5OT1RfU0NIRU1FLCBcIlwiKTtcblx0aWYgKGNvbXBvbmVudHMudXNlcmluZm8gIT09IHVuZGVmaW5lZCkgY29tcG9uZW50cy51c2VyaW5mbyA9IFN0cmluZyhjb21wb25lbnRzLnVzZXJpbmZvKS5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCBkZWNvZGVVbnJlc2VydmVkKS5yZXBsYWNlKHByb3RvY29sLk5PVF9VU0VSSU5GTywgcGN0RW5jQ2hhcikucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgdG9VcHBlckNhc2UpO1xuXHRpZiAoY29tcG9uZW50cy5ob3N0ICE9PSB1bmRlZmluZWQpIGNvbXBvbmVudHMuaG9zdCA9IFN0cmluZyhjb21wb25lbnRzLmhvc3QpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIGRlY29kZVVucmVzZXJ2ZWQpLnRvTG93ZXJDYXNlKCkucmVwbGFjZShwcm90b2NvbC5OT1RfSE9TVCwgcGN0RW5jQ2hhcikucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgdG9VcHBlckNhc2UpO1xuXHRpZiAoY29tcG9uZW50cy5wYXRoICE9PSB1bmRlZmluZWQpIGNvbXBvbmVudHMucGF0aCA9IFN0cmluZyhjb21wb25lbnRzLnBhdGgpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIGRlY29kZVVucmVzZXJ2ZWQpLnJlcGxhY2UoKGNvbXBvbmVudHMuc2NoZW1lID8gcHJvdG9jb2wuTk9UX1BBVEggOiBwcm90b2NvbC5OT1RfUEFUSF9OT1NDSEVNRSksIHBjdEVuY0NoYXIpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIHRvVXBwZXJDYXNlKTtcblx0aWYgKGNvbXBvbmVudHMucXVlcnkgIT09IHVuZGVmaW5lZCkgY29tcG9uZW50cy5xdWVyeSA9IFN0cmluZyhjb21wb25lbnRzLnF1ZXJ5KS5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCBkZWNvZGVVbnJlc2VydmVkKS5yZXBsYWNlKHByb3RvY29sLk5PVF9RVUVSWSwgcGN0RW5jQ2hhcikucmVwbGFjZShwcm90b2NvbC5QQ1RfRU5DT0RFRCwgdG9VcHBlckNhc2UpO1xuXHRpZiAoY29tcG9uZW50cy5mcmFnbWVudCAhPT0gdW5kZWZpbmVkKSBjb21wb25lbnRzLmZyYWdtZW50ID0gU3RyaW5nKGNvbXBvbmVudHMuZnJhZ21lbnQpLnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIGRlY29kZVVucmVzZXJ2ZWQpLnJlcGxhY2UocHJvdG9jb2wuTk9UX0ZSQUdNRU5ULCBwY3RFbmNDaGFyKS5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCB0b1VwcGVyQ2FzZSk7XG5cblx0cmV0dXJuIGNvbXBvbmVudHM7XG59O1xuXG5mdW5jdGlvbiBfc3RyaXBMZWFkaW5nWmVyb3Moc3RyOnN0cmluZyk6c3RyaW5nIHtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9eMCooLiopLywgXCIkMVwiKSB8fCBcIjBcIjtcbn1cblxuZnVuY3Rpb24gX25vcm1hbGl6ZUlQdjQoaG9zdDpzdHJpbmcsIHByb3RvY29sOlVSSVJlZ0V4cHMpOnN0cmluZyB7XG5cdGNvbnN0IG1hdGNoZXMgPSBob3N0Lm1hdGNoKHByb3RvY29sLklQVjRBRERSRVNTKSB8fCBbXTtcblx0Y29uc3QgWywgYWRkcmVzc10gPSBtYXRjaGVzO1xuXHRcblx0aWYgKGFkZHJlc3MpIHtcblx0XHRyZXR1cm4gYWRkcmVzcy5zcGxpdChcIi5cIikubWFwKF9zdHJpcExlYWRpbmdaZXJvcykuam9pbihcIi5cIik7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGhvc3Q7XG5cdH1cbn1cblxuZnVuY3Rpb24gX25vcm1hbGl6ZUlQdjYoaG9zdDpzdHJpbmcsIHByb3RvY29sOlVSSVJlZ0V4cHMpOnN0cmluZyB7XG5cdGNvbnN0IG1hdGNoZXMgPSBob3N0Lm1hdGNoKHByb3RvY29sLklQVjZBRERSRVNTKSB8fCBbXTtcblx0Y29uc3QgWywgYWRkcmVzcywgem9uZV0gPSBtYXRjaGVzO1xuXG5cdGlmIChhZGRyZXNzKSB7XG5cdFx0Y29uc3QgW2xhc3QsIGZpcnN0XSA9IGFkZHJlc3MudG9Mb3dlckNhc2UoKS5zcGxpdCgnOjonKS5yZXZlcnNlKCk7XG5cdFx0Y29uc3QgZmlyc3RGaWVsZHMgPSBmaXJzdCA/IGZpcnN0LnNwbGl0KFwiOlwiKS5tYXAoX3N0cmlwTGVhZGluZ1plcm9zKSA6IFtdO1xuXHRcdGNvbnN0IGxhc3RGaWVsZHMgPSBsYXN0LnNwbGl0KFwiOlwiKS5tYXAoX3N0cmlwTGVhZGluZ1plcm9zKTtcblx0XHRjb25zdCBpc0xhc3RGaWVsZElQdjRBZGRyZXNzID0gcHJvdG9jb2wuSVBWNEFERFJFU1MudGVzdChsYXN0RmllbGRzW2xhc3RGaWVsZHMubGVuZ3RoIC0gMV0pO1xuXHRcdGNvbnN0IGZpZWxkQ291bnQgPSBpc0xhc3RGaWVsZElQdjRBZGRyZXNzID8gNyA6IDg7XG5cdFx0Y29uc3QgbGFzdEZpZWxkc1N0YXJ0ID0gbGFzdEZpZWxkcy5sZW5ndGggLSBmaWVsZENvdW50O1xuXHRcdGNvbnN0IGZpZWxkcyA9IEFycmF5PHN0cmluZz4oZmllbGRDb3VudCk7XG5cblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGZpZWxkQ291bnQ7ICsreCkge1xuXHRcdFx0ZmllbGRzW3hdID0gZmlyc3RGaWVsZHNbeF0gfHwgbGFzdEZpZWxkc1tsYXN0RmllbGRzU3RhcnQgKyB4XSB8fCAnJztcblx0XHR9XG5cblx0XHRpZiAoaXNMYXN0RmllbGRJUHY0QWRkcmVzcykge1xuXHRcdFx0ZmllbGRzW2ZpZWxkQ291bnQgLSAxXSA9IF9ub3JtYWxpemVJUHY0KGZpZWxkc1tmaWVsZENvdW50IC0gMV0sIHByb3RvY29sKTtcblx0XHR9XG5cblx0XHRjb25zdCBhbGxaZXJvRmllbGRzID0gZmllbGRzLnJlZHVjZTxBcnJheTx7aW5kZXg6bnVtYmVyLGxlbmd0aDpudW1iZXJ9Pj4oKGFjYywgZmllbGQsIGluZGV4KSA9PiB7XG5cdFx0XHRpZiAoIWZpZWxkIHx8IGZpZWxkID09PSBcIjBcIikge1xuXHRcdFx0XHRjb25zdCBsYXN0TG9uZ2VzdCA9IGFjY1thY2MubGVuZ3RoIC0gMV07XG5cdFx0XHRcdGlmIChsYXN0TG9uZ2VzdCAmJiBsYXN0TG9uZ2VzdC5pbmRleCArIGxhc3RMb25nZXN0Lmxlbmd0aCA9PT0gaW5kZXgpIHtcblx0XHRcdFx0XHRsYXN0TG9uZ2VzdC5sZW5ndGgrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhY2MucHVzaCh7IGluZGV4LCBsZW5ndGggOiAxIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYWNjO1xuXHRcdH0sIFtdKTtcblxuXHRcdGNvbnN0IGxvbmdlc3RaZXJvRmllbGRzID0gYWxsWmVyb0ZpZWxkcy5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKVswXTtcblxuXHRcdGxldCBuZXdIb3N0OnN0cmluZztcblx0XHRpZiAobG9uZ2VzdFplcm9GaWVsZHMgJiYgbG9uZ2VzdFplcm9GaWVsZHMubGVuZ3RoID4gMSkge1xuXHRcdFx0Y29uc3QgbmV3Rmlyc3QgPSBmaWVsZHMuc2xpY2UoMCwgbG9uZ2VzdFplcm9GaWVsZHMuaW5kZXgpIDtcblx0XHRcdGNvbnN0IG5ld0xhc3QgPSBmaWVsZHMuc2xpY2UobG9uZ2VzdFplcm9GaWVsZHMuaW5kZXggKyBsb25nZXN0WmVyb0ZpZWxkcy5sZW5ndGgpO1xuXHRcdFx0bmV3SG9zdCA9IG5ld0ZpcnN0LmpvaW4oXCI6XCIpICsgXCI6OlwiICsgbmV3TGFzdC5qb2luKFwiOlwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3SG9zdCA9IGZpZWxkcy5qb2luKFwiOlwiKTtcblx0XHR9XG5cblx0XHRpZiAoem9uZSkge1xuXHRcdFx0bmV3SG9zdCArPSBcIiVcIiArIHpvbmU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ld0hvc3Q7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGhvc3Q7XG5cdH1cbn1cblxuY29uc3QgVVJJX1BBUlNFID0gL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KFteXFwvPyNAXSopQCk/KFxcW1teXFwvPyNcXF1dK1xcXXxbXlxcLz8jOl0qKSg/OlxcOihcXGQqKSk/KSk/KFtePyNdKikoPzpcXD8oW14jXSopKT8oPzojKCg/Oi58XFxufFxccikqKSk/L2k7XG5jb25zdCBOT19NQVRDSF9JU19VTkRFRklORUQgPSAoPFJlZ0V4cE1hdGNoQXJyYXk+KFwiXCIpLm1hdGNoKC8oKXswfS8pKVsxXSA9PT0gdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2UodXJpU3RyaW5nOnN0cmluZywgb3B0aW9uczpVUklPcHRpb25zID0ge30pOlVSSUNvbXBvbmVudHMge1xuXHRjb25zdCBjb21wb25lbnRzOlVSSUNvbXBvbmVudHMgPSB7fTtcblx0Y29uc3QgcHJvdG9jb2wgPSAob3B0aW9ucy5pcmkgIT09IGZhbHNlID8gSVJJX1BST1RPQ09MIDogVVJJX1BST1RPQ09MKTtcblxuXHRpZiAob3B0aW9ucy5yZWZlcmVuY2UgPT09IFwic3VmZml4XCIpIHVyaVN0cmluZyA9IChvcHRpb25zLnNjaGVtZSA/IG9wdGlvbnMuc2NoZW1lICsgXCI6XCIgOiBcIlwiKSArIFwiLy9cIiArIHVyaVN0cmluZztcblxuXHRjb25zdCBtYXRjaGVzID0gdXJpU3RyaW5nLm1hdGNoKFVSSV9QQVJTRSk7XG5cblx0aWYgKG1hdGNoZXMpIHtcblx0XHRpZiAoTk9fTUFUQ0hfSVNfVU5ERUZJTkVEKSB7XG5cdFx0XHQvL3N0b3JlIGVhY2ggY29tcG9uZW50XG5cdFx0XHRjb21wb25lbnRzLnNjaGVtZSA9IG1hdGNoZXNbMV07XG5cdFx0XHRjb21wb25lbnRzLnVzZXJpbmZvID0gbWF0Y2hlc1szXTtcblx0XHRcdGNvbXBvbmVudHMuaG9zdCA9IG1hdGNoZXNbNF07XG5cdFx0XHRjb21wb25lbnRzLnBvcnQgPSBwYXJzZUludChtYXRjaGVzWzVdLCAxMCk7XG5cdFx0XHRjb21wb25lbnRzLnBhdGggPSBtYXRjaGVzWzZdIHx8IFwiXCI7XG5cdFx0XHRjb21wb25lbnRzLnF1ZXJ5ID0gbWF0Y2hlc1s3XTtcblx0XHRcdGNvbXBvbmVudHMuZnJhZ21lbnQgPSBtYXRjaGVzWzhdO1xuXG5cdFx0XHQvL2ZpeCBwb3J0IG51bWJlclxuXHRcdFx0aWYgKGlzTmFOKGNvbXBvbmVudHMucG9ydCkpIHtcblx0XHRcdFx0Y29tcG9uZW50cy5wb3J0ID0gbWF0Y2hlc1s1XTtcblx0XHRcdH1cblx0XHR9IGVsc2UgeyAgLy9JRSBGSVggZm9yIGltcHJvcGVyIFJlZ0V4cCBtYXRjaGluZ1xuXHRcdFx0Ly9zdG9yZSBlYWNoIGNvbXBvbmVudFxuXHRcdFx0Y29tcG9uZW50cy5zY2hlbWUgPSBtYXRjaGVzWzFdIHx8IHVuZGVmaW5lZDtcblx0XHRcdGNvbXBvbmVudHMudXNlcmluZm8gPSAodXJpU3RyaW5nLmluZGV4T2YoXCJAXCIpICE9PSAtMSA/IG1hdGNoZXNbM10gOiB1bmRlZmluZWQpO1xuXHRcdFx0Y29tcG9uZW50cy5ob3N0ID0gKHVyaVN0cmluZy5pbmRleE9mKFwiLy9cIikgIT09IC0xID8gbWF0Y2hlc1s0XSA6IHVuZGVmaW5lZCk7XG5cdFx0XHRjb21wb25lbnRzLnBvcnQgPSBwYXJzZUludChtYXRjaGVzWzVdLCAxMCk7XG5cdFx0XHRjb21wb25lbnRzLnBhdGggPSBtYXRjaGVzWzZdIHx8IFwiXCI7XG5cdFx0XHRjb21wb25lbnRzLnF1ZXJ5ID0gKHVyaVN0cmluZy5pbmRleE9mKFwiP1wiKSAhPT0gLTEgPyBtYXRjaGVzWzddIDogdW5kZWZpbmVkKTtcblx0XHRcdGNvbXBvbmVudHMuZnJhZ21lbnQgPSAodXJpU3RyaW5nLmluZGV4T2YoXCIjXCIpICE9PSAtMSA/IG1hdGNoZXNbOF0gOiB1bmRlZmluZWQpO1xuXG5cdFx0XHQvL2ZpeCBwb3J0IG51bWJlclxuXHRcdFx0aWYgKGlzTmFOKGNvbXBvbmVudHMucG9ydCkpIHtcblx0XHRcdFx0Y29tcG9uZW50cy5wb3J0ID0gKHVyaVN0cmluZy5tYXRjaCgvXFwvXFwvKD86LnxcXG4pKlxcOig/OlxcL3xcXD98XFwjfCQpLykgPyBtYXRjaGVzWzRdIDogdW5kZWZpbmVkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoY29tcG9uZW50cy5ob3N0KSB7XG5cdFx0XHQvL25vcm1hbGl6ZSBJUCBob3N0c1xuXHRcdFx0Y29tcG9uZW50cy5ob3N0ID0gX25vcm1hbGl6ZUlQdjYoX25vcm1hbGl6ZUlQdjQoY29tcG9uZW50cy5ob3N0LCBwcm90b2NvbCksIHByb3RvY29sKTtcblx0XHR9XG5cblx0XHQvL2RldGVybWluZSByZWZlcmVuY2UgdHlwZVxuXHRcdGlmIChjb21wb25lbnRzLnNjaGVtZSA9PT0gdW5kZWZpbmVkICYmIGNvbXBvbmVudHMudXNlcmluZm8gPT09IHVuZGVmaW5lZCAmJiBjb21wb25lbnRzLmhvc3QgPT09IHVuZGVmaW5lZCAmJiBjb21wb25lbnRzLnBvcnQgPT09IHVuZGVmaW5lZCAmJiAhY29tcG9uZW50cy5wYXRoICYmIGNvbXBvbmVudHMucXVlcnkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Y29tcG9uZW50cy5yZWZlcmVuY2UgPSBcInNhbWUtZG9jdW1lbnRcIjtcblx0XHR9IGVsc2UgaWYgKGNvbXBvbmVudHMuc2NoZW1lID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGNvbXBvbmVudHMucmVmZXJlbmNlID0gXCJyZWxhdGl2ZVwiO1xuXHRcdH0gZWxzZSBpZiAoY29tcG9uZW50cy5mcmFnbWVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb21wb25lbnRzLnJlZmVyZW5jZSA9IFwiYWJzb2x1dGVcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29tcG9uZW50cy5yZWZlcmVuY2UgPSBcInVyaVwiO1xuXHRcdH1cblxuXHRcdC8vY2hlY2sgZm9yIHJlZmVyZW5jZSBlcnJvcnNcblx0XHRpZiAob3B0aW9ucy5yZWZlcmVuY2UgJiYgb3B0aW9ucy5yZWZlcmVuY2UgIT09IFwic3VmZml4XCIgJiYgb3B0aW9ucy5yZWZlcmVuY2UgIT09IGNvbXBvbmVudHMucmVmZXJlbmNlKSB7XG5cdFx0XHRjb21wb25lbnRzLmVycm9yID0gY29tcG9uZW50cy5lcnJvciB8fCBcIlVSSSBpcyBub3QgYSBcIiArIG9wdGlvbnMucmVmZXJlbmNlICsgXCIgcmVmZXJlbmNlLlwiO1xuXHRcdH1cblxuXHRcdC8vZmluZCBzY2hlbWUgaGFuZGxlclxuXHRcdGNvbnN0IHNjaGVtZUhhbmRsZXIgPSBTQ0hFTUVTWyhvcHRpb25zLnNjaGVtZSB8fCBjb21wb25lbnRzLnNjaGVtZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpXTtcblxuXHRcdC8vY2hlY2sgaWYgc2NoZW1lIGNhbid0IGhhbmRsZSBJUklzXG5cdFx0aWYgKCFvcHRpb25zLnVuaWNvZGVTdXBwb3J0ICYmICghc2NoZW1lSGFuZGxlciB8fCAhc2NoZW1lSGFuZGxlci51bmljb2RlU3VwcG9ydCkpIHtcblx0XHRcdC8vaWYgaG9zdCBjb21wb25lbnQgaXMgYSBkb21haW4gbmFtZVxuXHRcdFx0aWYgKGNvbXBvbmVudHMuaG9zdCAmJiAob3B0aW9ucy5kb21haW5Ib3N0IHx8IChzY2hlbWVIYW5kbGVyICYmIHNjaGVtZUhhbmRsZXIuZG9tYWluSG9zdCkpKSB7XG5cdFx0XHRcdC8vY29udmVydCBVbmljb2RlIElETiAtPiBBU0NJSSBJRE5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb21wb25lbnRzLmhvc3QgPSBwdW55Y29kZS50b0FTQ0lJKGNvbXBvbmVudHMuaG9zdC5yZXBsYWNlKHByb3RvY29sLlBDVF9FTkNPREVELCBwY3REZWNDaGFycykudG9Mb3dlckNhc2UoKSk7XG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRjb21wb25lbnRzLmVycm9yID0gY29tcG9uZW50cy5lcnJvciB8fCBcIkhvc3QncyBkb21haW4gbmFtZSBjYW4gbm90IGJlIGNvbnZlcnRlZCB0byBBU0NJSSB2aWEgcHVueWNvZGU6IFwiICsgZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9jb252ZXJ0IElSSSAtPiBVUklcblx0XHRcdF9ub3JtYWxpemVDb21wb25lbnRFbmNvZGluZyhjb21wb25lbnRzLCBVUklfUFJPVE9DT0wpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL25vcm1hbGl6ZSBlbmNvZGluZ3Ncblx0XHRcdF9ub3JtYWxpemVDb21wb25lbnRFbmNvZGluZyhjb21wb25lbnRzLCBwcm90b2NvbCk7XG5cdFx0fVxuXG5cdFx0Ly9wZXJmb3JtIHNjaGVtZSBzcGVjaWZpYyBwYXJzaW5nXG5cdFx0aWYgKHNjaGVtZUhhbmRsZXIgJiYgc2NoZW1lSGFuZGxlci5wYXJzZSkge1xuXHRcdFx0c2NoZW1lSGFuZGxlci5wYXJzZShjb21wb25lbnRzLCBvcHRpb25zKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Y29tcG9uZW50cy5lcnJvciA9IGNvbXBvbmVudHMuZXJyb3IgfHwgXCJVUkkgY2FuIG5vdCBiZSBwYXJzZWQuXCI7XG5cdH1cblxuXHRyZXR1cm4gY29tcG9uZW50cztcbn07XG5cbmZ1bmN0aW9uIF9yZWNvbXBvc2VBdXRob3JpdHkoY29tcG9uZW50czpVUklDb21wb25lbnRzLCBvcHRpb25zOlVSSU9wdGlvbnMpOnN0cmluZ3x1bmRlZmluZWQge1xuXHRjb25zdCBwcm90b2NvbCA9IChvcHRpb25zLmlyaSAhPT0gZmFsc2UgPyBJUklfUFJPVE9DT0wgOiBVUklfUFJPVE9DT0wpO1xuXHRjb25zdCB1cmlUb2tlbnM6QXJyYXk8c3RyaW5nPiA9IFtdO1xuXG5cdGlmIChjb21wb25lbnRzLnVzZXJpbmZvICE9PSB1bmRlZmluZWQpIHtcblx0XHR1cmlUb2tlbnMucHVzaChjb21wb25lbnRzLnVzZXJpbmZvKTtcblx0XHR1cmlUb2tlbnMucHVzaChcIkBcIik7XG5cdH1cblxuXHRpZiAoY29tcG9uZW50cy5ob3N0ICE9PSB1bmRlZmluZWQpIHtcblx0XHQvL25vcm1hbGl6ZSBJUCBob3N0cywgYWRkIGJyYWNrZXRzIGFuZCBlc2NhcGUgem9uZSBzZXBhcmF0b3IgZm9yIElQdjZcblx0XHR1cmlUb2tlbnMucHVzaChfbm9ybWFsaXplSVB2Nihfbm9ybWFsaXplSVB2NChTdHJpbmcoY29tcG9uZW50cy5ob3N0KSwgcHJvdG9jb2wpLCBwcm90b2NvbCkucmVwbGFjZShwcm90b2NvbC5JUFY2QUREUkVTUywgKF8sICQxLCAkMikgPT4gXCJbXCIgKyAkMSArICgkMiA/IFwiJTI1XCIgKyAkMiA6IFwiXCIpICsgXCJdXCIpKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgY29tcG9uZW50cy5wb3J0ID09PSBcIm51bWJlclwiKSB7XG5cdFx0dXJpVG9rZW5zLnB1c2goXCI6XCIpO1xuXHRcdHVyaVRva2Vucy5wdXNoKGNvbXBvbmVudHMucG9ydC50b1N0cmluZygxMCkpO1xuXHR9XG5cblx0cmV0dXJuIHVyaVRva2Vucy5sZW5ndGggPyB1cmlUb2tlbnMuam9pbihcIlwiKSA6IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IFJEUzEgPSAvXlxcLlxcLj9cXC8vO1xuY29uc3QgUkRTMiA9IC9eXFwvXFwuKFxcL3wkKS87XG5jb25zdCBSRFMzID0gL15cXC9cXC5cXC4oXFwvfCQpLztcbmNvbnN0IFJEUzQgPSAvXlxcLlxcLj8kLztcbmNvbnN0IFJEUzUgPSAvXlxcLz8oPzoufFxcbikqPyg/PVxcL3wkKS87XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhpbnB1dDpzdHJpbmcpOnN0cmluZyB7XG5cdGNvbnN0IG91dHB1dDpBcnJheTxzdHJpbmc+ID0gW107XG5cblx0d2hpbGUgKGlucHV0Lmxlbmd0aCkge1xuXHRcdGlmIChpbnB1dC5tYXRjaChSRFMxKSkge1xuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKFJEUzEsIFwiXCIpO1xuXHRcdH0gZWxzZSBpZiAoaW5wdXQubWF0Y2goUkRTMikpIHtcblx0XHRcdGlucHV0ID0gaW5wdXQucmVwbGFjZShSRFMyLCBcIi9cIik7XG5cdFx0fSBlbHNlIGlmIChpbnB1dC5tYXRjaChSRFMzKSkge1xuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKFJEUzMsIFwiL1wiKTtcblx0XHRcdG91dHB1dC5wb3AoKTtcblx0XHR9IGVsc2UgaWYgKGlucHV0ID09PSBcIi5cIiB8fCBpbnB1dCA9PT0gXCIuLlwiKSB7XG5cdFx0XHRpbnB1dCA9IFwiXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGltID0gaW5wdXQubWF0Y2goUkRTNSk7XG5cdFx0XHRpZiAoaW0pIHtcblx0XHRcdFx0Y29uc3QgcyA9IGltWzBdO1xuXHRcdFx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKHMubGVuZ3RoKTtcblx0XHRcdFx0b3V0cHV0LnB1c2gocyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGRvdCBzZWdtZW50IGNvbmRpdGlvblwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3V0cHV0LmpvaW4oXCJcIik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKGNvbXBvbmVudHM6VVJJQ29tcG9uZW50cywgb3B0aW9uczpVUklPcHRpb25zID0ge30pOnN0cmluZyB7XG5cdGNvbnN0IHByb3RvY29sID0gKG9wdGlvbnMuaXJpID8gSVJJX1BST1RPQ09MIDogVVJJX1BST1RPQ09MKTtcblx0Y29uc3QgdXJpVG9rZW5zOkFycmF5PHN0cmluZz4gPSBbXTtcblxuXHQvL2ZpbmQgc2NoZW1lIGhhbmRsZXJcblx0Y29uc3Qgc2NoZW1lSGFuZGxlciA9IFNDSEVNRVNbKG9wdGlvbnMuc2NoZW1lIHx8IGNvbXBvbmVudHMuc2NoZW1lIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCldO1xuXG5cdC8vcGVyZm9ybSBzY2hlbWUgc3BlY2lmaWMgc2VyaWFsaXphdGlvblxuXHRpZiAoc2NoZW1lSGFuZGxlciAmJiBzY2hlbWVIYW5kbGVyLnNlcmlhbGl6ZSkgc2NoZW1lSGFuZGxlci5zZXJpYWxpemUoY29tcG9uZW50cywgb3B0aW9ucyk7XG5cblx0aWYgKGNvbXBvbmVudHMuaG9zdCkge1xuXHRcdC8vaWYgaG9zdCBjb21wb25lbnQgaXMgYW4gSVB2NiBhZGRyZXNzXG5cdFx0aWYgKHByb3RvY29sLklQVjZBRERSRVNTLnRlc3QoY29tcG9uZW50cy5ob3N0KSkge1xuXHRcdFx0Ly9UT0RPOiBub3JtYWxpemUgSVB2NiBhZGRyZXNzIGFzIHBlciBSRkMgNTk1MlxuXHRcdH1cblxuXHRcdC8vaWYgaG9zdCBjb21wb25lbnQgaXMgYSBkb21haW4gbmFtZVxuXHRcdGVsc2UgaWYgKG9wdGlvbnMuZG9tYWluSG9zdCB8fCAoc2NoZW1lSGFuZGxlciAmJiBzY2hlbWVIYW5kbGVyLmRvbWFpbkhvc3QpKSB7XG5cdFx0XHQvL2NvbnZlcnQgSUROIHZpYSBwdW55Y29kZVxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29tcG9uZW50cy5ob3N0ID0gKCFvcHRpb25zLmlyaSA/IHB1bnljb2RlLnRvQVNDSUkoY29tcG9uZW50cy5ob3N0LnJlcGxhY2UocHJvdG9jb2wuUENUX0VOQ09ERUQsIHBjdERlY0NoYXJzKS50b0xvd2VyQ2FzZSgpKSA6IHB1bnljb2RlLnRvVW5pY29kZShjb21wb25lbnRzLmhvc3QpKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0Y29tcG9uZW50cy5lcnJvciA9IGNvbXBvbmVudHMuZXJyb3IgfHwgXCJIb3N0J3MgZG9tYWluIG5hbWUgY2FuIG5vdCBiZSBjb252ZXJ0ZWQgdG8gXCIgKyAoIW9wdGlvbnMuaXJpID8gXCJBU0NJSVwiIDogXCJVbmljb2RlXCIpICsgXCIgdmlhIHB1bnljb2RlOiBcIiArIGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly9ub3JtYWxpemUgZW5jb2Rpbmdcblx0X25vcm1hbGl6ZUNvbXBvbmVudEVuY29kaW5nKGNvbXBvbmVudHMsIHByb3RvY29sKTtcblxuXHRpZiAob3B0aW9ucy5yZWZlcmVuY2UgIT09IFwic3VmZml4XCIgJiYgY29tcG9uZW50cy5zY2hlbWUpIHtcblx0XHR1cmlUb2tlbnMucHVzaChjb21wb25lbnRzLnNjaGVtZSk7XG5cdFx0dXJpVG9rZW5zLnB1c2goXCI6XCIpO1xuXHR9XG5cblx0Y29uc3QgYXV0aG9yaXR5ID0gX3JlY29tcG9zZUF1dGhvcml0eShjb21wb25lbnRzLCBvcHRpb25zKTtcblx0aWYgKGF1dGhvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKG9wdGlvbnMucmVmZXJlbmNlICE9PSBcInN1ZmZpeFwiKSB7XG5cdFx0XHR1cmlUb2tlbnMucHVzaChcIi8vXCIpO1xuXHRcdH1cblxuXHRcdHVyaVRva2Vucy5wdXNoKGF1dGhvcml0eSk7XG5cblx0XHRpZiAoY29tcG9uZW50cy5wYXRoICYmIGNvbXBvbmVudHMucGF0aC5jaGFyQXQoMCkgIT09IFwiL1wiKSB7XG5cdFx0XHR1cmlUb2tlbnMucHVzaChcIi9cIik7XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNvbXBvbmVudHMucGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0bGV0IHMgPSBjb21wb25lbnRzLnBhdGg7XG5cblx0XHRpZiAoIW9wdGlvbnMuYWJzb2x1dGVQYXRoICYmICghc2NoZW1lSGFuZGxlciB8fCAhc2NoZW1lSGFuZGxlci5hYnNvbHV0ZVBhdGgpKSB7XG5cdFx0XHRzID0gcmVtb3ZlRG90U2VnbWVudHMocyk7XG5cdFx0fVxuXG5cdFx0aWYgKGF1dGhvcml0eSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRzID0gcy5yZXBsYWNlKC9eXFwvXFwvLywgXCIvJTJGXCIpOyAgLy9kb24ndCBhbGxvdyB0aGUgcGF0aCB0byBzdGFydCB3aXRoIFwiLy9cIlxuXHRcdH1cblxuXHRcdHVyaVRva2Vucy5wdXNoKHMpO1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudHMucXVlcnkgIT09IHVuZGVmaW5lZCkge1xuXHRcdHVyaVRva2Vucy5wdXNoKFwiP1wiKTtcblx0XHR1cmlUb2tlbnMucHVzaChjb21wb25lbnRzLnF1ZXJ5KTtcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLmZyYWdtZW50ICE9PSB1bmRlZmluZWQpIHtcblx0XHR1cmlUb2tlbnMucHVzaChcIiNcIik7XG5cdFx0dXJpVG9rZW5zLnB1c2goY29tcG9uZW50cy5mcmFnbWVudCk7XG5cdH1cblxuXHRyZXR1cm4gdXJpVG9rZW5zLmpvaW4oXCJcIik7ICAvL21lcmdlIHRva2VucyBpbnRvIGEgc3RyaW5nXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUNvbXBvbmVudHMoYmFzZTpVUklDb21wb25lbnRzLCByZWxhdGl2ZTpVUklDb21wb25lbnRzLCBvcHRpb25zOlVSSU9wdGlvbnMgPSB7fSwgc2tpcE5vcm1hbGl6YXRpb24/OmJvb2xlYW4pOlVSSUNvbXBvbmVudHMge1xuXHRjb25zdCB0YXJnZXQ6VVJJQ29tcG9uZW50cyA9IHt9O1xuXG5cdGlmICghc2tpcE5vcm1hbGl6YXRpb24pIHtcblx0XHRiYXNlID0gcGFyc2Uoc2VyaWFsaXplKGJhc2UsIG9wdGlvbnMpLCBvcHRpb25zKTsgIC8vbm9ybWFsaXplIGJhc2UgY29tcG9uZW50c1xuXHRcdHJlbGF0aXZlID0gcGFyc2Uoc2VyaWFsaXplKHJlbGF0aXZlLCBvcHRpb25zKSwgb3B0aW9ucyk7ICAvL25vcm1hbGl6ZSByZWxhdGl2ZSBjb21wb25lbnRzXG5cdH1cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0aWYgKCFvcHRpb25zLnRvbGVyYW50ICYmIHJlbGF0aXZlLnNjaGVtZSkge1xuXHRcdHRhcmdldC5zY2hlbWUgPSByZWxhdGl2ZS5zY2hlbWU7XG5cdFx0Ly90YXJnZXQuYXV0aG9yaXR5ID0gcmVsYXRpdmUuYXV0aG9yaXR5O1xuXHRcdHRhcmdldC51c2VyaW5mbyA9IHJlbGF0aXZlLnVzZXJpbmZvO1xuXHRcdHRhcmdldC5ob3N0ID0gcmVsYXRpdmUuaG9zdDtcblx0XHR0YXJnZXQucG9ydCA9IHJlbGF0aXZlLnBvcnQ7XG5cdFx0dGFyZ2V0LnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyZWxhdGl2ZS5wYXRoIHx8IFwiXCIpO1xuXHRcdHRhcmdldC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuXHR9IGVsc2Uge1xuXHRcdGlmIChyZWxhdGl2ZS51c2VyaW5mbyAhPT0gdW5kZWZpbmVkIHx8IHJlbGF0aXZlLmhvc3QgIT09IHVuZGVmaW5lZCB8fCByZWxhdGl2ZS5wb3J0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vdGFyZ2V0LmF1dGhvcml0eSA9IHJlbGF0aXZlLmF1dGhvcml0eTtcblx0XHRcdHRhcmdldC51c2VyaW5mbyA9IHJlbGF0aXZlLnVzZXJpbmZvO1xuXHRcdFx0dGFyZ2V0Lmhvc3QgPSByZWxhdGl2ZS5ob3N0O1xuXHRcdFx0dGFyZ2V0LnBvcnQgPSByZWxhdGl2ZS5wb3J0O1xuXHRcdFx0dGFyZ2V0LnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyZWxhdGl2ZS5wYXRoIHx8IFwiXCIpO1xuXHRcdFx0dGFyZ2V0LnF1ZXJ5ID0gcmVsYXRpdmUucXVlcnk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghcmVsYXRpdmUucGF0aCkge1xuXHRcdFx0XHR0YXJnZXQucGF0aCA9IGJhc2UucGF0aDtcblx0XHRcdFx0aWYgKHJlbGF0aXZlLnF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0YXJnZXQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0YXJnZXQucXVlcnkgPSBiYXNlLnF1ZXJ5O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAocmVsYXRpdmUucGF0aC5jaGFyQXQoMCkgPT09IFwiL1wiKSB7XG5cdFx0XHRcdFx0dGFyZ2V0LnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyZWxhdGl2ZS5wYXRoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoKGJhc2UudXNlcmluZm8gIT09IHVuZGVmaW5lZCB8fCBiYXNlLmhvc3QgIT09IHVuZGVmaW5lZCB8fCBiYXNlLnBvcnQgIT09IHVuZGVmaW5lZCkgJiYgIWJhc2UucGF0aCkge1xuXHRcdFx0XHRcdFx0dGFyZ2V0LnBhdGggPSBcIi9cIiArIHJlbGF0aXZlLnBhdGg7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICghYmFzZS5wYXRoKSB7XG5cdFx0XHRcdFx0XHR0YXJnZXQucGF0aCA9IHJlbGF0aXZlLnBhdGg7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRhcmdldC5wYXRoID0gYmFzZS5wYXRoLnNsaWNlKDAsIGJhc2UucGF0aC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKSArIHJlbGF0aXZlLnBhdGg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRhcmdldC5wYXRoID0gcmVtb3ZlRG90U2VnbWVudHModGFyZ2V0LnBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRhcmdldC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuXHRcdFx0fVxuXHRcdFx0Ly90YXJnZXQuYXV0aG9yaXR5ID0gYmFzZS5hdXRob3JpdHk7XG5cdFx0XHR0YXJnZXQudXNlcmluZm8gPSBiYXNlLnVzZXJpbmZvO1xuXHRcdFx0dGFyZ2V0Lmhvc3QgPSBiYXNlLmhvc3Q7XG5cdFx0XHR0YXJnZXQucG9ydCA9IGJhc2UucG9ydDtcblx0XHR9XG5cdFx0dGFyZ2V0LnNjaGVtZSA9IGJhc2Uuc2NoZW1lO1xuXHR9XG5cblx0dGFyZ2V0LmZyYWdtZW50ID0gcmVsYXRpdmUuZnJhZ21lbnQ7XG5cblx0cmV0dXJuIHRhcmdldDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlKGJhc2VVUkk6c3RyaW5nLCByZWxhdGl2ZVVSSTpzdHJpbmcsIG9wdGlvbnM/OlVSSU9wdGlvbnMpOnN0cmluZyB7XG5cdGNvbnN0IHNjaGVtZWxlc3NPcHRpb25zID0gYXNzaWduKHsgc2NoZW1lIDogJ251bGwnIH0sIG9wdGlvbnMpO1xuXHRyZXR1cm4gc2VyaWFsaXplKHJlc29sdmVDb21wb25lbnRzKHBhcnNlKGJhc2VVUkksIHNjaGVtZWxlc3NPcHRpb25zKSwgcGFyc2UocmVsYXRpdmVVUkksIHNjaGVtZWxlc3NPcHRpb25zKSwgc2NoZW1lbGVzc09wdGlvbnMsIHRydWUpLCBzY2hlbWVsZXNzT3B0aW9ucyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHVyaTpzdHJpbmcsIG9wdGlvbnM/OlVSSU9wdGlvbnMpOnN0cmluZztcbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUodXJpOlVSSUNvbXBvbmVudHMsIG9wdGlvbnM/OlVSSU9wdGlvbnMpOlVSSUNvbXBvbmVudHM7XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHVyaTphbnksIG9wdGlvbnM/OlVSSU9wdGlvbnMpOmFueSB7XG5cdGlmICh0eXBlb2YgdXJpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0dXJpID0gc2VyaWFsaXplKHBhcnNlKHVyaSwgb3B0aW9ucyksIG9wdGlvbnMpO1xuXHR9IGVsc2UgaWYgKHR5cGVPZih1cmkpID09PSBcIm9iamVjdFwiKSB7XG5cdFx0dXJpID0gcGFyc2Uoc2VyaWFsaXplKDxVUklDb21wb25lbnRzPnVyaSwgb3B0aW9ucyksIG9wdGlvbnMpO1xuXHR9XG5cblx0cmV0dXJuIHVyaTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbCh1cmlBOnN0cmluZywgdXJpQjpzdHJpbmcsIG9wdGlvbnM/OiBVUklPcHRpb25zKTpib29sZWFuO1xuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsKHVyaUE6VVJJQ29tcG9uZW50cywgdXJpQjpVUklDb21wb25lbnRzLCBvcHRpb25zPzpVUklPcHRpb25zKTpib29sZWFuO1xuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsKHVyaUE6YW55LCB1cmlCOmFueSwgb3B0aW9ucz86VVJJT3B0aW9ucyk6Ym9vbGVhbiB7XG5cdGlmICh0eXBlb2YgdXJpQSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHVyaUEgPSBzZXJpYWxpemUocGFyc2UodXJpQSwgb3B0aW9ucyksIG9wdGlvbnMpO1xuXHR9IGVsc2UgaWYgKHR5cGVPZih1cmlBKSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHVyaUEgPSBzZXJpYWxpemUoPFVSSUNvbXBvbmVudHM+dXJpQSwgb3B0aW9ucyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIHVyaUIgPT09IFwic3RyaW5nXCIpIHtcblx0XHR1cmlCID0gc2VyaWFsaXplKHBhcnNlKHVyaUIsIG9wdGlvbnMpLCBvcHRpb25zKTtcblx0fSBlbHNlIGlmICh0eXBlT2YodXJpQikgPT09IFwib2JqZWN0XCIpIHtcblx0XHR1cmlCID0gc2VyaWFsaXplKDxVUklDb21wb25lbnRzPnVyaUIsIG9wdGlvbnMpO1xuXHR9XG5cblx0cmV0dXJuIHVyaUEgPT09IHVyaUI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlQ29tcG9uZW50KHN0cjpzdHJpbmcsIG9wdGlvbnM/OlVSSU9wdGlvbnMpOnN0cmluZyB7XG5cdHJldHVybiBzdHIgJiYgc3RyLnRvU3RyaW5nKCkucmVwbGFjZSgoIW9wdGlvbnMgfHwgIW9wdGlvbnMuaXJpID8gVVJJX1BST1RPQ09MLkVTQ0FQRSA6IElSSV9QUk9UT0NPTC5FU0NBUEUpLCBwY3RFbmNDaGFyKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUNvbXBvbmVudChzdHI6c3RyaW5nLCBvcHRpb25zPzpVUklPcHRpb25zKTpzdHJpbmcge1xuXHRyZXR1cm4gc3RyICYmIHN0ci50b1N0cmluZygpLnJlcGxhY2UoKCFvcHRpb25zIHx8ICFvcHRpb25zLmlyaSA/IFVSSV9QUk9UT0NPTC5QQ1RfRU5DT0RFRCA6IElSSV9QUk9UT0NPTC5QQ1RfRU5DT0RFRCksIHBjdERlY0NoYXJzKTtcbn07XG4iXX0=