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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtdHlwZS51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2Jhc2ljLXR5cGUudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUssVUFPSjtBQVBELFdBQUssVUFBVTtJQUNYLCtDQUFNLENBQUE7SUFDTixpREFBTyxDQUFBO0lBQ1AsK0NBQU0sQ0FBQTtJQUNOLCtDQUFNLENBQUE7SUFDTiwyQ0FBSSxDQUFBO0lBQ0osbURBQVEsQ0FBQTtBQUNaLENBQUMsRUFQSSxVQUFVLEtBQVYsVUFBVSxRQU9kO0FBRUQsSUFBSyxvQkFHSjtBQUhELFdBQUssb0JBQW9CO0lBQ3JCLDZEQUFHLENBQUE7SUFDSCwrREFBSSxDQUFBO0FBQ1IsQ0FBQyxFQUhJLG9CQUFvQixLQUFwQixvQkFBb0IsUUFHeEI7QUFFRDtJQUVJO0lBQXVCLENBQUM7SUFDVix5QkFBVyxHQUF6QjtRQUNJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO1lBQ3pCLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztTQUNoRDtRQUNELE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHdDQUFnQixHQUF2QixVQUF3QixJQUFZO1FBQ2hDLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDakQsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksVUFBVSxDQUFDO1NBQzNDO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksd0NBQWdCLEdBQXZCLFVBQXdCLElBQVk7UUFDaEMsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNqRCxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxvQkFBb0IsQ0FBQztTQUNyRDthQUFNO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksbUNBQVcsR0FBbEIsVUFBbUIsSUFBWTtRQUMzQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxrQ0FBVSxHQUFqQixVQUFrQixJQUFZO1FBQzFCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLE9BQU8sc0ZBQW9GLElBQU0sQ0FBQztTQUNyRztRQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLE9BQU8sK0RBQStELENBQUM7U0FDMUU7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQUFDLEFBNURELElBNERDO0FBNURZLHNDQUFhO0FBOEQxQixrQkFBZSxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJlbnVtIEJhc2ljVHlwZXMge1xuICAgIG51bWJlcixcbiAgICBib29sZWFuLFxuICAgIHN0cmluZyxcbiAgICBvYmplY3QsXG4gICAgZGF0ZSxcbiAgICBmdW5jdGlvblxufVxuXG5lbnVtIEJhc2ljVHlwZVNjcmlwdFR5cGVzIHtcbiAgICBhbnksXG4gICAgdm9pZFxufVxuXG5leHBvcnQgY2xhc3MgQmFzaWNUeXBlVXRpbCB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEJhc2ljVHlwZVV0aWw7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFCYXNpY1R5cGVVdGlsLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBCYXNpY1R5cGVVdGlsLmluc3RhbmNlID0gbmV3IEJhc2ljVHlwZVV0aWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQmFzaWNUeXBlVXRpbC5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSBnaXZlbiB0eXBlcyBpcyBhIGJhc2ljIGphdmFzY3JpcHQgdHlwZVxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgdG8gY2hlY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNKYXZhc2NyaXB0VHlwZSh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlLnRvTG93ZXJDYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpIGluIEJhc2ljVHlwZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSBnaXZlbiB0eXBlIGlzIGEgdHlwZXNjcmlwdCB0eXBlIChUaGF0IGlzIG5vdCBhIGphdmFzY3JpcHQgdHlwZSlcbiAgICAgKiBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9iYXNpYy10eXBlcy5odG1sXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgdG8gY2hlY2tcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNUeXBlU2NyaXB0VHlwZSh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlLnRvTG93ZXJDYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZS50b0xvd2VyQ2FzZSgpIGluIEJhc2ljVHlwZVNjcmlwdFR5cGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHR5cGUgaXMgYSB0eXBlc2NyaXB0IG9yIGphdmFzY3JpcHQgdHlwZVxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIHRvIGNoZWNrXG4gICAgICovXG4gICAgcHVibGljIGlzS25vd25UeXBlKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0phdmFzY3JpcHRUeXBlKHR5cGUpIHx8IHRoaXMuaXNUeXBlU2NyaXB0VHlwZSh0eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgb2ZmaWNpYWwgZG9jdW1lbnRhdGlvbiBsaW5rIHRvIGVpdGhlciB0aGUgamF2YXNjcmlwdCBvciB0eXBlc2NyaXB0IHR5cGVcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIFRoZSBkb2N1bWVudGF0aW9uIGxpbmsgb3IgdW5kZWZpbmVkIGlmIHR5cGUgbm90IGZvdW5kXG4gICAgICovXG4gICAgcHVibGljIGdldFR5cGVVcmwodHlwZTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNKYXZhc2NyaXB0VHlwZSh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy8ke3R5cGV9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVHlwZVNjcmlwdFR5cGUodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svYmFzaWMtdHlwZXMuaHRtbGA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzaWNUeXBlVXRpbC5nZXRJbnN0YW5jZSgpO1xuIl19