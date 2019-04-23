"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicTypes;
(function (BasicTypes) {
    BasicTypes[BasicTypes["number"] = 0] = "number";
    BasicTypes[BasicTypes["boolean"] = 1] = "boolean";
    BasicTypes[BasicTypes["string"] = 2] = "string";
    BasicTypes[BasicTypes["object"] = 3] = "object";
    BasicTypes[BasicTypes["date"] = 4] = "date";
    BasicTypes[BasicTypes["function"] = 5] = "function";
})(BasicTypes || (BasicTypes = {}));
var BasicTypeScriptTypes;
(function (BasicTypeScriptTypes) {
    BasicTypeScriptTypes[BasicTypeScriptTypes["any"] = 0] = "any";
    BasicTypeScriptTypes[BasicTypeScriptTypes["void"] = 1] = "void";
})(BasicTypeScriptTypes || (BasicTypeScriptTypes = {}));
var BasicTypeUtil = /** @class */ (function () {
    function BasicTypeUtil() {
    }
    BasicTypeUtil.getInstance = function () {
        if (!BasicTypeUtil.instance) {
            BasicTypeUtil.instance = new BasicTypeUtil();
        }
        return BasicTypeUtil.instance;
    };
    /**
     * Checks if a given types is a basic javascript type
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
     * @param type The type to check
     */
    BasicTypeUtil.prototype.isJavascriptType = function (type) {
        if (typeof type !== 'undefined' && type.toLowerCase) {
            return type.toLowerCase() in BasicTypes;
        }
        else {
            return false;
        }
    };
    /**
     * Checks if a given type is a typescript type (That is not a javascript type)
     * https://www.typescriptlang.org/docs/handbook/basic-types.html
     * @param type The type to check
     */
    BasicTypeUtil.prototype.isTypeScriptType = function (type) {
        if (typeof type !== 'undefined' && type.toLowerCase) {
            return type.toLowerCase() in BasicTypeScriptTypes;
        }
        else {
            return false;
        }
    };
    /**
     * Check if the type is a typescript or javascript type
     * @param type The type to check
     */
    BasicTypeUtil.prototype.isKnownType = function (type) {
        return this.isJavascriptType(type) || this.isTypeScriptType(type);
    };
    /**
     * Returns a official documentation link to either the javascript or typescript type
     * @param type The type to check
     * @returns The documentation link or undefined if type not found
     */
    BasicTypeUtil.prototype.getTypeUrl = function (type) {
        if (this.isJavascriptType(type)) {
            return "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/" + type;
        }
        if (this.isTypeScriptType(type)) {
            return "https://www.typescriptlang.org/docs/handbook/basic-types.html";
        }
        return undefined;
    };
    return BasicTypeUtil;
}());
exports.BasicTypeUtil = BasicTypeUtil;
exports.default = BasicTypeUtil.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtdHlwZS51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9iYXNpYy10eXBlLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFLLFVBT0o7QUFQRCxXQUFLLFVBQVU7SUFDWCwrQ0FBTSxDQUFBO0lBQ04saURBQU8sQ0FBQTtJQUNQLCtDQUFNLENBQUE7SUFDTiwrQ0FBTSxDQUFBO0lBQ04sMkNBQUksQ0FBQTtJQUNKLG1EQUFRLENBQUE7QUFDWixDQUFDLEVBUEksVUFBVSxLQUFWLFVBQVUsUUFPZDtBQUVELElBQUssb0JBR0o7QUFIRCxXQUFLLG9CQUFvQjtJQUNyQiw2REFBRyxDQUFBO0lBQ0gsK0RBQUksQ0FBQTtBQUNSLENBQUMsRUFISSxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBR3hCO0FBRUQ7SUFFSTtJQUF1QixDQUFDO0lBQ1YseUJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtZQUN6QixhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7U0FDaEQ7UUFDRCxPQUFPLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSx3Q0FBZ0IsR0FBdkIsVUFBd0IsSUFBWTtRQUNoQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2pELE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLFVBQVUsQ0FBQztTQUMzQzthQUFNO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHdDQUFnQixHQUF2QixVQUF3QixJQUFZO1FBQ2hDLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDakQsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksb0JBQW9CLENBQUM7U0FDckQ7YUFBTTtZQUNILE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNJLG1DQUFXLEdBQWxCLFVBQW1CLElBQVk7UUFDM0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksa0NBQVUsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixPQUFPLHNGQUFvRixJQUFNLENBQUM7U0FDckc7UUFFRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixPQUFPLCtEQUErRCxDQUFDO1NBQzFFO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQyxBQTVERCxJQTREQztBQTVEWSxzQ0FBYTtBQThEMUIsa0JBQWUsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZW51bSBCYXNpY1R5cGVzIHtcbiAgICBudW1iZXIsXG4gICAgYm9vbGVhbixcbiAgICBzdHJpbmcsXG4gICAgb2JqZWN0LFxuICAgIGRhdGUsXG4gICAgZnVuY3Rpb25cbn1cblxuZW51bSBCYXNpY1R5cGVTY3JpcHRUeXBlcyB7XG4gICAgYW55LFxuICAgIHZvaWRcbn1cblxuZXhwb3J0IGNsYXNzIEJhc2ljVHlwZVV0aWwge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBCYXNpY1R5cGVVdGlsO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghQmFzaWNUeXBlVXRpbC5pbnN0YW5jZSkge1xuICAgICAgICAgICAgQmFzaWNUeXBlVXRpbC5pbnN0YW5jZSA9IG5ldyBCYXNpY1R5cGVVdGlsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJhc2ljVHlwZVV0aWwuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gdHlwZXMgaXMgYSBiYXNpYyBqYXZhc2NyaXB0IHR5cGVcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0c1xuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIGNoZWNrXG4gICAgICovXG4gICAgcHVibGljIGlzSmF2YXNjcmlwdFR5cGUodHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZS50b0xvd2VyQ2FzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKSBpbiBCYXNpY1R5cGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gdHlwZSBpcyBhIHR5cGVzY3JpcHQgdHlwZSAoVGhhdCBpcyBub3QgYSBqYXZhc2NyaXB0IHR5cGUpXG4gICAgICogaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYmFzaWMtdHlwZXMuaHRtbFxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIGNoZWNrXG4gICAgICovXG4gICAgcHVibGljIGlzVHlwZVNjcmlwdFR5cGUodHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZS50b0xvd2VyQ2FzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGUudG9Mb3dlckNhc2UoKSBpbiBCYXNpY1R5cGVTY3JpcHRUeXBlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSB0eXBlIGlzIGEgdHlwZXNjcmlwdCBvciBqYXZhc2NyaXB0IHR5cGVcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byBjaGVja1xuICAgICAqL1xuICAgIHB1YmxpYyBpc0tub3duVHlwZSh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNKYXZhc2NyaXB0VHlwZSh0eXBlKSB8fCB0aGlzLmlzVHlwZVNjcmlwdFR5cGUodHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG9mZmljaWFsIGRvY3VtZW50YXRpb24gbGluayB0byBlaXRoZXIgdGhlIGphdmFzY3JpcHQgb3IgdHlwZXNjcmlwdCB0eXBlXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyBUaGUgZG9jdW1lbnRhdGlvbiBsaW5rIG9yIHVuZGVmaW5lZCBpZiB0eXBlIG5vdCBmb3VuZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUeXBlVXJsKHR5cGU6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLmlzSmF2YXNjcmlwdFR5cGUodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvJHt0eXBlfWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1R5cGVTY3JpcHRUeXBlKHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL2Jhc2ljLXR5cGVzLmh0bWxgO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2ljVHlwZVV0aWwuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==