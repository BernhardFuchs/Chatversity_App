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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvdXJpLWpzL3NyYy9zY2hlbWVzL2h0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLE9BQU8sR0FBb0I7SUFDaEMsTUFBTSxFQUFHLE1BQU07SUFFZixVQUFVLEVBQUcsSUFBSTtJQUVqQixLQUFLLEVBQUcsVUFBVSxVQUF3QixFQUFFLE9BQWtCO1FBQzdELHFCQUFxQjtRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTtZQUNyQixVQUFVLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLElBQUksNkJBQTZCLENBQUM7U0FDckU7UUFFRCxPQUFPLFVBQVUsQ0FBQztJQUNuQixDQUFDO0lBRUQsU0FBUyxFQUFHLFVBQVUsVUFBd0IsRUFBRSxPQUFrQjtRQUNqRSw0QkFBNEI7UUFDNUIsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDbkgsVUFBVSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7U0FDNUI7UUFFRCwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDckIsVUFBVSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7U0FDdEI7UUFFRCxtREFBbUQ7UUFDbkQsb0VBQW9FO1FBQ3BFLHdCQUF3QjtRQUV4QixPQUFPLFVBQVUsQ0FBQztJQUNuQixDQUFDO0NBQ0QsQ0FBQztBQUVGLGtCQUFlLE9BQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVSSVNjaGVtZUhhbmRsZXIsIFVSSUNvbXBvbmVudHMsIFVSSU9wdGlvbnMgfSBmcm9tIFwiLi4vdXJpXCI7XG5cbmNvbnN0IGhhbmRsZXI6VVJJU2NoZW1lSGFuZGxlciA9IHtcblx0c2NoZW1lIDogXCJodHRwXCIsXG5cblx0ZG9tYWluSG9zdCA6IHRydWUsXG5cblx0cGFyc2UgOiBmdW5jdGlvbiAoY29tcG9uZW50czpVUklDb21wb25lbnRzLCBvcHRpb25zOlVSSU9wdGlvbnMpOlVSSUNvbXBvbmVudHMge1xuXHRcdC8vcmVwb3J0IG1pc3NpbmcgaG9zdFxuXHRcdGlmICghY29tcG9uZW50cy5ob3N0KSB7XG5cdFx0XHRjb21wb25lbnRzLmVycm9yID0gY29tcG9uZW50cy5lcnJvciB8fCBcIkhUVFAgVVJJcyBtdXN0IGhhdmUgYSBob3N0LlwiO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9LFxuXG5cdHNlcmlhbGl6ZSA6IGZ1bmN0aW9uIChjb21wb25lbnRzOlVSSUNvbXBvbmVudHMsIG9wdGlvbnM6VVJJT3B0aW9ucyk6VVJJQ29tcG9uZW50cyB7XG5cdFx0Ly9ub3JtYWxpemUgdGhlIGRlZmF1bHQgcG9ydFxuXHRcdGlmIChjb21wb25lbnRzLnBvcnQgPT09IChTdHJpbmcoY29tcG9uZW50cy5zY2hlbWUpLnRvTG93ZXJDYXNlKCkgIT09IFwiaHR0cHNcIiA/IDgwIDogNDQzKSB8fCBjb21wb25lbnRzLnBvcnQgPT09IFwiXCIpIHtcblx0XHRcdGNvbXBvbmVudHMucG9ydCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0XG5cdFx0Ly9ub3JtYWxpemUgdGhlIGVtcHR5IHBhdGhcblx0XHRpZiAoIWNvbXBvbmVudHMucGF0aCkge1xuXHRcdFx0Y29tcG9uZW50cy5wYXRoID0gXCIvXCI7XG5cdFx0fVxuXG5cdFx0Ly9OT1RFOiBXZSBkbyBub3QgcGFyc2UgcXVlcnkgc3RyaW5ncyBmb3IgSFRUUCBVUklzXG5cdFx0Ly9hcyBXV1cgRm9ybSBVcmwgRW5jb2RlZCBxdWVyeSBzdHJpbmdzIGFyZSBwYXJ0IG9mIHRoZSBIVE1MNCsgc3BlYyxcblx0XHQvL2FuZCBub3QgdGhlIEhUVFAgc3BlYy5cblxuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyOyJdfQ==