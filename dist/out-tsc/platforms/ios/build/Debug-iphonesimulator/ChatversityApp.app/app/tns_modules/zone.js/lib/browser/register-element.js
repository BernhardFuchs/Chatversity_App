"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var define_property_1 = require("./define-property");
function patchCallbacks(target, targetName, method, callbacks) {
    var symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    var nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = targetName + "." + method + "::" + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = utils_1.ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = utils_1.wrapWithCurrentZone(descriptor.value, source);
                        define_property_1._redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = utils_1.wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = utils_1.wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    utils_1.attachOriginToPatched(target[method], nativeDelegate);
}
function registerElementPatch(_global) {
    if ((!utils_1.isBrowser && !utils_1.isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
exports.registerElementPatch = registerElementPatch;
function patchCustomElements(_global) {
    if ((!utils_1.isBrowser && !utils_1.isMix) || !('customElements' in _global)) {
        return;
    }
    var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}
exports.patchCustomElements = patchCustomElements;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXItZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9yZWdpc3Rlci1lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQTZIO0FBRTdILHFEQUFvRDtBQUVwRCxTQUFTLGNBQWMsQ0FBQyxNQUFXLEVBQUUsVUFBa0IsRUFBRSxNQUFjLEVBQUUsU0FBbUI7SUFDMUYsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNsQixPQUFPO0tBQ1I7SUFDRCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFTLElBQVMsRUFBRSxJQUFTLEVBQUUsT0FBYTtRQUMzRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFCLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRO2dCQUNqQyxJQUFNLE1BQU0sR0FBTSxVQUFVLFNBQUksTUFBTSxPQUFJLEdBQUcsUUFBUSxDQUFDO2dCQUN0RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3RDLElBQU0sVUFBVSxHQUFHLHNDQUE4QixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDdkUsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTt3QkFDbEMsVUFBVSxDQUFDLEtBQUssR0FBRywyQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNqRSxtQ0FBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztxQkFDekQ7eUJBQU0sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7d0JBQzlCLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRywyQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7cUJBQ3hFO2lCQUNGO3FCQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM5QixTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsMkJBQW1CLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUN4RTtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDO0lBRUYsNkJBQXFCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCxTQUFnQixvQkFBb0IsQ0FBQyxPQUFZO0lBQy9DLElBQUksQ0FBQyxDQUFDLGlCQUFTLElBQUksQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQWlCLElBQVUsT0FBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzdFLE9BQU87S0FDUjtJQUVELElBQU0sU0FBUyxHQUNYLENBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUU1RixjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBVEQsb0RBU0M7QUFFRCxTQUFnQixtQkFBbUIsQ0FBQyxPQUFZO0lBQzlDLElBQUksQ0FBQyxDQUFDLGlCQUFTLElBQUksQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLElBQUksT0FBTyxDQUFDLEVBQUU7UUFDNUQsT0FBTztLQUNSO0lBRUQsSUFBTSxTQUFTLEdBQ1gsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBRWpHLGNBQWMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBVEQsa0RBU0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7YXR0YWNoT3JpZ2luVG9QYXRjaGVkLCBpc0Jyb3dzZXIsIGlzTWl4LCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsIHdyYXBXaXRoQ3VycmVudFpvbmV9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5cbmltcG9ydCB7X3JlZGVmaW5lUHJvcGVydHl9IGZyb20gJy4vZGVmaW5lLXByb3BlcnR5JztcblxuZnVuY3Rpb24gcGF0Y2hDYWxsYmFja3ModGFyZ2V0OiBhbnksIHRhcmdldE5hbWU6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIGNhbGxiYWNrczogc3RyaW5nW10pIHtcbiAgY29uc3Qgc3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fKG1ldGhvZCk7XG4gIGlmICh0YXJnZXRbc3ltYm9sXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBuYXRpdmVEZWxlZ2F0ZSA9IHRhcmdldFtzeW1ib2xdID0gdGFyZ2V0W21ldGhvZF07XG4gIHRhcmdldFttZXRob2RdID0gZnVuY3Rpb24obmFtZTogYW55LCBvcHRzOiBhbnksIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLnByb3RvdHlwZSkge1xuICAgICAgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gYCR7dGFyZ2V0TmFtZX0uJHttZXRob2R9OjpgICsgY2FsbGJhY2s7XG4gICAgICAgIGNvbnN0IHByb3RvdHlwZSA9IG9wdHMucHJvdG90eXBlO1xuICAgICAgICBpZiAocHJvdG90eXBlLmhhc093blByb3BlcnR5KGNhbGxiYWNrKSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBjYWxsYmFjayk7XG4gICAgICAgICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IHdyYXBXaXRoQ3VycmVudFpvbmUoZGVzY3JpcHRvci52YWx1ZSwgc291cmNlKTtcbiAgICAgICAgICAgIF9yZWRlZmluZVByb3BlcnR5KG9wdHMucHJvdG90eXBlLCBjYWxsYmFjaywgZGVzY3JpcHRvcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChwcm90b3R5cGVbY2FsbGJhY2tdKSB7XG4gICAgICAgICAgICBwcm90b3R5cGVbY2FsbGJhY2tdID0gd3JhcFdpdGhDdXJyZW50Wm9uZShwcm90b3R5cGVbY2FsbGJhY2tdLCBzb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwcm90b3R5cGVbY2FsbGJhY2tdKSB7XG4gICAgICAgICAgcHJvdG90eXBlW2NhbGxiYWNrXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5hdGl2ZURlbGVnYXRlLmNhbGwodGFyZ2V0LCBuYW1lLCBvcHRzLCBvcHRpb25zKTtcbiAgfTtcblxuICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQodGFyZ2V0W21ldGhvZF0sIG5hdGl2ZURlbGVnYXRlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRWxlbWVudFBhdGNoKF9nbG9iYWw6IGFueSkge1xuICBpZiAoKCFpc0Jyb3dzZXIgJiYgIWlzTWl4KSB8fCAhKCdyZWdpc3RlckVsZW1lbnQnIGluICg8YW55Pl9nbG9iYWwpLmRvY3VtZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNhbGxiYWNrcyA9XG4gICAgICBbJ2NyZWF0ZWRDYWxsYmFjaycsICdhdHRhY2hlZENhbGxiYWNrJywgJ2RldGFjaGVkQ2FsbGJhY2snLCAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJ107XG5cbiAgcGF0Y2hDYWxsYmFja3MoZG9jdW1lbnQsICdEb2N1bWVudCcsICdyZWdpc3RlckVsZW1lbnQnLCBjYWxsYmFja3MpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hDdXN0b21FbGVtZW50cyhfZ2xvYmFsOiBhbnkpIHtcbiAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgISgnY3VzdG9tRWxlbWVudHMnIGluIF9nbG9iYWwpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2FsbGJhY2tzID1cbiAgICAgIFsnY29ubmVjdGVkQ2FsbGJhY2snLCAnZGlzY29ubmVjdGVkQ2FsbGJhY2snLCAnYWRvcHRlZENhbGxiYWNrJywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayddO1xuXG4gIHBhdGNoQ2FsbGJhY2tzKF9nbG9iYWwuY3VzdG9tRWxlbWVudHMsICdjdXN0b21FbGVtZW50cycsICdkZWZpbmUnLCBjYWxsYmFja3MpO1xufVxuIl19