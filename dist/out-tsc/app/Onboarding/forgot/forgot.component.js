"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var form_validation_1 = require("../../Core/_models/form-validation");
var ForgotComponent = /** @class */ (function () {
    function ForgotComponent(formBuilder, route, router) {
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.loading = false;
        this.submitted = false;
        this.appTitle = 'Forgot Password';
        this.formValidation = new form_validation_1.CustomFormValidation();
    }
    ForgotComponent.prototype.ngOnInit = function () {
        this.forgotForm = this.formBuilder.group({
            email: ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.email, forms_1.Validators.pattern(this.formValidation.regularEmailValidation)])]
        });
        this.returnUrl = '/';
    };
    Object.defineProperty(ForgotComponent.prototype, "f", {
        // Convenience getter for easy access to form fields
        get: function () { return this.forgotForm.controls; },
        enumerable: true,
        configurable: true
    });
    ForgotComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.loading = true;
        // http.post(`${environment.apiUrl}/recovery/forgot`);
        // stop here if form is invalid
        if (this.forgotForm.invalid) {
            this.loading = false;
            return;
        }
        // Create obj to hold formdata
        var formData = new FormData();
        // Append input to form data
        formData.append('password', this.forgotForm.get('email').value);
        this.loading = false;
    };
    ForgotComponent = __decorate([
        core_1.Component({
            selector: 'app-forgot',
            templateUrl: './forgot.component.html',
            styleUrls: ['./forgot.component.css'],
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            router_1.ActivatedRoute,
            router_1.Router])
    ], ForgotComponent);
    return ForgotComponent;
}());
exports.ForgotComponent = ForgotComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvT25ib2FyZGluZy9mb3Jnb3QvZm9yZ290LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUtsRCx3Q0FBeUY7QUFDekYsMENBQXlEO0FBR3pELHNFQUEwRTtBQU8xRTtJQVFFLHlCQUNVLFdBQXdCLEVBQ3hCLEtBQXFCLEVBQ3JCLE1BQWM7UUFGZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUNyQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBVHhCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixhQUFRLEdBQUcsaUJBQWlCLENBQUM7UUFDN0IsbUJBQWMsR0FBeUIsSUFBSSxzQ0FBb0IsRUFBRSxDQUFDO0lBS3RDLENBQUM7SUFFN0Isa0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDdkMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFVLENBQUMsT0FBTyxDQUFDLENBQUUsa0JBQVUsQ0FBQyxRQUFRLEVBQUUsa0JBQVUsQ0FBQyxLQUFLLEVBQUUsa0JBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxSSxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN2QixDQUFDO0lBR0Qsc0JBQUksOEJBQUM7UUFETCxvREFBb0Q7YUFDcEQsY0FBVSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFNUMsa0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXBCLHNEQUFzRDtRQUV0RCwrQkFBK0I7UUFDL0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixPQUFPO1NBQ1I7UUFFRCw4QkFBOEI7UUFDOUIsSUFBTSxRQUFRLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUUxQyw0QkFBNEI7UUFDNUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQTNDVSxlQUFlO1FBTDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1NBQ3RDLENBQUM7eUNBVXVCLG1CQUFXO1lBQ2pCLHVCQUFjO1lBQ2IsZUFBTTtPQVhiLGVBQWUsQ0E2QzNCO0lBQUQsc0JBQUM7Q0FBQSxBQTdDRCxJQTZDQztBQTdDWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2t0YUF1dGhTZXJ2aWNlIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IEN1c3RvbUZvcm1WYWxpZGF0aW9uIH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL2Zvcm0tdmFsaWRhdGlvbic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1mb3Jnb3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vZm9yZ290LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vZm9yZ290LmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgRm9yZ290Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgZm9yZ290Rm9ybTogRm9ybUdyb3VwO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIHN1Ym1pdHRlZCA9IGZhbHNlO1xuICByZXR1cm5Vcmw6IHN0cmluZztcbiAgYXBwVGl0bGUgPSAnRm9yZ290IFBhc3N3b3JkJztcbiAgZm9ybVZhbGlkYXRpb246IEN1c3RvbUZvcm1WYWxpZGF0aW9uID0gbmV3IEN1c3RvbUZvcm1WYWxpZGF0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgcHJpdmF0ZSByb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcikgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5mb3Jnb3RGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBlbWFpbDogWycnLCBWYWxpZGF0b3JzLmNvbXBvc2UoWyBWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLmVtYWlsLCBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5mb3JtVmFsaWRhdGlvbi5yZWd1bGFyRW1haWxWYWxpZGF0aW9uKV0pXVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZXR1cm5VcmwgPSAnLyc7XG4gIH1cblxuICAvLyBDb252ZW5pZW5jZSBnZXR0ZXIgZm9yIGVhc3kgYWNjZXNzIHRvIGZvcm0gZmllbGRzXG4gIGdldCBmKCkgeyByZXR1cm4gdGhpcy5mb3Jnb3RGb3JtLmNvbnRyb2xzOyB9XG5cbiAgb25TdWJtaXQoKSB7XG4gICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICAvLyBodHRwLnBvc3QoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS9yZWNvdmVyeS9mb3Jnb3RgKTtcblxuICAgIC8vIHN0b3AgaGVyZSBpZiBmb3JtIGlzIGludmFsaWRcbiAgICBpZiAodGhpcy5mb3Jnb3RGb3JtLmludmFsaWQpIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBvYmogdG8gaG9sZCBmb3JtZGF0YVxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgLy8gQXBwZW5kIGlucHV0IHRvIGZvcm0gZGF0YVxuICAgIGZvcm1EYXRhLmFwcGVuZCgncGFzc3dvcmQnLCB0aGlzLmZvcmdvdEZvcm0uZ2V0KCdlbWFpbCcpLnZhbHVlKTtcbiAgICBcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG59XG4iXX0=