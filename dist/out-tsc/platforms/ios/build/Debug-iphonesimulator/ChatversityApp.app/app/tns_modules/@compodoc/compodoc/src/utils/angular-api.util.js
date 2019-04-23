"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var AngularAPIs = require('../src/data/api-list.json');
var AngularApiUtil = /** @class */ (function () {
    function AngularApiUtil() {
    }
    AngularApiUtil.getInstance = function () {
        if (!AngularApiUtil.instance) {
            AngularApiUtil.instance = new AngularApiUtil();
        }
        return AngularApiUtil.instance;
    };
    AngularApiUtil.prototype.findApi = function (type) {
        var foundedApi;
        _.forEach(AngularAPIs, function (mainApi) {
            _.forEach(mainApi.items, function (api) {
                if (api.title === type) {
                    foundedApi = api;
                }
            });
        });
        return {
            source: 'external',
            data: foundedApi
        };
    };
    return AngularApiUtil;
}());
exports.AngularApiUtil = AngularApiUtil;
exports.default = AngularApiUtil.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1hcGkudXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9hbmd1bGFyLWFwaS51dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMEJBQTRCO0FBRzVCLElBQU0sV0FBVyxHQUEyQixPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUVqRjtJQUVJO0lBQXVCLENBQUM7SUFDViwwQkFBVyxHQUF6QjtRQUNJLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1lBQzFCLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztTQUNsRDtRQUNELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRU0sZ0NBQU8sR0FBZCxVQUFlLElBQVk7UUFDdkIsSUFBSSxVQUFVLENBQUM7UUFDZixDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFBLE9BQU87WUFDMUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQUEsR0FBRztnQkFDeEIsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtvQkFDcEIsVUFBVSxHQUFHLEdBQUcsQ0FBQztpQkFDcEI7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTztZQUNILE1BQU0sRUFBRSxVQUFVO1lBQ2xCLElBQUksRUFBRSxVQUFVO1NBQ25CLENBQUM7SUFDTixDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLHdDQUFjO0FBMEIzQixrQkFBZSxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBJQXBpU291cmNlUmVzdWx0IH0gZnJvbSAnLi9hcGktc291cmNlLXJlc3VsdC5pbnRlcmZhY2UnO1xuXG5jb25zdCBBbmd1bGFyQVBJczogQXJyYXk8SUFuZ3VsYXJNYWluQXBpPiA9IHJlcXVpcmUoJy4uL3NyYy9kYXRhL2FwaS1saXN0Lmpzb24nKTtcblxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJBcGlVdGlsIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQW5ndWxhckFwaVV0aWw7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFBbmd1bGFyQXBpVXRpbC5pbnN0YW5jZSkge1xuICAgICAgICAgICAgQW5ndWxhckFwaVV0aWwuaW5zdGFuY2UgPSBuZXcgQW5ndWxhckFwaVV0aWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQW5ndWxhckFwaVV0aWwuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmRBcGkodHlwZTogc3RyaW5nKTogSUFwaVNvdXJjZVJlc3VsdDxJQW5ndWxhck1haW5BcGk+IHtcbiAgICAgICAgbGV0IGZvdW5kZWRBcGk7XG4gICAgICAgIF8uZm9yRWFjaChBbmd1bGFyQVBJcywgbWFpbkFwaSA9PiB7XG4gICAgICAgICAgICBfLmZvckVhY2gobWFpbkFwaS5pdGVtcywgYXBpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYXBpLnRpdGxlID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kZWRBcGkgPSBhcGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc291cmNlOiAnZXh0ZXJuYWwnLFxuICAgICAgICAgICAgZGF0YTogZm91bmRlZEFwaVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQW5ndWxhckFwaVV0aWwuZ2V0SW5zdGFuY2UoKTtcblxuZXhwb3J0IGludGVyZmFjZSBJQW5ndWxhck1haW5BcGkge1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGl0ZW1zOiBJQW5ndWxhckFwaVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElBbmd1bGFyQXBpIHtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHBhdGg6IHN0cmluZztcbiAgICBkb2NUeXBlOiBzdHJpbmc7XG4gICAgc3RhYmlsaXR5OiBzdHJpbmc7XG4gICAgc2VjdXJlOiBzdHJpbmc7XG4gICAgYmFycmVsOiBzdHJpbmc7XG59XG4iXX0=