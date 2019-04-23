"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zip_1 = require("../observable/zip");
function zipAll(project) {
    return function (source) { return source.lift(new zip_1.ZipOperator(project)); };
}
exports.zipAll = zipAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwQWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3ppcEFsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUFnRDtBQVNoRCxTQUFnQixNQUFNLENBQU8sT0FBc0M7SUFDakUsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDO0FBQzFFLENBQUM7QUFGRCx3QkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFppcE9wZXJhdG9yIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS96aXAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gemlwQWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcEFsbDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgVFtdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXBBbGw8VCwgUj4ocHJvamVjdDogKC4uLnZhbHVlczogVFtdKSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcEFsbDxSPihwcm9qZWN0OiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxhbnksIFI+O1xuXG5leHBvcnQgZnVuY3Rpb24gemlwQWxsPFQsIFI+KHByb2plY3Q/OiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgWmlwT3BlcmF0b3IocHJvamVjdCkpO1xufVxuIl19