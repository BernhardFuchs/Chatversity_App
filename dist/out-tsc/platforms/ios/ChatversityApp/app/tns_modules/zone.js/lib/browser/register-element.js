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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXItZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvcmVnaXN0ZXItZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUE2SDtBQUU3SCxxREFBb0Q7QUFFcEQsU0FBUyxjQUFjLENBQUMsTUFBVyxFQUFFLFVBQWtCLEVBQUUsTUFBYyxFQUFFLFNBQW1CO0lBQzFGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDbEIsT0FBTztLQUNSO0lBQ0QsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsVUFBUyxJQUFTLEVBQUUsSUFBUyxFQUFFLE9BQWE7UUFDM0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMxQixTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtnQkFDakMsSUFBTSxNQUFNLEdBQU0sVUFBVSxTQUFJLE1BQU0sT0FBSSxHQUFHLFFBQVEsQ0FBQztnQkFDdEQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDakMsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN0QyxJQUFNLFVBQVUsR0FBRyxzQ0FBOEIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3ZFLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7d0JBQ2xDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsMkJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDakUsbUNBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQ3pEO3lCQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO3dCQUM5QixTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsMkJBQW1CLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUN4RTtpQkFDRjtxQkFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDOUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDeEU7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQztJQUVGLDZCQUFxQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsU0FBZ0Isb0JBQW9CLENBQUMsT0FBWTtJQUMvQyxJQUFJLENBQUMsQ0FBQyxpQkFBUyxJQUFJLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixJQUFVLE9BQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUM3RSxPQUFPO0tBQ1I7SUFFRCxJQUFNLFNBQVMsR0FDWCxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFFNUYsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsQ0FBQztBQVRELG9EQVNDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsT0FBWTtJQUM5QyxJQUFJLENBQUMsQ0FBQyxpQkFBUyxJQUFJLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxFQUFFO1FBQzVELE9BQU87S0FDUjtJQUVELElBQU0sU0FBUyxHQUNYLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUVqRyxjQUFjLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQVRELGtEQVNDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2F0dGFjaE9yaWdpblRvUGF0Y2hlZCwgaXNCcm93c2VyLCBpc01peCwgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLCB3cmFwV2l0aEN1cnJlbnRab25lfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuXG5pbXBvcnQge19yZWRlZmluZVByb3BlcnR5fSBmcm9tICcuL2RlZmluZS1wcm9wZXJ0eSc7XG5cbmZ1bmN0aW9uIHBhdGNoQ2FsbGJhY2tzKHRhcmdldDogYW55LCB0YXJnZXROYW1lOiBzdHJpbmcsIG1ldGhvZDogc3RyaW5nLCBjYWxsYmFja3M6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IHN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXyhtZXRob2QpO1xuICBpZiAodGFyZ2V0W3N5bWJvbF0pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgbmF0aXZlRGVsZWdhdGUgPSB0YXJnZXRbc3ltYm9sXSA9IHRhcmdldFttZXRob2RdO1xuICB0YXJnZXRbbWV0aG9kXSA9IGZ1bmN0aW9uKG5hbWU6IGFueSwgb3B0czogYW55LCBvcHRpb25zPzogYW55KSB7XG4gICAgaWYgKG9wdHMgJiYgb3B0cy5wcm90b3R5cGUpIHtcbiAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IGAke3RhcmdldE5hbWV9LiR7bWV0aG9kfTo6YCArIGNhbGxiYWNrO1xuICAgICAgICBjb25zdCBwcm90b3R5cGUgPSBvcHRzLnByb3RvdHlwZTtcbiAgICAgICAgaWYgKHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShjYWxsYmFjaykpIHtcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgY2FsbGJhY2spO1xuICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWUpIHtcbiAgICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSB3cmFwV2l0aEN1cnJlbnRab25lKGRlc2NyaXB0b3IudmFsdWUsIHNvdXJjZSk7XG4gICAgICAgICAgICBfcmVkZWZpbmVQcm9wZXJ0eShvcHRzLnByb3RvdHlwZSwgY2FsbGJhY2ssIGRlc2NyaXB0b3IpO1xuICAgICAgICAgIH0gZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgICAgcHJvdG90eXBlW2NhbGxiYWNrXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSB3cmFwV2l0aEN1cnJlbnRab25lKHByb3RvdHlwZVtjYWxsYmFja10sIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuYXRpdmVEZWxlZ2F0ZS5jYWxsKHRhcmdldCwgbmFtZSwgb3B0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRhcmdldFttZXRob2RdLCBuYXRpdmVEZWxlZ2F0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckVsZW1lbnRQYXRjaChfZ2xvYmFsOiBhbnkpIHtcbiAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgISgncmVnaXN0ZXJFbGVtZW50JyBpbiAoPGFueT5fZ2xvYmFsKS5kb2N1bWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjYWxsYmFja3MgPVxuICAgICAgWydjcmVhdGVkQ2FsbGJhY2snLCAnYXR0YWNoZWRDYWxsYmFjaycsICdkZXRhY2hlZENhbGxiYWNrJywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayddO1xuXG4gIHBhdGNoQ2FsbGJhY2tzKGRvY3VtZW50LCAnRG9jdW1lbnQnLCAncmVnaXN0ZXJFbGVtZW50JywgY2FsbGJhY2tzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoQ3VzdG9tRWxlbWVudHMoX2dsb2JhbDogYW55KSB7XG4gIGlmICgoIWlzQnJvd3NlciAmJiAhaXNNaXgpIHx8ICEoJ2N1c3RvbUVsZW1lbnRzJyBpbiBfZ2xvYmFsKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNhbGxiYWNrcyA9XG4gICAgICBbJ2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Fkb3B0ZWRDYWxsYmFjaycsICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snXTtcblxuICBwYXRjaENhbGxiYWNrcyhfZ2xvYmFsLmN1c3RvbUVsZW1lbnRzLCAnY3VzdG9tRWxlbWVudHMnLCAnZGVmaW5lJywgY2FsbGJhY2tzKTtcbn1cbiJdfQ==