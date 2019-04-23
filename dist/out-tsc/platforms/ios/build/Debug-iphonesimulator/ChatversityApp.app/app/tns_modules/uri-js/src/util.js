"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function merge() {
    var sets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sets[_i] = arguments[_i];
    }
    if (sets.length > 1) {
        sets[0] = sets[0].slice(0, -1);
        var xl = sets.length - 1;
        for (var x = 1; x < xl; ++x) {
            sets[x] = sets[x].slice(1, -1);
        }
        sets[xl] = sets[xl].slice(1);
        return sets.join('');
    }
    else {
        return sets[0];
    }
}
exports.merge = merge;
function subexp(str) {
    return "(?:" + str + ")";
}
exports.subexp = subexp;
function typeOf(o) {
    return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
}
exports.typeOf = typeOf;
function toUpperCase(str) {
    return str.toUpperCase();
}
exports.toUpperCase = toUpperCase;
function toArray(obj) {
    return obj !== undefined && obj !== null ? (obj instanceof Array ? obj : (typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj))) : [];
}
exports.toArray = toArray;
function assign(target, source) {
    var obj = target;
    if (source) {
        for (var key in source) {
            obj[key] = source[key];
        }
    }
    return obj;
}
exports.assign = assign;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvdXJpLWpzL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBZ0IsS0FBSztJQUFDLGNBQXFCO1NBQXJCLFVBQXFCLEVBQXJCLHFCQUFxQixFQUFyQixJQUFxQjtRQUFyQix5QkFBcUI7O0lBQzFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUM1QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQjtRQUNELElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyQjtTQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDZjtBQUNGLENBQUM7QUFaRCxzQkFZQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxHQUFVO0lBQ2hDLE9BQU8sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDMUIsQ0FBQztBQUZELHdCQUVDO0FBRUQsU0FBZ0IsTUFBTSxDQUFDLENBQUs7SUFDM0IsT0FBTyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3BKLENBQUM7QUFGRCx3QkFFQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxHQUFVO0lBQ3JDLE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxHQUFPO0lBQzlCLE9BQU8sR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdk0sQ0FBQztBQUZELDBCQUVDO0FBR0QsU0FBZ0IsTUFBTSxDQUFDLE1BQWMsRUFBRSxNQUFXO0lBQ2pELElBQU0sR0FBRyxHQUFHLE1BQWEsQ0FBQztJQUMxQixJQUFJLE1BQU0sRUFBRTtRQUNYLEtBQUssSUFBTSxHQUFHLElBQUksTUFBTSxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7S0FDRDtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQVJELHdCQVFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLnNldHM6QXJyYXk8c3RyaW5nPik6c3RyaW5nIHtcblx0aWYgKHNldHMubGVuZ3RoID4gMSkge1xuXHRcdHNldHNbMF0gPSBzZXRzWzBdLnNsaWNlKDAsIC0xKTtcblx0XHRjb25zdCB4bCA9IHNldHMubGVuZ3RoIC0gMTtcblx0XHRmb3IgKGxldCB4ID0gMTsgeCA8IHhsOyArK3gpIHtcblx0XHRcdHNldHNbeF0gPSBzZXRzW3hdLnNsaWNlKDEsIC0xKTtcblx0XHR9XG5cdFx0c2V0c1t4bF0gPSBzZXRzW3hsXS5zbGljZSgxKTtcblx0XHRyZXR1cm4gc2V0cy5qb2luKCcnKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gc2V0c1swXTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ViZXhwKHN0cjpzdHJpbmcpOnN0cmluZyB7XG5cdHJldHVybiBcIig/OlwiICsgc3RyICsgXCIpXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2YobzphbnkpOnN0cmluZyB7XG5cdHJldHVybiBvID09PSB1bmRlZmluZWQgPyBcInVuZGVmaW5lZFwiIDogKG8gPT09IG51bGwgPyBcIm51bGxcIiA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zcGxpdChcIiBcIikucG9wKCkuc3BsaXQoXCJdXCIpLnNoaWZ0KCkudG9Mb3dlckNhc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1VwcGVyQ2FzZShzdHI6c3RyaW5nKTpzdHJpbmcge1xuXHRyZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KG9iajphbnkpOkFycmF5PGFueT4ge1xuXHRyZXR1cm4gb2JqICE9PSB1bmRlZmluZWQgJiYgb2JqICE9PSBudWxsID8gKG9iaiBpbnN0YW5jZW9mIEFycmF5ID8gb2JqIDogKHR5cGVvZiBvYmoubGVuZ3RoICE9PSBcIm51bWJlclwiIHx8IG9iai5zcGxpdCB8fCBvYmouc2V0SW50ZXJ2YWwgfHwgb2JqLmNhbGwgPyBbb2JqXSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG9iaikpKSA6IFtdO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0OiBvYmplY3QsIHNvdXJjZTogYW55KTogYW55IHtcblx0Y29uc3Qgb2JqID0gdGFyZ2V0IGFzIGFueTtcblx0aWYgKHNvdXJjZSkge1xuXHRcdGZvciAoY29uc3Qga2V5IGluIHNvdXJjZSkge1xuXHRcdFx0b2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9iajtcbn0iXX0=