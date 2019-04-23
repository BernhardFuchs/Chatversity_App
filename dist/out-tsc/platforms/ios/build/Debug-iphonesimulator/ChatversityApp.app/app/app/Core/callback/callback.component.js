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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbGJhY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvQ29yZS9jYWxsYmFjay9jYWxsYmFjay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdCQUF3Qjs7QUFFeEIsMkNBQTJDO0FBQzNDLGtOQUFrTjtBQUVsTixzQ0FBMEM7QUFDMUMsbURBQXFEO0FBR3JEO0lBRUUsMkJBQW9CLElBQXFCO1FBQXJCLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQ3ZDLG1EQUFtRDtRQUNuRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBTFUsaUJBQWlCO1FBRDdCLGdCQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7eUNBR0EsOEJBQWU7T0FGOUIsaUJBQWlCLENBTTdCO0lBQUQsd0JBQUM7Q0FBQSxBQU5ELElBTUM7QUFOWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjYWxsYmFjay5jb21wb25lbnQudHNcblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuLyogSW4gb3JkZXIgdG8gaGFuZGxlIHRoZSByZWRpcmVjdCBiYWNrIGZyb20gT2t0YSwgd2UgbmVlZCB0byBjYXB0dXJlIHRoZSB0b2tlbiB2YWx1ZXMgZnJvbSB0aGUgVVJMLiBVc2UgdGhlIC9jYWxsYmFjayByb3V0ZSB0byBoYW5kbGUgdGhlIGxvZ2ljIG9mIHN0b3JpbmcgdGhlc2UgdG9rZW5zIGFuZCByZWRpcmVjdGluZyBiYWNrIHRvIHRoZSBtYWluIHBhZ2UuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2t0YUF1dGhTZXJ2aWNlIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcblxuQENvbXBvbmVudCh7IHRlbXBsYXRlOiBgYCB9KVxuZXhwb3J0IGNsYXNzIENhbGxiYWNrQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9rdGE6IE9rdGFBdXRoU2VydmljZSkge1xuICAgIC8vIEhhbmRsZXMgdGhlIHJlc3BvbnNlIGZyb20gT2t0YSBhbmQgcGFyc2VzIHRva2Vuc1xuICAgIG9rdGEuaGFuZGxlQXV0aGVudGljYXRpb24oKTtcbiAgfVxufVxuIl19