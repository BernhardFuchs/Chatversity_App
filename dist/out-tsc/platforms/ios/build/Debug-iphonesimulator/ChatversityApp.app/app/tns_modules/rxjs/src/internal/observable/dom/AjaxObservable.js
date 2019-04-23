"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var root_1 = require("../../util/root");
var tryCatch_1 = require("../../util/tryCatch");
var errorObject_1 = require("../../util/errorObject");
var Observable_1 = require("../../Observable");
var Subscriber_1 = require("../../Subscriber");
var map_1 = require("../../operators/map");
function getCORSRequest() {
    if (root_1.root.XMLHttpRequest) {
        return new root_1.root.XMLHttpRequest();
    }
    else if (!!root_1.root.XDomainRequest) {
        return new root_1.root.XDomainRequest();
    }
    else {
        throw new Error('CORS is not supported by your browser');
    }
}
function getXMLHttpRequest() {
    if (root_1.root.XMLHttpRequest) {
        return new root_1.root.XMLHttpRequest();
    }
    else {
        var progId = void 0;
        try {
            var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
            for (var i = 0; i < 3; i++) {
                try {
                    progId = progIds[i];
                    if (new root_1.root.ActiveXObject(progId)) {
                        break;
                    }
                }
                catch (e) {
                    //suppress exceptions
                }
            }
            return new root_1.root.ActiveXObject(progId);
        }
        catch (e) {
            throw new Error('XMLHttpRequest is not supported by your browser');
        }
    }
}
function ajaxGet(url, headers) {
    if (headers === void 0) { headers = null; }
    return new AjaxObservable({ method: 'GET', url: url, headers: headers });
}
exports.ajaxGet = ajaxGet;
function ajaxPost(url, body, headers) {
    return new AjaxObservable({ method: 'POST', url: url, body: body, headers: headers });
}
exports.ajaxPost = ajaxPost;
function ajaxDelete(url, headers) {
    return new AjaxObservable({ method: 'DELETE', url: url, headers: headers });
}
exports.ajaxDelete = ajaxDelete;
function ajaxPut(url, body, headers) {
    return new AjaxObservable({ method: 'PUT', url: url, body: body, headers: headers });
}
exports.ajaxPut = ajaxPut;
function ajaxPatch(url, body, headers) {
    return new AjaxObservable({ method: 'PATCH', url: url, body: body, headers: headers });
}
exports.ajaxPatch = ajaxPatch;
var mapResponse = map_1.map(function (x, index) { return x.response; });
function ajaxGetJSON(url, headers) {
    return mapResponse(new AjaxObservable({
        method: 'GET',
        url: url,
        responseType: 'json',
        headers: headers
    }));
}
exports.ajaxGetJSON = ajaxGetJSON;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var AjaxObservable = /** @class */ (function (_super) {
    __extends(AjaxObservable, _super);
    function AjaxObservable(urlOrRequest) {
        var _this = _super.call(this) || this;
        var request = {
            async: true,
            createXHR: function () {
                return this.crossDomain ? getCORSRequest() : getXMLHttpRequest();
            },
            crossDomain: true,
            withCredentials: false,
            headers: {},
            method: 'GET',
            responseType: 'json',
            timeout: 0
        };
        if (typeof urlOrRequest === 'string') {
            request.url = urlOrRequest;
        }
        else {
            for (var prop in urlOrRequest) {
                if (urlOrRequest.hasOwnProperty(prop)) {
                    request[prop] = urlOrRequest[prop];
                }
            }
        }
        _this.request = request;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    AjaxObservable.prototype._subscribe = function (subscriber) {
        return new AjaxSubscriber(subscriber, this.request);
    };
    /**
     * Creates an observable for an Ajax request with either a request object with
     * url, headers, etc or a string for a URL.
     *
     * ## Example
     * ```javascript
     * source = Rx.Observable.ajax('/products');
     * source = Rx.Observable.ajax({ url: 'products', method: 'GET' });
     * ```
     *
     * @param {string|Object} request Can be one of the following:
     *   A string of the URL to make the Ajax call.
     *   An object with the following properties
     *   - url: URL of the request
     *   - body: The body of the request
     *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
     *   - async: Whether the request is async
     *   - headers: Optional headers
     *   - crossDomain: true if a cross domain request, else false
     *   - createXHR: a function to override if you need to use an alternate
     *   XMLHttpRequest implementation.
     *   - resultSelector: a function to use to alter the output value type of
     *   the Observable. Gets {@link AjaxResponse} as an argument.
     * @return {Observable} An observable sequence containing the XMLHttpRequest.
     * @static true
     * @name ajax
     * @owner Observable
     * @nocollapse
    */
    AjaxObservable.create = (function () {
        var create = function (urlOrRequest) {
            return new AjaxObservable(urlOrRequest);
        };
        create.get = ajaxGet;
        create.post = ajaxPost;
        create.delete = ajaxDelete;
        create.put = ajaxPut;
        create.patch = ajaxPatch;
        create.getJSON = ajaxGetJSON;
        return create;
    })();
    return AjaxObservable;
}(Observable_1.Observable));
exports.AjaxObservable = AjaxObservable;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AjaxSubscriber = /** @class */ (function (_super) {
    __extends(AjaxSubscriber, _super);
    function AjaxSubscriber(destination, request) {
        var _this = _super.call(this, destination) || this;
        _this.request = request;
        _this.done = false;
        var headers = request.headers = request.headers || {};
        // force CORS if requested
        if (!request.crossDomain && !headers['X-Requested-With']) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        // ensure content type is set
        if (!('Content-Type' in headers) && !(root_1.root.FormData && request.body instanceof root_1.root.FormData) && typeof request.body !== 'undefined') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        // properly serialize body
        request.body = _this.serializeBody(request.body, request.headers['Content-Type']);
        _this.send();
        return _this;
    }
    AjaxSubscriber.prototype.next = function (e) {
        this.done = true;
        var _a = this, xhr = _a.xhr, request = _a.request, destination = _a.destination;
        var response = new AjaxResponse(e, xhr, request);
        if (response.response === errorObject_1.errorObject) {
            destination.error(errorObject_1.errorObject.e);
        }
        else {
            destination.next(response);
        }
    };
    AjaxSubscriber.prototype.send = function () {
        var _a = this, request = _a.request, _b = _a.request, user = _b.user, method = _b.method, url = _b.url, async = _b.async, password = _b.password, headers = _b.headers, body = _b.body;
        var createXHR = request.createXHR;
        var xhr = tryCatch_1.tryCatch(createXHR).call(request);
        if (xhr === errorObject_1.errorObject) {
            this.error(errorObject_1.errorObject.e);
        }
        else {
            this.xhr = xhr;
            // set up the events before open XHR
            // https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
            // You need to add the event listeners before calling open() on the request.
            // Otherwise the progress events will not fire.
            this.setupEvents(xhr, request);
            // open XHR
            var result = void 0;
            if (user) {
                result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async, user, password);
            }
            else {
                result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async);
            }
            if (result === errorObject_1.errorObject) {
                this.error(errorObject_1.errorObject.e);
                return null;
            }
            // timeout, responseType and withCredentials can be set once the XHR is open
            if (async) {
                xhr.timeout = request.timeout;
                xhr.responseType = request.responseType;
            }
            if ('withCredentials' in xhr) {
                xhr.withCredentials = !!request.withCredentials;
            }
            // set headers
            this.setHeaders(xhr, headers);
            // finally send the request
            result = body ? tryCatch_1.tryCatch(xhr.send).call(xhr, body) : tryCatch_1.tryCatch(xhr.send).call(xhr);
            if (result === errorObject_1.errorObject) {
                this.error(errorObject_1.errorObject.e);
                return null;
            }
        }
        return xhr;
    };
    AjaxSubscriber.prototype.serializeBody = function (body, contentType) {
        if (!body || typeof body === 'string') {
            return body;
        }
        else if (root_1.root.FormData && body instanceof root_1.root.FormData) {
            return body;
        }
        if (contentType) {
            var splitIndex = contentType.indexOf(';');
            if (splitIndex !== -1) {
                contentType = contentType.substring(0, splitIndex);
            }
        }
        switch (contentType) {
            case 'application/x-www-form-urlencoded':
                return Object.keys(body).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(body[key]); }).join('&');
            case 'application/json':
                return JSON.stringify(body);
            default:
                return body;
        }
    };
    AjaxSubscriber.prototype.setHeaders = function (xhr, headers) {
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }
    };
    AjaxSubscriber.prototype.setupEvents = function (xhr, request) {
        var progressSubscriber = request.progressSubscriber;
        function xhrTimeout(e) {
            var _a = xhrTimeout, subscriber = _a.subscriber, progressSubscriber = _a.progressSubscriber, request = _a.request;
            if (progressSubscriber) {
                progressSubscriber.error(e);
            }
            var ajaxTimeoutError = new exports.AjaxTimeoutError(this, request); //TODO: Make betterer.
            if (ajaxTimeoutError.response === errorObject_1.errorObject) {
                subscriber.error(errorObject_1.errorObject.e);
            }
            else {
                subscriber.error(ajaxTimeoutError);
            }
        }
        xhr.ontimeout = xhrTimeout;
        xhrTimeout.request = request;
        xhrTimeout.subscriber = this;
        xhrTimeout.progressSubscriber = progressSubscriber;
        if (xhr.upload && 'withCredentials' in xhr) {
            if (progressSubscriber) {
                var xhrProgress_1;
                xhrProgress_1 = function (e) {
                    var progressSubscriber = xhrProgress_1.progressSubscriber;
                    progressSubscriber.next(e);
                };
                if (root_1.root.XDomainRequest) {
                    xhr.onprogress = xhrProgress_1;
                }
                else {
                    xhr.upload.onprogress = xhrProgress_1;
                }
                xhrProgress_1.progressSubscriber = progressSubscriber;
            }
            var xhrError_1;
            xhrError_1 = function (e) {
                var _a = xhrError_1, progressSubscriber = _a.progressSubscriber, subscriber = _a.subscriber, request = _a.request;
                if (progressSubscriber) {
                    progressSubscriber.error(e);
                }
                var ajaxError = new exports.AjaxError('ajax error', this, request);
                if (ajaxError.response === errorObject_1.errorObject) {
                    subscriber.error(errorObject_1.errorObject.e);
                }
                else {
                    subscriber.error(ajaxError);
                }
            };
            xhr.onerror = xhrError_1;
            xhrError_1.request = request;
            xhrError_1.subscriber = this;
            xhrError_1.progressSubscriber = progressSubscriber;
        }
        function xhrReadyStateChange(e) {
            return;
        }
        xhr.onreadystatechange = xhrReadyStateChange;
        xhrReadyStateChange.subscriber = this;
        xhrReadyStateChange.progressSubscriber = progressSubscriber;
        xhrReadyStateChange.request = request;
        function xhrLoad(e) {
            var _a = xhrLoad, subscriber = _a.subscriber, progressSubscriber = _a.progressSubscriber, request = _a.request;
            if (this.readyState === 4) {
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                var status_1 = this.status === 1223 ? 204 : this.status;
                var response = (this.responseType === 'text' ? (this.response || this.responseText) : this.response);
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status_1 === 0) {
                    status_1 = response ? 200 : 0;
                }
                // 4xx and 5xx should error (https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
                if (status_1 < 400) {
                    if (progressSubscriber) {
                        progressSubscriber.complete();
                    }
                    subscriber.next(e);
                    subscriber.complete();
                }
                else {
                    if (progressSubscriber) {
                        progressSubscriber.error(e);
                    }
                    var ajaxError = new exports.AjaxError('ajax error ' + status_1, this, request);
                    if (ajaxError.response === errorObject_1.errorObject) {
                        subscriber.error(errorObject_1.errorObject.e);
                    }
                    else {
                        subscriber.error(ajaxError);
                    }
                }
            }
        }
        xhr.onload = xhrLoad;
        xhrLoad.subscriber = this;
        xhrLoad.progressSubscriber = progressSubscriber;
        xhrLoad.request = request;
    };
    AjaxSubscriber.prototype.unsubscribe = function () {
        var _a = this, done = _a.done, xhr = _a.xhr;
        if (!done && xhr && xhr.readyState !== 4 && typeof xhr.abort === 'function') {
            xhr.abort();
        }
        _super.prototype.unsubscribe.call(this);
    };
    return AjaxSubscriber;
}(Subscriber_1.Subscriber));
exports.AjaxSubscriber = AjaxSubscriber;
/**
 * A normalized AJAX response.
 *
 * @see {@link ajax}
 *
 * @class AjaxResponse
 */
var AjaxResponse = /** @class */ (function () {
    function AjaxResponse(originalEvent, xhr, request) {
        this.originalEvent = originalEvent;
        this.xhr = xhr;
        this.request = request;
        this.status = xhr.status;
        this.responseType = xhr.responseType || request.responseType;
        this.response = parseXhrResponse(this.responseType, xhr);
    }
    return AjaxResponse;
}());
exports.AjaxResponse = AjaxResponse;
function AjaxErrorImpl(message, xhr, request) {
    Error.call(this);
    this.message = message;
    this.name = 'AjaxError';
    this.xhr = xhr;
    this.request = request;
    this.status = xhr.status;
    this.responseType = xhr.responseType || request.responseType;
    this.response = parseXhrResponse(this.responseType, xhr);
    return this;
}
AjaxErrorImpl.prototype = Object.create(Error.prototype);
exports.AjaxError = AjaxErrorImpl;
function parseJson(xhr) {
    // HACK(benlesh): TypeScript shennanigans
    // tslint:disable-next-line:no-any XMLHttpRequest is defined to always have 'response' inferring xhr as never for the else clause.
    if ('response' in xhr) {
        //IE does not support json as responseType, parse it internally
        return xhr.responseType ? xhr.response : JSON.parse(xhr.response || xhr.responseText || 'null');
    }
    else {
        return JSON.parse(xhr.responseText || 'null');
    }
}
function parseXhrResponse(responseType, xhr) {
    switch (responseType) {
        case 'json':
            return tryCatch_1.tryCatch(parseJson)(xhr);
        case 'xml':
            return xhr.responseXML;
        case 'text':
        default:
            // HACK(benlesh): TypeScript shennanigans
            // tslint:disable-next-line:no-any XMLHttpRequest is defined to always have 'response' inferring xhr as never for the else sub-expression.
            return ('response' in xhr) ? xhr.response : xhr.responseText;
    }
}
function AjaxTimeoutErrorImpl(xhr, request) {
    exports.AjaxError.call(this, 'ajax timeout', xhr, request);
    this.name = 'AjaxTimeoutError';
    return this;
}
/**
 * @see {@link ajax}
 *
 * @class AjaxTimeoutError
 */
exports.AjaxTimeoutError = AjaxTimeoutErrorImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWpheE9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZG9tL0FqYXhPYnNlcnZhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXVDO0FBQ3ZDLGdEQUErQztBQUMvQyxzREFBcUQ7QUFDckQsK0NBQThDO0FBQzlDLCtDQUE4QztBQUU5QywyQ0FBMEM7QUFtQjFDLFNBQVMsY0FBYztJQUNyQixJQUFJLFdBQUksQ0FBQyxjQUFjLEVBQUU7UUFDdkIsT0FBTyxJQUFJLFdBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUNsQztTQUFNLElBQUksQ0FBQyxDQUFDLFdBQUksQ0FBQyxjQUFjLEVBQUU7UUFDaEMsT0FBTyxJQUFJLFdBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUNsQztTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQzFEO0FBQ0gsQ0FBQztBQUVELFNBQVMsaUJBQWlCO0lBQ3hCLElBQUksV0FBSSxDQUFDLGNBQWMsRUFBRTtRQUN2QixPQUFPLElBQUksV0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ2xDO1NBQU07UUFDTCxJQUFJLE1BQU0sU0FBUSxDQUFDO1FBQ25CLElBQUk7WUFDRixJQUFNLE9BQU8sR0FBRyxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDOUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUIsSUFBSTtvQkFDRixNQUFNLEdBQUcsT0FBTyxDQUFDLENB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Q2pFLFFBQVEsWUFBWSxFQUFFO1FBQ3BCLEtBQUssTUFBTTtZQUNQLE9BQU8sbUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxLQUFLLEtBQUs7WUFDUixPQUFPLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFDekIsS0FBSyxNQUFNLENBQUM7UUFDWjtZQUNJLHlDQUF5QztZQUN6QywwSUFBMEk7WUFDMUksT0FBUSxDQUFDLFVBQVUsSUFBSyxHQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztLQUM5RTtBQUNILENBQUM7QUFTRCxTQUFTLG9CQUFvQixDQUFZLEdBQW1CLEVBQUUsT0FBb0I7SUFDaEYsaUJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkQsSUFBSSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQztJQUMvQixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7OztHQUlHO0FBQ1UsUUFBQSxnQkFBZ0IsR0FBeUIsb0JBQTJCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByb290IH0gZnJvbSAnLi4vLi4vdXRpbC9yb290JztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uLy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uLy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uLy4uL29wZXJhdG9ycy9tYXAnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhSZXF1ZXN0IHtcbiAgdXJsPzogc3RyaW5nO1xuICBib2R5PzogYW55O1xuICB1c2VyPzogc3RyaW5nO1xuICBhc3luYz86IGJvb2xlYW47XG4gIG1ldGhvZD86IHN0cmluZztcbiAgaGVhZGVycz86IE9iamVjdDtcbiAgdGltZW91dD86IG51bWJlcjtcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG4gIGhhc0NvbnRlbnQ/OiBib29sZWFuO1xuICBjcm9zc0RvbWFpbj86IGJvb2xlYW47XG4gIHdpdGhDcmVkZW50aWFscz86IGJvb2xlYW47XG4gIGNyZWF0ZVhIUj86ICgpID0+IFhNTEh0dHBSZXF1ZXN0O1xuICBwcm9ncmVzc1N1YnNjcmliZXI/OiBTdWJzY3JpYmVyPGFueT47XG4gIHJlc3BvbnNlVHlwZT86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZ2V0Q09SU1JlcXVlc3QoKTogWE1MSHR0cFJlcXVlc3Qge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdCkge1xuICAgIHJldHVybiBuZXcgcm9vdC5YTUxIdHRwUmVxdWVzdCgpO1xuICB9IGVsc2UgaWYgKCEhcm9vdC5YRG9tYWluUmVxdWVzdCkge1xuICAgIHJldHVybiBuZXcgcm9vdC5YRG9tYWluUmVxdWVzdCgpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQ09SUyBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlcicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFhNTEh0dHBSZXF1ZXN0KCk6IFhNTEh0dHBSZXF1ZXN0IHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3QpIHtcbiAgICByZXR1cm4gbmV3IHJvb3QuWE1MSHR0cFJlcXVlc3QoKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgcHJvZ0lkOiBzdHJpbmc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHByb2dJZHMgPSBbJ01zeG1sMi5YTUxIVFRQJywgJ01pY3Jvc29mdC5YTUxIVFRQJywgJ01zeG1sMi5YTUxIVFRQLjQuMCddO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwcm9nSWQgPSBwcm9nSWRzW2ldO1xuICAgICAgICAgIGlmIChuZXcgcm9vdC5BY3RpdmVYT2JqZWN0KHByb2dJZCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vc3VwcHJlc3MgZXhjZXB0aW9uc1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IHJvb3QuQWN0aXZlWE9iamVjdChwcm9nSWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWE1MSHR0cFJlcXVlc3QgaXMgbm90IHN1cHBvcnRlZCBieSB5b3VyIGJyb3dzZXInKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBamF4Q3JlYXRpb25NZXRob2Qge1xuICAodXJsT3JSZXF1ZXN0OiBzdHJpbmcgfCBBamF4UmVxdWVzdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPjtcbiAgZ2V0KHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBwb3N0KHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBwdXQodXJsOiBzdHJpbmcsIGJvZHk/OiBhbnksIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIHBhdGNoKHVybDogc3RyaW5nLCBib2R5PzogYW55LCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+O1xuICBkZWxldGUodXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT47XG4gIGdldEpTT048VD4odXJsOiBzdHJpbmcsIGhlYWRlcnM/OiBPYmplY3QpOiBPYnNlcnZhYmxlPFQ+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheEdldCh1cmw6IHN0cmluZywgaGVhZGVyczogT2JqZWN0ID0gbnVsbCkge1xuICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlPEFqYXhSZXNwb25zZT4oeyBtZXRob2Q6ICdHRVQnLCB1cmwsIGhlYWRlcnMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4UG9zdCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7IG1ldGhvZDogJ1BPU1QnLCB1cmwsIGJvZHksIGhlYWRlcnMgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4RGVsZXRlKHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+IHtcbiAgcmV0dXJuIG5ldyBBamF4T2JzZXJ2YWJsZTxBamF4UmVzcG9uc2U+KHsgbWV0aG9kOiAnREVMRVRFJywgdXJsLCBoZWFkZXJzIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheFB1dCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7IG1ldGhvZDogJ1BVVCcsIHVybCwgYm9keSwgaGVhZGVycyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhQYXRjaCh1cmw6IHN0cmluZywgYm9keT86IGFueSwgaGVhZGVycz86IE9iamVjdCk6IE9ic2VydmFibGU8QWpheFJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7IG1ldGhvZDogJ1BBVENIJywgdXJsLCBib2R5LCBoZWFkZXJzIH0pO1xufVxuXG5jb25zdCBtYXBSZXNwb25zZSA9IG1hcCgoeDogQWpheFJlc3BvbnNlLCBpbmRleDogbnVtYmVyKSA9PiB4LnJlc3BvbnNlKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFqYXhHZXRKU09OPFQ+KHVybDogc3RyaW5nLCBoZWFkZXJzPzogT2JqZWN0KTogT2JzZXJ2YWJsZTxUPiB7XG4gIHJldHVybiBtYXBSZXNwb25zZShcbiAgICBuZXcgQWpheE9ic2VydmFibGU8QWpheFJlc3BvbnNlPih7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsLFxuICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICBoZWFkZXJzXG4gICAgfSlcbiAgKTtcbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKiBAaGlkZSB0cnVlXG4gKi9cbmV4cG9ydCBjbGFzcyBBamF4T2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYnNlcnZhYmxlIGZvciBhbiBBamF4IHJlcXVlc3Qgd2l0aCBlaXRoZXIgYSByZXF1ZXN0IG9iamVjdCB3aXRoXG4gICAqIHVybCwgaGVhZGVycywgZXRjIG9yIGEgc3RyaW5nIGZvciBhIFVSTC5cbiAgICpcbiAgICogIyMgRXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHNvdXJjZSA9IFJ4Lk9ic2VydmFibGUuYWpheCgnL3Byb2R1Y3RzJyk7XG4gICAqIHNvdXJjZSA9IFJ4Lk9ic2VydmFibGUuYWpheCh7IHVybDogJ3Byb2R1Y3RzJywgbWV0aG9kOiAnR0VUJyB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfE9iamVjdH0gcmVxdWVzdCBDYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqICAgQSBzdHJpbmcgb2YgdGhlIFVSTCB0byBtYWtlIHRoZSBBamF4IGNhbGwuXG4gICAqICAgQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzXG4gICAqICAgLSB1cmw6IFVSTCBvZiB0aGUgcmVxdWVzdFxuICAgKiAgIC0gYm9keTogVGhlIGJvZHkgb2YgdGhlIHJlcXVlc3RcbiAgICogICAtIG1ldGhvZDogTWV0aG9kIG9mIHRoZSByZXF1ZXN0LCBzdWNoIGFzIEdFVCwgUE9TVCwgUFVULCBQQVRDSCwgREVMRVRFXG4gICAqICAgLSBhc3luYzogV2hldGhlciB0aGUgcmVxdWVzdCBpcyBhc3luY1xuICAgKiAgIC0gaGVhZGVyczogT3B0aW9uYWwgaGVhZGVyc1xuICAgKiAgIC0gY3Jvc3NEb21haW46IHRydWUgaWYgYSBjcm9zcyBkb21haW4gcmVxdWVzdCwgZWxzZSBmYWxzZVxuICAgKiAgIC0gY3JlYXRlWEhSOiBhIGZ1bmN0aW9uIHRvIG92ZXJyaWRlIGlmIHlvdSBuZWVkIHRvIHVzZSBhbiBhbHRlcm5hdGVcbiAgICogICBYTUxIdHRwUmVxdWVzdCBpbXBsZW1lbnRhdGlvbi5cbiAgICogICAtIHJlc3VsdFNlbGVjdG9yOiBhIGZ1bmN0aW9uIHRvIHVzZSB0byBhbHRlciB0aGUgb3V0cHV0IHZhbHVlIHR5cGUgb2ZcbiAgICogICB0aGUgT2JzZXJ2YWJsZS4gR2V0cyB7QGxpbmsgQWpheFJlc3BvbnNlfSBhcyBhbiBhcmd1bWVudC5cbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIHRoZSBYTUxIdHRwUmVxdWVzdC5cbiAgICogQHN0YXRpYyB0cnVlXG4gICAqIEBuYW1lIGFqYXhcbiAgICogQG93bmVyIE9ic2VydmFibGVcbiAgICogQG5vY29sbGFwc2VcbiAgKi9cbiAgc3RhdGljIGNyZWF0ZTogQWpheENyZWF0aW9uTWV0aG9kID0gKCgpID0+IHtcbiAgICBjb25zdCBjcmVhdGU6IGFueSA9ICh1cmxPclJlcXVlc3Q6IHN0cmluZyB8IEFqYXhSZXF1ZXN0KSA9PiB7XG4gICAgICByZXR1cm4gbmV3IEFqYXhPYnNlcnZhYmxlKHVybE9yUmVxdWVzdCk7XG4gICAgfTtcblxuICAgIGNyZWF0ZS5nZXQgPSBhamF4R2V0O1xuICAgIGNyZWF0ZS5wb3N0ID0gYWpheFBvc3Q7XG4gICAgY3JlYXRlLmRlbGV0ZSA9IGFqYXhEZWxldGU7XG4gICAgY3JlYXRlLnB1dCA9IGFqYXhQdXQ7XG4gICAgY3JlYXRlLnBhdGNoID0gYWpheFBhdGNoO1xuICAgIGNyZWF0ZS5nZXRKU09OID0gYWpheEdldEpTT047XG5cbiAgICByZXR1cm4gPEFqYXhDcmVhdGlvbk1ldGhvZD5jcmVhdGU7XG4gIH0pKCk7XG5cbiAgcHJpdmF0ZSByZXF1ZXN0OiBBamF4UmVxdWVzdDtcblxuICBjb25zdHJ1Y3Rvcih1cmxPclJlcXVlc3Q6IHN0cmluZyB8IEFqYXhSZXF1ZXN0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHJlcXVlc3Q6IEFqYXhSZXF1ZXN0ID0ge1xuICAgICAgYXN5bmM6IHRydWUsXG4gICAgICBjcmVhdGVYSFI6IGZ1bmN0aW9uKHRoaXM6IEFqYXhSZXF1ZXN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyb3NzRG9tYWluID8gZ2V0Q09SU1JlcXVlc3QoKSA6IGdldFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB9LFxuICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgICAgaGVhZGVyczoge30sXG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgICB0aW1lb3V0OiAwXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgdXJsT3JSZXF1ZXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmVxdWVzdC51cmwgPSB1cmxPclJlcXVlc3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB1cmxPclJlcXVlc3QpIHtcbiAgICAgICAgaWYgKHVybE9yUmVxdWVzdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHJlcXVlc3RbcHJvcF0gPSB1cmxPclJlcXVlc3RbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gbmV3IEFqYXhTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucmVxdWVzdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBBamF4U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8RXZlbnQ+IHtcbiAgcHJpdmF0ZSB4aHI6IFhNTEh0dHBSZXF1ZXN0O1xuICBwcml2YXRlIGRvbmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPiwgcHVibGljIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycyB8fCB7fTtcblxuICAgIC8vIGZvcmNlIENPUlMgaWYgcmVxdWVzdGVkXG4gICAgaWYgKCFyZXF1ZXN0LmNyb3NzRG9tYWluICYmICFoZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10pIHtcbiAgICAgIGhlYWRlcnNbJ1gtUmVxdWVzdGVkLVdpdGgnXSA9ICdYTUxIdHRwUmVxdWVzdCc7XG4gICAgfVxuXG4gICAgLy8gZW5zdXJlIGNvbnRlbnQgdHlwZSBpcyBzZXRcbiAgICBpZiAoISgnQ29udGVudC1UeXBlJyBpbiBoZWFkZXJzKSAmJiAhKHJvb3QuRm9ybURhdGEgJiYgcmVxdWVzdC5ib2R5IGluc3RhbmNlb2Ygcm9vdC5Gb3JtRGF0YSkgJiYgdHlwZW9mIHJlcXVlc3QuYm9keSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XG4gICAgfVxuXG4gICAgLy8gcHJvcGVybHkgc2VyaWFsaXplIGJvZHlcbiAgICByZXF1ZXN0LmJvZHkgPSB0aGlzLnNlcmlhbGl6ZUJvZHkocmVxdWVzdC5ib2R5LCByZXF1ZXN0LmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddKTtcblxuICAgIHRoaXMuc2VuZCgpO1xuICB9XG5cbiAgbmV4dChlOiBFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgY29uc3QgeyB4aHIsIHJlcXVlc3QsIGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gbmV3IEFqYXhSZXNwb25zZShlLCB4aHIsIHJlcXVlc3QpO1xuICAgIGlmIChyZXNwb25zZS5yZXNwb25zZSA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHJlc3BvbnNlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNlbmQoKTogWE1MSHR0cFJlcXVlc3Qge1xuICAgIGNvbnN0IHtcbiAgICAgIHJlcXVlc3QsXG4gICAgICByZXF1ZXN0OiB7IHVzZXIsIG1ldGhvZCwgdXJsLCBhc3luYywgcGFzc3dvcmQsIGhlYWRlcnMsIGJvZHkgfVxuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IGNyZWF0ZVhIUiA9IHJlcXVlc3QuY3JlYXRlWEhSO1xuICAgIGNvbnN0IHhocjogWE1MSHR0cFJlcXVlc3QgPSB0cnlDYXRjaChjcmVhdGVYSFIpLmNhbGwocmVxdWVzdCk7XG5cbiAgICBpZiAoPGFueT54aHIgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICB0aGlzLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnhociA9IHhocjtcblxuICAgICAgLy8gc2V0IHVwIHRoZSBldmVudHMgYmVmb3JlIG9wZW4gWEhSXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3QvVXNpbmdfWE1MSHR0cFJlcXVlc3RcbiAgICAgIC8vIFlvdSBuZWVkIHRvIGFkZCB0aGUgZXZlbnQgbGlzdGVuZXJzIGJlZm9yZSBjYWxsaW5nIG9wZW4oKSBvbiB0aGUgcmVxdWVzdC5cbiAgICAgIC8vIE90aGVyd2lzZSB0aGUgcHJvZ3Jlc3MgZXZlbnRzIHdpbGwgbm90IGZpcmUuXG4gICAgICB0aGlzLnNldHVwRXZlbnRzKHhociwgcmVxdWVzdCk7XG4gICAgICAvLyBvcGVuIFhIUlxuICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmVzdWx0ID0gdHJ5Q2F0Y2goeGhyLm9wZW4pLmNhbGwoeGhyLCBtZXRob2QsIHVybCwgYXN5bmMsIHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHRyeUNhdGNoKHhoci5vcGVuKS5jYWxsKHhociwgbWV0aG9kLCB1cmwsIGFzeW5jKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgdGhpcy5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIHRpbWVvdXQsIHJlc3BvbnNlVHlwZSBhbmQgd2l0aENyZWRlbnRpYWxzIGNhbiBiZSBzZXQgb25jZSB0aGUgWEhSIGlzIG9wZW5cbiAgICAgIGlmIChhc3luYykge1xuICAgICAgICB4aHIudGltZW91dCA9IHJlcXVlc3QudGltZW91dDtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IHJlcXVlc3QucmVzcG9uc2VUeXBlIGFzIGFueTtcbiAgICAgIH1cblxuICAgICAgaWYgKCd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISFyZXF1ZXN0LndpdGhDcmVkZW50aWFscztcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IGhlYWRlcnNcbiAgICAgIHRoaXMuc2V0SGVhZGVycyh4aHIsIGhlYWRlcnMpO1xuXG4gICAgICAvLyBmaW5hbGx5IHNlbmQgdGhlIHJlcXVlc3RcbiAgICAgIHJlc3VsdCA9IGJvZHkgPyB0cnlDYXRjaCh4aHIuc2VuZCkuY2FsbCh4aHIsIGJvZHkpIDogdHJ5Q2F0Y2goeGhyLnNlbmQpLmNhbGwoeGhyKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB4aHI7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZUJvZHkoYm9keTogYW55LCBjb250ZW50VHlwZT86IHN0cmluZykge1xuICAgIGlmICghYm9keSB8fCB0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBib2R5O1xuICAgIH0gZWxzZSBpZiAocm9vdC5Gb3JtRGF0YSAmJiBib2R5IGluc3RhbmNlb2Ygcm9vdC5Gb3JtRGF0YSkge1xuICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRUeXBlKSB7XG4gICAgICBjb25zdCBzcGxpdEluZGV4ID0gY29udGVudFR5cGUuaW5kZXhPZignOycpO1xuICAgICAgaWYgKHNwbGl0SW5kZXggIT09IC0xKSB7XG4gICAgICAgIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUuc3Vic3RyaW5nKDAsIHNwbGl0SW5kZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAoY29udGVudFR5cGUpIHtcbiAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhib2R5KS5tYXAoa2V5ID0+IGAke2VuY29kZVVSSUNvbXBvbmVudChrZXkpfT0ke2VuY29kZVVSSUNvbXBvbmVudChib2R5W2tleV0pfWApLmpvaW4oJyYnKTtcbiAgICAgIGNhc2UgJ2FwcGxpY2F0aW9uL2pzb24nOlxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gYm9keTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldEhlYWRlcnMoeGhyOiBYTUxIdHRwUmVxdWVzdCwgaGVhZGVyczogT2JqZWN0KSB7XG4gICAgZm9yIChsZXQga2V5IGluIGhlYWRlcnMpIHtcbiAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0dXBFdmVudHMoeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9ncmVzc1N1YnNjcmliZXIgPSByZXF1ZXN0LnByb2dyZXNzU3Vic2NyaWJlcjtcblxuICAgIGZ1bmN0aW9uIHhoclRpbWVvdXQodGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IFByb2dyZXNzRXZlbnQpIHtcbiAgICAgIGNvbnN0IHtzdWJzY3JpYmVyLCBwcm9ncmVzc1N1YnNjcmliZXIsIHJlcXVlc3QgfSA9ICg8YW55PnhoclRpbWVvdXQpO1xuICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICBwcm9ncmVzc1N1YnNjcmliZXIuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICBjb25zdCBhamF4VGltZW91dEVycm9yID0gbmV3IEFqYXhUaW1lb3V0RXJyb3IodGhpcywgcmVxdWVzdCk7IC8vVE9ETzogTWFrZSBiZXR0ZXJlci5cbiAgICAgIGlmIChhamF4VGltZW91dEVycm9yLnJlc3BvbnNlID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihhamF4VGltZW91dEVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gICAgeGhyLm9udGltZW91dCA9IHhoclRpbWVvdXQ7XG4gICAgKDxhbnk+eGhyVGltZW91dCkucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgKDxhbnk+eGhyVGltZW91dCkuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgKDxhbnk+eGhyVGltZW91dCkucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgIGlmICh4aHIudXBsb2FkICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocikge1xuICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICBsZXQgeGhyUHJvZ3Jlc3M6IChlOiBQcm9ncmVzc0V2ZW50KSA9PiB2b2lkO1xuICAgICAgICB4aHJQcm9ncmVzcyA9IGZ1bmN0aW9uKGU6IFByb2dyZXNzRXZlbnQpIHtcbiAgICAgICAgICBjb25zdCB7IHByb2dyZXNzU3Vic2NyaWJlciB9ID0gKDxhbnk+eGhyUHJvZ3Jlc3MpO1xuICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5uZXh0KGUpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAocm9vdC5YRG9tYWluUmVxdWVzdCkge1xuICAgICAgICAgIHhoci5vbnByb2dyZXNzID0geGhyUHJvZ3Jlc3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0geGhyUHJvZ3Jlc3M7XG4gICAgICAgIH1cbiAgICAgICAgKDxhbnk+eGhyUHJvZ3Jlc3MpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICAgIH1cbiAgICAgIGxldCB4aHJFcnJvcjogKGU6IGFueSkgPT4gdm9pZDtcbiAgICAgIHhockVycm9yID0gZnVuY3Rpb24odGhpczogWE1MSHR0cFJlcXVlc3QsIGU6IEVycm9yRXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBwcm9ncmVzc1N1YnNjcmliZXIsIHN1YnNjcmliZXIsIHJlcXVlc3QgfSA9ICg8YW55PnhockVycm9yKTtcbiAgICAgICAgaWYgKHByb2dyZXNzU3Vic2NyaWJlcikge1xuICAgICAgICAgIHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcihlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhamF4RXJyb3IgPSBuZXcgQWpheEVycm9yKCdhamF4IGVycm9yJywgdGhpcywgcmVxdWVzdCk7XG4gICAgICAgIGlmIChhamF4RXJyb3IucmVzcG9uc2UgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGFqYXhFcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IHhockVycm9yO1xuICAgICAgKDxhbnk+eGhyRXJyb3IpLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgKDxhbnk+eGhyRXJyb3IpLnN1YnNjcmliZXIgPSB0aGlzO1xuICAgICAgKDxhbnk+eGhyRXJyb3IpLnByb2dyZXNzU3Vic2NyaWJlciA9IHByb2dyZXNzU3Vic2NyaWJlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB4aHJSZWFkeVN0YXRlQ2hhbmdlKHRoaXM6IFhNTEh0dHBSZXF1ZXN0LCBlOiBFdmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0geGhyUmVhZHlTdGF0ZUNoYW5nZTtcbiAgICAoPGFueT54aHJSZWFkeVN0YXRlQ2hhbmdlKS5zdWJzY3JpYmVyID0gdGhpcztcbiAgICAoPGFueT54aHJSZWFkeVN0YXRlQ2hhbmdlKS5wcm9ncmVzc1N1YnNjcmliZXIgPSBwcm9ncmVzc1N1YnNjcmliZXI7XG4gICAgKDxhbnk+eGhyUmVhZHlTdGF0ZUNoYW5nZSkucmVxdWVzdCA9IHJlcXVlc3Q7XG5cbiAgICBmdW5jdGlvbiB4aHJMb2FkKHRoaXM6IFhNTEh0dHBSZXF1ZXN0LCBlOiBFdmVudCkge1xuICAgICAgY29uc3QgeyBzdWJzY3JpYmVyLCBwcm9ncmVzc1N1YnNjcmliZXIsIHJlcXVlc3QgfSA9ICg8YW55PnhockxvYWQpO1xuICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAvLyBub3JtYWxpemUgSUU5IGJ1ZyAoaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTQ1MClcbiAgICAgICAgbGV0IHN0YXR1czogbnVtYmVyID0gdGhpcy5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiB0aGlzLnN0YXR1cztcbiAgICAgICAgbGV0IHJlc3BvbnNlOiBhbnkgPSAodGhpcy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/ICAoXG4gICAgICAgICAgdGhpcy5yZXNwb25zZSB8fCB0aGlzLnJlc3BvbnNlVGV4dCkgOiB0aGlzLnJlc3BvbnNlKTtcblxuICAgICAgICAvLyBmaXggc3RhdHVzIGNvZGUgd2hlbiBpdCBpcyAwICgwIHN0YXR1cyBpcyB1bmRvY3VtZW50ZWQpLlxuICAgICAgICAvLyBPY2N1cnMgd2hlbiBhY2Nlc3NpbmcgZmlsZSByZXNvdXJjZXMgb3Igb24gQW5kcm9pZCA0LjEgc3RvY2sgYnJvd3NlclxuICAgICAgICAvLyB3aGlsZSByZXRyaWV2aW5nIGZpbGVzIGZyb20gYXBwbGljYXRpb24gY2FjaGUuXG4gICAgICAgIGlmIChzdGF0dXMgPT09IDApIHtcbiAgICAgICAgICBzdGF0dXMgPSByZXNwb25zZSA/IDIwMCA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA0eHggYW5kIDV4eCBzaG91bGQgZXJyb3IgKGh0dHBzOi8vd3d3LnczLm9yZy9Qcm90b2NvbHMvcmZjMjYxNi9yZmMyNjE2LXNlYzEwLmh0bWwpXG4gICAgICAgIGlmIChzdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1N1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGUpO1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1N1YnNjcmliZXIuZXJyb3IoZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGFqYXhFcnJvciA9IG5ldyBBamF4RXJyb3IoJ2FqYXggZXJyb3IgJyArIHN0YXR1cywgdGhpcywgcmVxdWVzdCk7XG4gICAgICAgICAgaWYgKGFqYXhFcnJvci5yZXNwb25zZSA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoYWpheEVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgeGhyLm9ubG9hZCA9IHhockxvYWQ7XG4gICAgKDxhbnk+eGhyTG9hZCkuc3Vic2NyaWJlciA9IHRoaXM7XG4gICAgKDxhbnk+eGhyTG9hZCkucHJvZ3Jlc3NTdWJzY3JpYmVyID0gcHJvZ3Jlc3NTdWJzY3JpYmVyO1xuICAgICg8YW55PnhockxvYWQpLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBkb25lLCB4aHIgfSA9IHRoaXM7XG4gICAgaWYgKCFkb25lICYmIHhociAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCAmJiB0eXBlb2YgeGhyLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB4aHIuYWJvcnQoKTtcbiAgICB9XG4gICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgbm9ybWFsaXplZCBBSkFYIHJlc3BvbnNlLlxuICpcbiAqIEBzZWUge0BsaW5rIGFqYXh9XG4gKlxuICogQGNsYXNzIEFqYXhSZXNwb25zZVxuICovXG5leHBvcnQgY2xhc3MgQWpheFJlc3BvbnNlIHtcbiAgLyoqIEB0eXBlIHtudW1iZXJ9IFRoZSBIVFRQIHN0YXR1cyBjb2RlICovXG4gIHN0YXR1czogbnVtYmVyO1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfEFycmF5QnVmZmVyfERvY3VtZW50fG9iamVjdHxhbnl9IFRoZSByZXNwb25zZSBkYXRhICovXG4gIHJlc3BvbnNlOiBhbnk7XG5cbiAgLyoqIEB0eXBlIHtzdHJpbmd9IFRoZSByYXcgcmVzcG9uc2VUZXh0ICovXG4gIHJlc3BvbnNlVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBAdHlwZSB7c3RyaW5nfSBUaGUgcmVzcG9uc2VUeXBlIChlLmcuICdqc29uJywgJ2FycmF5YnVmZmVyJywgb3IgJ3htbCcpICovXG4gIHJlc3BvbnNlVHlwZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcmlnaW5hbEV2ZW50OiBFdmVudCwgcHVibGljIHhocjogWE1MSHR0cFJlcXVlc3QsIHB1YmxpYyByZXF1ZXN0OiBBamF4UmVxdWVzdCkge1xuICAgIHRoaXMuc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICB0aGlzLnJlc3BvbnNlVHlwZSA9IHhoci5yZXNwb25zZVR5cGUgfHwgcmVxdWVzdC5yZXNwb25zZVR5cGU7XG4gICAgdGhpcy5yZXNwb25zZSA9IHBhcnNlWGhyUmVzcG9uc2UodGhpcy5yZXNwb25zZVR5cGUsIHhocik7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgQWpheEVycm9yTmFtZXMgPSAnQWpheEVycm9yJyB8ICdBamF4VGltZW91dEVycm9yJztcblxuLyoqXG4gKiBBIG5vcm1hbGl6ZWQgQUpBWCBlcnJvci5cbiAqXG4gKiBAc2VlIHtAbGluayBhamF4fVxuICpcbiAqIEBjbGFzcyBBamF4RXJyb3JcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBamF4RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKiBAdHlwZSB7WE1MSHR0cFJlcXVlc3R9IFRoZSBYSFIgaW5zdGFuY2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBlcnJvciAqL1xuICB4aHI6IFhNTEh0dHBSZXF1ZXN0O1xuXG4gIC8qKiBAdHlwZSB7QWpheFJlcXVlc3R9IFRoZSBBamF4UmVxdWVzdCBhc3NvY2lhdGVkIHdpdGggdGhlIGVycm9yICovXG4gIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0O1xuXG4gIC8qKiBAdHlwZSB7bnVtYmVyfSBUaGUgSFRUUCBzdGF0dXMgY29kZSAqL1xuICBzdGF0dXM6IG51bWJlcjtcblxuICAvKiogQHR5cGUge3N0cmluZ30gVGhlIHJlc3BvbnNlVHlwZSAoZS5nLiAnanNvbicsICdhcnJheWJ1ZmZlcicsIG9yICd4bWwnKSAqL1xuICByZXNwb25zZVR5cGU6IHN0cmluZztcblxuICAvKiogQHR5cGUge3N0cmluZ3xBcnJheUJ1ZmZlcnxEb2N1bWVudHxvYmplY3R8YW55fSBUaGUgcmVzcG9uc2UgZGF0YSAqL1xuICByZXNwb25zZTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFqYXhFcnJvckN0b3Ige1xuICBuZXcobWVzc2FnZTogc3RyaW5nLCB4aHI6IFhNTEh0dHBSZXF1ZXN0LCByZXF1ZXN0OiBBamF4UmVxdWVzdCk6IEFqYXhFcnJvcjtcbn1cblxuZnVuY3Rpb24gQWpheEVycm9ySW1wbCh0aGlzOiBhbnksIG1lc3NhZ2U6IHN0cmluZywgeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpOiBBamF4RXJyb3Ige1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB0aGlzLm5hbWUgPSAnQWpheEVycm9yJztcbiAgdGhpcy54aHIgPSB4aHI7XG4gIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIHRoaXMuc3RhdHVzID0geGhyLnN0YXR1cztcbiAgdGhpcy5yZXNwb25zZVR5cGUgPSB4aHIucmVzcG9uc2VUeXBlIHx8IHJlcXVlc3QucmVzcG9uc2VUeXBlO1xuICB0aGlzLnJlc3BvbnNlID0gcGFyc2VYaHJSZXNwb25zZSh0aGlzLnJlc3BvbnNlVHlwZSwgeGhyKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbkFqYXhFcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG5leHBvcnQgY29uc3QgQWpheEVycm9yOiBBamF4RXJyb3JDdG9yID0gQWpheEVycm9ySW1wbCBhcyBhbnk7XG5cbmZ1bmN0aW9uIHBhcnNlSnNvbih4aHI6IFhNTEh0dHBSZXF1ZXN0KSB7XG4gIC8vIEhBQ0soYmVubGVzaCk6IFR5cGVTY3JpcHQgc2hlbm5hbmlnYW5zXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgWE1MSHR0cFJlcXVlc3QgaXMgZGVmaW5lZCB0byBhbHdheXMgaGF2ZSAncmVzcG9uc2UnIGluZmVycmluZyB4aHIgYXMgbmV2ZXIgZm9yIHRoZSBlbHNlIGNsYXVzZS5cbiAgaWYgKCdyZXNwb25zZScgaW4gKHhociBhcyBhbnkpKSB7XG4gICAgLy9JRSBkb2VzIG5vdCBzdXBwb3J0IGpzb24gYXMgcmVzcG9uc2VUeXBlLCBwYXJzZSBpdCBpbnRlcm5hbGx5XG4gICAgcmV0dXJuIHhoci5yZXNwb25zZVR5cGUgPyB4aHIucmVzcG9uc2UgOiBKU09OLnBhcnNlKHhoci5yZXNwb25zZSB8fCB4aHIucmVzcG9uc2VUZXh0IHx8ICdudWxsJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoKHhociBhcyBhbnkpLnJlc3BvbnNlVGV4dCB8fCAnbnVsbCcpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlWGhyUmVzcG9uc2UocmVzcG9uc2VUeXBlOiBzdHJpbmcsIHhocjogWE1MSHR0cFJlcXVlc3QpIHtcbiAgc3dpdGNoIChyZXNwb25zZVR5cGUpIHtcbiAgICBjYXNlICdqc29uJzpcbiAgICAgICAgcmV0dXJuIHRyeUNhdGNoKHBhcnNlSnNvbikoeGhyKTtcbiAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VYTUw7XG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gSEFDSyhiZW5sZXNoKTogVHlwZVNjcmlwdCBzaGVubmFuaWdhbnNcbiAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55IFhNTEh0dHBSZXF1ZXN0IGlzIGRlZmluZWQgdG8gYWx3YXlzIGhhdmUgJ3Jlc3BvbnNlJyBpbmZlcnJpbmcgeGhyIGFzIG5ldmVyIGZvciB0aGUgZWxzZSBzdWItZXhwcmVzc2lvbi5cbiAgICAgICAgICByZXR1cm4gICgncmVzcG9uc2UnIGluICh4aHIgYXMgYW55KSkgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWpheFRpbWVvdXRFcnJvciBleHRlbmRzIEFqYXhFcnJvciB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWpheFRpbWVvdXRFcnJvckN0b3Ige1xuICBuZXcoeGhyOiBYTUxIdHRwUmVxdWVzdCwgcmVxdWVzdDogQWpheFJlcXVlc3QpOiBBamF4VGltZW91dEVycm9yO1xufVxuXG5mdW5jdGlvbiBBamF4VGltZW91dEVycm9ySW1wbCh0aGlzOiBhbnksIHhocjogWE1MSHR0cFJlcXVlc3QsIHJlcXVlc3Q6IEFqYXhSZXF1ZXN0KSB7XG4gIEFqYXhFcnJvci5jYWxsKHRoaXMsICdhamF4IHRpbWVvdXQnLCB4aHIsIHJlcXVlc3QpO1xuICB0aGlzLm5hbWUgPSAnQWpheFRpbWVvdXRFcnJvcic7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIEBzZWUge0BsaW5rIGFqYXh9XG4gKlxuICogQGNsYXNzIEFqYXhUaW1lb3V0RXJyb3JcbiAqL1xuZXhwb3J0IGNvbnN0IEFqYXhUaW1lb3V0RXJyb3I6IEFqYXhUaW1lb3V0RXJyb3JDdG9yID0gQWpheFRpbWVvdXRFcnJvckltcGwgYXMgYW55O1xuIl19