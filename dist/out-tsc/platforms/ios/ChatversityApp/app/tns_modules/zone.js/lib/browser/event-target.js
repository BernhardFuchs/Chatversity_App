"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../common/events");
var utils_1 = require("../common/utils");
var property_descriptor_1 = require("./property-descriptor");
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = utils_1.isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < property_descriptor_1.eventNames.length; i++) {
        var eventName = property_descriptor_1.eventNames[i];
        var falseEventName = eventName + utils_1.FALSE_STR;
        var trueEventName = eventName + utils_1.TRUE_STR;
        var symbol = utils_1.ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = utils_1.ZONE_SYMBOL_PREFIX + trueEventName;
        events_1.zoneSymbolEventNames[eventName] = {};
        events_1.zoneSymbolEventNames[eventName][utils_1.FALSE_STR] = symbol;
        events_1.zoneSymbolEventNames[eventName][utils_1.TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = events_1.globalSources[target] = {};
        for (var j = 0; j < property_descriptor_1.eventNames.length; j++) {
            var eventName = property_descriptor_1.eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    events_1.patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = events_1.patchEventTarget;
    return true;
}
exports.eventTargetPatch = eventTargetPatch;
function patchEvent(global, api) {
    events_1.patchEventPrototype(global, api);
}
exports.patchEvent = patchEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtdGFyZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9ldmVudC10YXJnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyQ0FBNEc7QUFDNUcseUNBQW9GO0FBRXBGLDZEQUFpRDtBQUVqRCxTQUFnQixnQkFBZ0IsQ0FBQyxPQUFZLEVBQUUsR0FBaUI7SUFDOUQsSUFBTSxhQUFhLEdBQ2YsMmFBQTJhLENBQUM7SUFDaGIsSUFBTSxlQUFlLEdBQ2pCLCtXQUErVztTQUMxVyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEIsSUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDO0lBRW5DLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNkLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixJQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFckQsSUFBSSxLQUFLLEVBQUU7UUFDVCx5RUFBeUU7UUFDekUsSUFBSSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLE1BQU0sR0FBRyxDQUFDLEdBQUcsU0FBUyxFQUF0QixDQUFzQixDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3ZGO1NBQU0sSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN6QjtTQUFNO1FBQ0wsc0RBQXNEO1FBQ3RELDRGQUE0RjtRQUM1RixJQUFJLEdBQUcsZUFBZSxDQUFDO0tBQ3hCO0lBRUQsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMs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UUFBUSxFQUFFLENBQUM7YUFDckI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUM7SUFFRixJQUFNLFFBQVEsR0FBVSxFQUFFLENBQUM7SUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN2QztJQUNELCtDQUErQztJQUMvQyxzQ0FBc0M7SUFDdEMseUJBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFDLEVBQUUsRUFBRSxzQkFBc0IsRUFBQyxDQUFDLENBQUM7SUFDbEUsR0FBRyxDQUFDLGdCQUFnQixHQUFHLHlCQUFnQixDQUFDO0lBRXhDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWhHRCw0Q0FnR0M7QUFFRCxTQUFnQixVQUFVLENBQUMsTUFBVyxFQUFFLEdBQWlCO0lBQ3ZELDRCQUFtQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRkQsZ0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z2xvYmFsU291cmNlcywgcGF0Y2hFdmVudFByb3RvdHlwZSwgcGF0Y2hFdmVudFRhcmdldCwgem9uZVN5bWJvbEV2ZW50TmFtZXN9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHtGQUxTRV9TVFIsIGlzSUVPckVkZ2UsIFRSVUVfU1RSLCBaT05FX1NZTUJPTF9QUkVGSVh9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5cbmltcG9ydCB7ZXZlbnROYW1lc30gZnJvbSAnLi9wcm9wZXJ0eS1kZXNjcmlwdG9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZW50VGFyZ2V0UGF0Y2goX2dsb2JhbDogYW55LCBhcGk6IF9ab25lUHJpdmF0ZSkge1xuICBjb25zdCBXVEZfSVNTVUVfNTU1ID1cbiAgICAgICdBbmNob3IsQXJlYSxBdWRpbyxCUixCYXNlLEJhc2VGb250LEJvZHksQnV0dG9uLENhbnZhcyxDb250ZW50LERMaXN0LERpcmVjdG9yeSxEaXYsRW1iZWQsRmllbGRTZXQsRm9udCxGb3JtLEZyYW1lLEZyYW1lU2V0LEhSLEhlYWQsSGVhZGluZyxIdG1sLElGcmFtZSxJbWFnZSxJbnB1dCxLZXlnZW4sTEksTGFiZWwsTGVnZW5kLExpbmssTWFwLE1hcnF1ZWUsTWVkaWEsTWVudSxNZXRhLE1ldGVyLE1vZCxPTGlzdCxPYmplY3QsT3B0R3JvdXAsT3B0aW9uLE91dHB1dCxQYXJhZ3JhcGgsUHJlLFByb2dyZXNzLFF1b3RlLFNjcmlwdCxTZWxlY3QsU291cmNlLFNwYW4sU3R5bGUsVGFibGVDYXB0aW9uLFRhYmxlQ2VsbCxUYWJsZUNvbCxUYWJsZSxUYWJsZVJvdyxUYWJsZVNlY3Rpb24sVGV4dEFyZWEsVGl0bGUsVHJhY2ssVUxpc3QsVW5rbm93bixWaWRlbyc7XG4gIGNvbnN0IE5PX0VWRU5UX1RBUkdFVCA9XG4gICAgICAnQXBwbGljYXRpb25DYWNoZSxFdmVudFNvdXJjZSxGaWxlUmVhZGVyLElucHV0TWV0aG9kQ29udGV4dCxNZWRpYUNvbnRyb2xsZXIsTWVzc2FnZVBvcnQsTm9kZSxQZXJmb3JtYW5jZSxTVkdFbGVtZW50SW5zdGFuY2UsU2hhcmVkV29ya2VyLFRleHRUcmFjayxUZXh0VHJhY2tDdWUsVGV4dFRyYWNrTGlzdCxXZWJLaXROYW1lZEZsb3csV2luZG93LFdvcmtlcixXb3JrZXJHbG9iYWxTY29wZSxYTUxIdHRwUmVxdWVzdCxYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LFhNTEh0dHBSZXF1ZXN0VXBsb2FkLElEQlJlcXVlc3QsSURCT3BlbkRCUmVxdWVzdCxJREJEYXRhYmFzZSxJREJUcmFuc2FjdGlvbixJREJDdXJzb3IsREJJbmRleCxXZWJTb2NrZXQnXG4gICAgICAgICAgLnNwbGl0KCcsJyk7XG4gIGNvbnN0IEVWRU5UX1RBUkdFVCA9ICdFdmVudFRhcmdldCc7XG5cbiAgbGV0IGFwaXMgPSBbXTtcbiAgY29uc3QgaXNXdGYgPSBfZ2xvYmFsWyd3dGYnXTtcbiAgY29uc3QgV1RGX0lTU1VFXzU1NV9BUlJBWSA9IFdURl9JU1NVRV81NTUuc3BsaXQoJywnKTtcblxuICBpZiAoaXNXdGYpIHtcbiAgICAvLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS90cmFjaW5nLWZyYW1ld29yay9pc3N1ZXMvNTU1XG4gICAgYXBpcyA9IFdURl9JU1NVRV81NTVfQVJSQVkubWFwKCh2KSA9PiAnSFRNTCcgKyB2ICsgJ0VsZW1lbnQnKS5jb25jYXQoTk9fRVZFTlRfVEFSR0VUKTtcbiAgfSBlbHNlIGlmIChfZ2xvYmFsW0VWRU5UX1RBUkdFVF0pIHtcbiAgICBhcGlzLnB1c2goRVZFTlRfVEFSR0VUKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBOb3RlOiBFdmVudFRhcmdldCBpcyBub3QgYXZhaWxhYmxlIGluIGFsbCBicm93c2VycyxcbiAgICAvLyBpZiBpdCdzIG5vdCBhdmFpbGFibGUsIHdlIGluc3RlYWQgcGF0Y2ggdGhlIEFQSXMgaW4gdGhlIElETCB0aGF0IGluaGVyaXQgZnJvbSBFdmVudFRhcmdldFxuICAgIGFwaXMgPSBOT19FVkVOVF9UQVJHRVQ7XG4gIH1cblxuICBjb25zdCBpc0Rpc2FibGVJRUNoZWNrID0gX2dsb2JhbFsnX19ab25lX2Rpc2FibGVfSUVfY2hlY2snXSB8fCBmYWxzZTtcbiAgY29uc3QgaXNFbmFibGVDcm9zc0NvbnRleHRDaGVjayA9IF9nbG9iYWxbJ19fWm9uZV9lbmFibGVfY3Jvc3NfY29udGV4dF9jaGVjayddIHx8IGZhbHNlO1xuICBjb25zdCBpZU9yRWRnZSA9IGlzSUVPckVkZ2UoKTtcblxuICBjb25zdCBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFID0gJy5hZGRFdmVudExpc3RlbmVyOic7XG4gIGNvbnN0IEZVTkNUSU9OX1dSQVBQRVIgPSAnW29iamVjdCBGdW5jdGlvbldyYXBwZXJdJztcbiAgY29uc3QgQlJPV1NFUl9UT09MUyA9ICdmdW5jdGlvbiBfX0JST1dTRVJUT09MU19DT05TT0xFX1NBRkVGVU5DKCkgeyBbbmF0aXZlIGNvZGVdIH0nO1xuXG4gIC8vICBwcmVkZWZpbmUgYWxsIF9fem9uZV9zeW1ib2xfXyArIGV2ZW50TmFtZSArIHRydWUvZmFsc2Ugc3RyaW5nXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50TmFtZXNbaV07XG4gICAgY29uc3QgZmFsc2VFdmVudE5hbWUgPSBldmVudE5hbWUgKyBGQUxTRV9TVFI7XG4gICAgY29uc3QgdHJ1ZUV2ZW50TmFtZSA9IGV2ZW50TmFtZSArIFRSVUVfU1RSO1xuICAgIGNvbnN0IHN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIGZhbHNlRXZlbnROYW1lO1xuICAgIGNvbnN0IHN5bWJvbENhcHR1cmUgPSBaT05FX1NZTUJPTF9QUkVGSVggKyB0cnVlRXZlbnROYW1lO1xuICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV0gPSB7fTtcbiAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW0ZBTFNFX1NUUl0gPSBzeW1ib2w7XG4gICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtUUlVFX1NUUl0gPSBzeW1ib2xDYXB0dXJlO1xuICB9XG5cbiAgLy8gIHByZWRlZmluZSBhbGwgdGFzay5zb3VyY2Ugc3RyaW5nXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgV1RGX0lTU1VFXzU1NS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHRhcmdldDogYW55ID0gV1RGX0lTU1VFXzU1NV9BUlJBWVtpXTtcbiAgICBjb25zdCB0YXJnZXRzOiBhbnkgPSBnbG9iYWxTb3VyY2VzW3RhcmdldF0gPSB7fTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGV2ZW50TmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50TmFtZXNbal07XG4gICAgICB0YXJnZXRzW2V2ZW50TmFtZV0gPSB0YXJnZXQgKyBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFICsgZXZlbnROYW1lO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNoZWNrSUVBbmRDcm9zc0NvbnRleHQgPSBmdW5jdGlvbihcbiAgICAgIG5hdGl2ZURlbGVnYXRlOiBhbnksIGRlbGVnYXRlOiBhbnksIHRhcmdldDogYW55LCBhcmdzOiBhbnkpIHtcbiAgICBpZiAoIWlzRGlzYWJsZUlFQ2hlY2sgJiYgaWVPckVkZ2UpIHtcbiAgICAgIGlmIChpc0VuYWJsZUNyb3NzQ29udGV4dENoZWNrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdGVzdFN0cmluZyA9IGRlbGVnYXRlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgaWYgKCh0ZXN0U3RyaW5nID09PSBGVU5DVElPTl9XUkFQUEVSIHx8IHRlc3RTdHJpbmcgPT0gQlJPV1NFUl9UT09MUykpIHtcbiAgICAgICAgICAgIG5hdGl2ZURlbGVnYXRlLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIG5hdGl2ZURlbGVnYXRlLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0ZXN0U3RyaW5nID0gZGVsZWdhdGUudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKCh0ZXN0U3RyaW5nID09PSBGVU5DVElPTl9XUkFQUEVSIHx8IHRlc3RTdHJpbmcgPT0gQlJPV1NFUl9UT09MUykpIHtcbiAgICAgICAgICBuYXRpdmVEZWxlZ2F0ZS5hcHBseSh0YXJnZXQsIGFyZ3MpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNFbmFibGVDcm9zc0NvbnRleHRDaGVjaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGVsZWdhdGUudG9TdHJpbmcoKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIG5hdGl2ZURlbGVnYXRlLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgYXBpVHlwZXM6IGFueVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXBpcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHR5cGUgPSBfZ2xvYmFsW2FwaXNbaV1dO1xuICAgIGFwaVR5cGVzLnB1c2godHlwZSAmJiB0eXBlLnByb3RvdHlwZSk7XG4gIH1cbiAgLy8gdmggaXMgdmFsaWRhdGVIYW5kbGVyIHRvIGNoZWNrIGV2ZW50IGhhbmRsZXJcbiAgLy8gaXMgdmFsaWQgb3Igbm90KGZvciBzZWN1cml0eSBjaGVjaylcbiAgcGF0Y2hFdmVudFRhcmdldChfZ2xvYmFsLCBhcGlUeXBlcywge3ZoOiBjaGVja0lFQW5kQ3Jvc3NDb250ZXh0fSk7XG4gIGFwaS5wYXRjaEV2ZW50VGFyZ2V0ID0gcGF0Y2hFdmVudFRhcmdldDtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRXZlbnQoZ2xvYmFsOiBhbnksIGFwaTogX1pvbmVQcml2YXRlKSB7XG4gIHBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsLCBhcGkpO1xufVxuIl19