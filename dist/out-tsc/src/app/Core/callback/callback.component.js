"use strict";
// callback.component.ts
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-line-length
/* In order to handle the redirect back from Okta, we need to capture the token values from the URL. Use the /callback route to handle the logic of storing these tokens and redirecting back to the main page. */
var core_1 = require("@angular/core");
var okta_angular_1 = require("@okta/okta-angular");
var CallbackComponent = /** @class */ (function () {
    function CallbackComponent(okta) {
        this.okta = okta;
        // Handles the response from Okta and parses tokens
        okta.handleAuthentication();
    }
    CallbackComponent = __decorate([
        core_1.Component({ template: "" }),
        __metadata("design:paramtypes", [okta_angular_1.OktaAuthService])
    ], CallbackComponent);
    return CallbackComponent;
}());
exports.CallbackComponent = CallbackComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Db3JlL2NhbGxiYWNrL2NhbGxiYWNrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQXdCOztBQUV4QiwyQ0FBMkM7QUFDM0Msa05BQWtOO0FBRWxOLHNDQUEwQztBQUMxQyxtREFBcUQ7QUFHckQ7SUFFRSwyQkFBb0IsSUFBcUI7UUFBckIsU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFDdkMsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFMVSxpQkFBaUI7UUFEN0IsZ0JBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQzt5Q0FHQSw4QkFBZTtPQUY5QixpQkFBaUIsQ0FNN0I7SUFBRCx3QkFBQztDQUFBLEFBTkQsSUFNQztBQU5ZLDhDQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNhbGxiYWNrLmNvbXBvbmVudC50c1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4vKiBJbiBvcmRlciB0byBoYW5kbGUgdGhlIHJlZGlyZWN0IGJhY2sgZnJvbSBPa3RhLCB3ZSBuZWVkIHRvIGNhcHR1cmUgdGhlIHRva2VuIHZhbHVlcyBmcm9tIHRoZSBVUkwuIFVzZSB0aGUgL2NhbGxiYWNrIHJvdXRlIHRvIGhhbmRsZSB0aGUgbG9naWMgb2Ygc3RvcmluZyB0aGVzZSB0b2tlbnMgYW5kIHJlZGlyZWN0aW5nIGJhY2sgdG8gdGhlIG1haW4gcGFnZS4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPa3RhQXV0aFNlcnZpY2UgfSBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuXG5AQ29tcG9uZW50KHsgdGVtcGxhdGU6IGBgIH0pXG5leHBvcnQgY2xhc3MgQ2FsbGJhY2tDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb2t0YTogT2t0YUF1dGhTZXJ2aWNlKSB7XG4gICAgLy8gSGFuZGxlcyB0aGUgcmVzcG9uc2UgZnJvbSBPa3RhIGFuZCBwYXJzZXMgdG9rZW5zXG4gICAgb2t0YS5oYW5kbGVBdXRoZW50aWNhdGlvbigpO1xuICB9XG59XG4iXX0=