"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var auth_service_1 = require("../../Core/_services/auth.service");
var form_validation_1 = require("../../Core/_models/form-validation");
var httpOptions = {
    headers: new http_1.HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, router, auth) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.auth = auth;
        this.loading = false;
        this.submitted = false;
        this.formValidation = new form_validation_1.CustomFormValidation();
        this.returnUrl = '/';
    }
    LoginComponent.prototype.ngOnInit = function () {
        // TODO: Check if already logged in, redirect
        this.loginForm = this.formBuilder.group({
            username: ['', forms_1.Validators.compose([
                    forms_1.Validators.required,
                    forms_1.Validators.email,
                    forms_1.Validators.pattern(this.formValidation.regularEmailValidation)
                ])],
            password: ['', forms_1.Validators.required]
        });
    };
    Object.defineProperty(LoginComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.loginForm.controls; },
        enumerable: true,
        configurable: true
    });
    //
    // ─── HANDLE LOGIN FORM ──────────────────────────────────────────────────────────
    //
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.loading = true;
        // Stop here if form is invalid
        if (this.loginForm.invalid) {
            this.loading = false;
            return;
        }
        // Create obj to hold formdata
        var formData = new FormData();
        // Append username and password to form data
        formData.append('username', this.loginForm.get('username').value);
        formData.append('password', this.loginForm.get('password').value);
        this.auth.login(this.f.username.value, this.f.password.value).then(function (user) {
            console.log("Logged in as " + user._embedded.user.profile.firstName);
            _this.router.navigate([_this.returnUrl]);
        }, function (error) {
            console.log('LOGIN ERROR:', error);
            _this.loading = false;
            _this.f.username.setErrors({ invalid: true });
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            router_1.Router,
            auth_service_1.AuthService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9PbmJvYXJkaW5nL2xvZ2luL2xvZ2luLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCw2Q0FBbUQ7QUFDbkQsd0NBQXlGO0FBQ3pGLDBDQUF5RDtBQUN6RCxrRUFBOEQ7QUFDOUQsc0VBQTBFO0FBRTFFLElBQU0sV0FBVyxHQUFHO0lBQ2xCLE9BQU8sRUFBRSxJQUFJLGtCQUFXLENBQUM7UUFDdkIsY0FBYyxFQUFHLGtCQUFrQjtRQUNuQyxlQUFlLEVBQUUsZUFBZTtLQUNqQyxDQUFDO0NBQ0gsQ0FBQztBQVFGO0lBT0Usd0JBQ1UsV0FBd0IsRUFDeEIsTUFBYyxFQUNkLElBQWlCO1FBRmpCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFhO1FBUjNCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixtQkFBYyxHQUF5QixJQUFJLHNDQUFvQixFQUFFLENBQUM7UUFNN0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFBQyxDQUFDO0lBRTVCLGlDQUFRLEdBQVI7UUFDRSw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUN0QyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxPQUFPLENBQUM7b0JBQ2hDLGtCQUFVLENBQUMsUUFBUTtvQkFDbkIsa0JBQVUsQ0FBQyxLQUFLO29CQUNoQixrQkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDO2lCQUFDLENBQ2hFLENBQUM7WUFDRixRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7U0FDdEMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztJQUdELHNCQUFJLDZCQUFDO1FBREwsb0RBQW9EO2FBQ3BELGNBQVUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTNDLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUNBLGlDQUFRLEdBQVI7UUFBQSxpQkEwQkM7UUF6QkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFcEIsK0JBQStCO1FBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsT0FBTztTQUNSO1FBRUQsOEJBQThCO1FBQzlCLElBQU0sUUFBUSxHQUFhLElBQUksUUFBUSxFQUFFLENBQUM7UUFFMUMsNENBQTRDO1FBQzVDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFXLENBQUMsQ0FBQztZQUNyRSxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsRUFDRCxVQUFBLEtBQUs7WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxLQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixLQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUF6RFEsY0FBYztRQU4xQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztTQUNyQyxDQUFDO3lDQVV1QixtQkFBVztZQUNoQixlQUFNO1lBQ1IsMEJBQVc7T0FWaEIsY0FBYyxDQTREMUI7SUFBRCxxQkFBQztDQUFBLEFBNURELElBNERDO0FBNURZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IEN1c3RvbUZvcm1WYWxpZGF0aW9uIH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL2Zvcm0tdmFsaWRhdGlvbic7XG5cbmNvbnN0IGh0dHBPcHRpb25zID0ge1xuICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICdDb250ZW50LVR5cGUnOiAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdBdXRob3JpemF0aW9uJzogJ215LWF1dGgtdG9rZW4nXG4gIH0pXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbG9naW4nLFxuICB0ZW1wbGF0ZVVybDogJy4vbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9sb2dpbi5jb21wb25lbnQuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGxvZ2luRm9ybTogRm9ybUdyb3VwO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIHN1Ym1pdHRlZCA9IGZhbHNlO1xuICByZXR1cm5Vcmw6IHN0cmluZztcbiAgZm9ybVZhbGlkYXRpb246IEN1c3RvbUZvcm1WYWxpZGF0aW9uID0gbmV3IEN1c3RvbUZvcm1WYWxpZGF0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IgKFxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBhdXRoOiBBdXRoU2VydmljZVxuICApIHsgIHRoaXMucmV0dXJuVXJsID0gJy8nOyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gVE9ETzogQ2hlY2sgaWYgYWxyZWFkeSBsb2dnZWQgaW4sIHJlZGlyZWN0XG4gICAgdGhpcy5sb2dpbkZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHVzZXJuYW1lOiBbJycsIFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgIFZhbGlkYXRvcnMuZW1haWwsXG4gICAgICAgIFZhbGlkYXRvcnMucGF0dGVybih0aGlzLmZvcm1WYWxpZGF0aW9uLnJlZ3VsYXJFbWFpbFZhbGlkYXRpb24pXVxuICAgICAgKV0sXG4gICAgICBwYXNzd29yZDogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICB9KTtcbiAgfVxuXG4gIC8vIGNvbnZlbmllbmNlIGdldHRlciBmb3IgZWFzeSBhY2Nlc3MgdG8gZm9ybSBmaWVsZHNcbiAgZ2V0IGYoKSB7IHJldHVybiB0aGlzLmxvZ2luRm9ybS5jb250cm9sczsgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBIQU5ETEUgTE9HSU4gRk9STSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgICBvblN1Ym1pdCgpIHtcbiAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIC8vIFN0b3AgaGVyZSBpZiBmb3JtIGlzIGludmFsaWRcbiAgICAgIGlmICh0aGlzLmxvZ2luRm9ybS5pbnZhbGlkKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBvYmogdG8gaG9sZCBmb3JtZGF0YVxuICAgICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAgIC8vIEFwcGVuZCB1c2VybmFtZSBhbmQgcGFzc3dvcmQgdG8gZm9ybSBkYXRhXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJuYW1lJywgdGhpcy5sb2dpbkZvcm0uZ2V0KCd1c2VybmFtZScpLnZhbHVlKTtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgncGFzc3dvcmQnLCB0aGlzLmxvZ2luRm9ybS5nZXQoJ3Bhc3N3b3JkJykudmFsdWUpO1xuXG4gICAgICB0aGlzLmF1dGgubG9naW4odGhpcy5mLnVzZXJuYW1lLnZhbHVlLCB0aGlzLmYucGFzc3dvcmQudmFsdWUpLnRoZW4odXNlciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBMb2dnZWQgaW4gYXMgJHt1c2VyLl9lbWJlZGRlZC51c2VyLnByb2ZpbGUuZmlyc3ROYW1lfWApO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5yZXR1cm5VcmxdKTtcbiAgICAgIH0sXG4gICAgICBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMT0dJTiBFUlJPUjonLCBlcnJvcik7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmYudXNlcm5hbWUuc2V0RXJyb3JzKHtpbnZhbGlkOiB0cnVlfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG59XG4iXX0=