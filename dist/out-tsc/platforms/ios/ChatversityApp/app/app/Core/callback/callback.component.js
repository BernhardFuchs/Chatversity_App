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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL0NvcmUvY2FsbGJhY2svY2FsbGJhY2suY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3QkFBd0I7O0FBRXhCLDJDQUEyQztBQUMzQyxrTkFBa047QUFFbE4sc0NBQTBDO0FBQzFDLG1EQUFxRDtBQUdyRDtJQUVFLDJCQUFvQixJQUFxQjtRQUFyQixTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUN2QyxtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUxVLGlCQUFpQjtRQUQ3QixnQkFBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDO3lDQUdBLDhCQUFlO09BRjlCLGlCQUFpQixDQU03QjtJQUFELHdCQUFDO0NBQUEsQUFORCxJQU1DO0FBTlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY2FsbGJhY2suY29tcG9uZW50LnRzXG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbi8qIEluIG9yZGVyIHRvIGhhbmRsZSB0aGUgcmVkaXJlY3QgYmFjayBmcm9tIE9rdGEsIHdlIG5lZWQgdG8gY2FwdHVyZSB0aGUgdG9rZW4gdmFsdWVzIGZyb20gdGhlIFVSTC4gVXNlIHRoZSAvY2FsbGJhY2sgcm91dGUgdG8gaGFuZGxlIHRoZSBsb2dpYyBvZiBzdG9yaW5nIHRoZXNlIHRva2VucyBhbmQgcmVkaXJlY3RpbmcgYmFjayB0byB0aGUgbWFpbiBwYWdlLiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9rdGFBdXRoU2VydmljZSB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5cbkBDb21wb25lbnQoeyB0ZW1wbGF0ZTogYGAgfSlcbmV4cG9ydCBjbGFzcyBDYWxsYmFja0NvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBva3RhOiBPa3RhQXV0aFNlcnZpY2UpIHtcbiAgICAvLyBIYW5kbGVzIHRoZSByZXNwb25zZSBmcm9tIE9rdGEgYW5kIHBhcnNlcyB0b2tlbnNcbiAgICBva3RhLmhhbmRsZUF1dGhlbnRpY2F0aW9uKCk7XG4gIH1cbn1cbiJdfQ==