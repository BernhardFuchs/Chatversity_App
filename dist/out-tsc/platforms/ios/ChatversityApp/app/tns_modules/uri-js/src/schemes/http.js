"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handler = {
    scheme: "http",
    domainHost: true,
    parse: function (components, options) {
        //report missing host
        if (!components.host) {
            components.error = components.error || "HTTP URIs must have a host.";
        }
        return components;
    },
    serialize: function (components, options) {
        //normalize the default port
        if (components.port === (String(components.scheme).toLowerCase() !== "https" ? 80 : 443) || components.port === "") {
            components.port = undefined;
        }
        //normalize the empty path
        if (!components.path) {
            components.path = "/";
        }
        //NOTE: We do not parse query strings for HTTP URIs
        //as WWW Form Url Encoded query strings are part of the HTML4+ spec,
        //and not the HTTP spec.
        return components;
    }
};
exports.default = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL3VyaS1qcy9zcmMvc2NoZW1lcy9odHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTSxPQUFPLEdBQW9CO0lBQ2hDLE1BQU0sRUFBRyxNQUFNO0lBRWYsVUFBVSxFQUFHLElBQUk7SUFFakIsS0FBSyxFQUFHLFVBQVUsVUFBd0IsRUFBRSxPQUFrQjtRQUM3RCxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDckIsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLDZCQUE2QixDQUFDO1NBQ3JFO1FBRUQsT0FBTyxVQUFVLENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVMsRUFBRyxVQUFVLFVBQXdCLEVBQUUsT0FBa0I7UUFDakUsNEJBQTRCO1FBQzVCLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssRUFBRSxFQUFFO1lBQ25ILFVBQVUsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1NBQzVCO1FBRUQsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ3JCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3RCO1FBRUQsbURBQW1EO1FBQ25ELG9FQUFvRTtRQUNwRSx3QkFBd0I7UUFFeEIsT0FBTyxVQUFVLENBQUM7SUFDbkIsQ0FBQztDQUNELENBQUM7QUFFRixrQkFBZSxPQUFPLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVUklTY2hlbWVIYW5kbGVyLCBVUklDb21wb25lbnRzLCBVUklPcHRpb25zIH0gZnJvbSBcIi4uL3VyaVwiO1xuXG5jb25zdCBoYW5kbGVyOlVSSVNjaGVtZUhhbmRsZXIgPSB7XG5cdHNjaGVtZSA6IFwiaHR0cFwiLFxuXG5cdGRvbWFpbkhvc3QgOiB0cnVlLFxuXG5cdHBhcnNlIDogZnVuY3Rpb24gKGNvbXBvbmVudHM6VVJJQ29tcG9uZW50cywgb3B0aW9uczpVUklPcHRpb25zKTpVUklDb21wb25lbnRzIHtcblx0XHQvL3JlcG9ydCBtaXNzaW5nIGhvc3Rcblx0XHRpZiAoIWNvbXBvbmVudHMuaG9zdCkge1xuXHRcdFx0Y29tcG9uZW50cy5lcnJvciA9IGNvbXBvbmVudHMuZXJyb3IgfHwgXCJIVFRQIFVSSXMgbXVzdCBoYXZlIGEgaG9zdC5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fSxcblxuXHRzZXJpYWxpemUgOiBmdW5jdGlvbiAoY29tcG9uZW50czpVUklDb21wb25lbnRzLCBvcHRpb25zOlVSSU9wdGlvbnMpOlVSSUNvbXBvbmVudHMge1xuXHRcdC8vbm9ybWFsaXplIHRoZSBkZWZhdWx0IHBvcnRcblx0XHRpZiAoY29tcG9uZW50cy5wb3J0ID09PSAoU3RyaW5nKGNvbXBvbmVudHMuc2NoZW1lKS50b0xvd2VyQ2FzZSgpICE9PSBcImh0dHBzXCIgPyA4MCA6IDQ0MykgfHwgY29tcG9uZW50cy5wb3J0ID09PSBcIlwiKSB7XG5cdFx0XHRjb21wb25lbnRzLnBvcnQgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHRcdFxuXHRcdC8vbm9ybWFsaXplIHRoZSBlbXB0eSBwYXRoXG5cdFx0aWYgKCFjb21wb25lbnRzLnBhdGgpIHtcblx0XHRcdGNvbXBvbmVudHMucGF0aCA9IFwiL1wiO1xuXHRcdH1cblxuXHRcdC8vTk9URTogV2UgZG8gbm90IHBhcnNlIHF1ZXJ5IHN0cmluZ3MgZm9yIEhUVFAgVVJJc1xuXHRcdC8vYXMgV1dXIEZvcm0gVXJsIEVuY29kZWQgcXVlcnkgc3RyaW5ncyBhcmUgcGFydCBvZiB0aGUgSFRNTDQrIHNwZWMsXG5cdFx0Ly9hbmQgbm90IHRoZSBIVFRQIHNwZWMuXG5cblx0XHRyZXR1cm4gY29tcG9uZW50cztcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlcjsiXX0=