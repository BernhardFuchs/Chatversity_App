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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1hcGkudXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvdXRpbHMvYW5ndWxhci1hcGkudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBCQUE0QjtBQUc1QixJQUFNLFdBQVcsR0FBMkIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFFakY7SUFFSTtJQUF1QixDQUFDO0lBQ1YsMEJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRTtZQUMxQixjQUFjLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7U0FDbEQ7UUFDRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVNLGdDQUFPLEdBQWQsVUFBZSxJQUFZO1FBQ3ZCLElBQUksVUFBVSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBQSxPQUFPO1lBQzFCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFBLEdBQUc7Z0JBQ3hCLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7b0JBQ3BCLFVBQVUsR0FBRyxHQUFHLENBQUM7aUJBQ3BCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU87WUFDSCxNQUFNLEVBQUUsVUFBVTtZQUNsQixJQUFJLEVBQUUsVUFBVTtTQUNuQixDQUFDO0lBQ04sQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQXhCRCxJQXdCQztBQXhCWSx3Q0FBYztBQTBCM0Isa0JBQWUsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgSUFwaVNvdXJjZVJlc3VsdCB9IGZyb20gJy4vYXBpLXNvdXJjZS1yZXN1bHQuaW50ZXJmYWNlJztcblxuY29uc3QgQW5ndWxhckFQSXM6IEFycmF5PElBbmd1bGFyTWFpbkFwaT4gPSByZXF1aXJlKCcuLi9zcmMvZGF0YS9hcGktbGlzdC5qc29uJyk7XG5cbmV4cG9ydCBjbGFzcyBBbmd1bGFyQXBpVXRpbCB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEFuZ3VsYXJBcGlVdGlsO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghQW5ndWxhckFwaVV0aWwuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEFuZ3VsYXJBcGlVdGlsLmluc3RhbmNlID0gbmV3IEFuZ3VsYXJBcGlVdGlsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFuZ3VsYXJBcGlVdGlsLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaW5kQXBpKHR5cGU6IHN0cmluZyk6IElBcGlTb3VyY2VSZXN1bHQ8SUFuZ3VsYXJNYWluQXBpPiB7XG4gICAgICAgIGxldCBmb3VuZGVkQXBpO1xuICAgICAgICBfLmZvckVhY2goQW5ndWxhckFQSXMsIG1haW5BcGkgPT4ge1xuICAgICAgICAgICAgXy5mb3JFYWNoKG1haW5BcGkuaXRlbXMsIGFwaSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGFwaS50aXRsZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZGVkQXBpID0gYXBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNvdXJjZTogJ2V4dGVybmFsJyxcbiAgICAgICAgICAgIGRhdGE6IGZvdW5kZWRBcGlcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFuZ3VsYXJBcGlVdGlsLmdldEluc3RhbmNlKCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFuZ3VsYXJNYWluQXBpIHtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBpdGVtczogSUFuZ3VsYXJBcGlbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQW5ndWxhckFwaSB7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBwYXRoOiBzdHJpbmc7XG4gICAgZG9jVHlwZTogc3RyaW5nO1xuICAgIHN0YWJpbGl0eTogc3RyaW5nO1xuICAgIHNlY3VyZTogc3RyaW5nO1xuICAgIGJhcnJlbDogc3RyaW5nO1xufVxuIl19