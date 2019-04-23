"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// load test related files into bundle in correct order
require("../zone-spec/long-stack-trace");
require("../zone-spec/proxy");
require("../zone-spec/sync-test");
require("../jasmine/jasmine");
require("./async-testing");
require("./fake-async");
require("./promise-testing");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9uZS10ZXN0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi90ZXN0aW5nL3pvbmUtdGVzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVEQUF1RDtBQUN2RCx5Q0FBdUM7QUFDdkMsOEJBQTRCO0FBQzVCLGtDQUFnQztBQUNoQyw4QkFBNEI7QUFDNUIsMkJBQXlCO0FBQ3pCLHdCQUFzQjtBQUN0Qiw2QkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIGxvYWQgdGVzdCByZWxhdGVkIGZpbGVzIGludG8gYnVuZGxlIGluIGNvcnJlY3Qgb3JkZXJcbmltcG9ydCAnLi4vem9uZS1zcGVjL2xvbmctc3RhY2stdHJhY2UnO1xuaW1wb3J0ICcuLi96b25lLXNwZWMvcHJveHknO1xuaW1wb3J0ICcuLi96b25lLXNwZWMvc3luYy10ZXN0JztcbmltcG9ydCAnLi4vamFzbWluZS9qYXNtaW5lJztcbmltcG9ydCAnLi9hc3luYy10ZXN0aW5nJztcbmltcG9ydCAnLi9mYWtlLWFzeW5jJztcbmltcG9ydCAnLi9wcm9taXNlLXRlc3RpbmcnOyJdfQ==