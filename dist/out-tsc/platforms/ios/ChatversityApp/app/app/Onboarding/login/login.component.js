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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL09uYm9hcmRpbmcvbG9naW4vbG9naW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELDZDQUFtRDtBQUNuRCx3Q0FBeUY7QUFDekYsMENBQXlEO0FBQ3pELGtFQUE4RDtBQUM5RCxzRUFBMEU7QUFFMUUsSUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFLElBQUksa0JBQVcsQ0FBQztRQUN2QixjQUFjLEVBQUcsa0JBQWtCO1FBQ25DLGVBQWUsRUFBRSxlQUFlO0tBQ2pDLENBQUM7Q0FDSCxDQUFDO0FBUUY7SUFPRSx3QkFDVSxXQUF3QixFQUN4QixNQUFjLEVBQ2QsSUFBaUI7UUFGakIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQWE7UUFSM0IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLG1CQUFjLEdBQXlCLElBQUksc0NBQW9CLEVBQUUsQ0FBQztRQU03RCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUFDLENBQUM7SUFFNUIsaUNBQVEsR0FBUjtRQUNFLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3RDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsa0JBQVUsQ0FBQyxRQUFRO29CQUNuQixrQkFBVSxDQUFDLEtBQUs7b0JBQ2hCLGtCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUM7aUJBQUMsQ0FDaEUsQ0FBQztZQUNGLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztTQUN0QyxDQUFDLENBQUM7SUFDSCxDQUFDO0lBR0Qsc0JBQUksNkJBQUM7UUFETCxvREFBb0Q7YUFDcEQsY0FBVSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFM0MsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBQ0EsaUNBQVEsR0FBUjtRQUFBLGlCQTBCQztRQXpCQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVwQiwrQkFBK0I7UUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixPQUFPO1NBQ1I7UUFFRCw4QkFBOEI7UUFDOUIsSUFBTSxRQUFRLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUUxQyw0Q0FBNEM7UUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7WUFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVcsQ0FBQyxDQUFDO1lBQ3JFLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxFQUNELFVBQUEsS0FBSztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25DLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLEtBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXpEUSxjQUFjO1FBTjFCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO1NBQ3JDLENBQUM7eUNBVXVCLG1CQUFXO1lBQ2hCLGVBQU07WUFDUiwwQkFBVztPQVZoQixjQUFjLENBNEQxQjtJQUFELHFCQUFDO0NBQUEsQUE1REQsSUE0REM7QUE1RFksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge0F1dGhTZXJ2aWNlfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3VzdG9tRm9ybVZhbGlkYXRpb24gfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvZm9ybS12YWxpZGF0aW9uJztcblxuY29uc3QgaHR0cE9wdGlvbnMgPSB7XG4gIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0F1dGhvcml6YXRpb24nOiAnbXktYXV0aC10b2tlbidcbiAgfSlcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1sb2dpbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9sb2dpbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2xvZ2luLmNvbXBvbmVudC5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIExvZ2luQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgbG9naW5Gb3JtOiBGb3JtR3JvdXA7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgc3VibWl0dGVkID0gZmFsc2U7XG4gIHJldHVyblVybDogc3RyaW5nO1xuICBmb3JtVmFsaWRhdGlvbjogQ3VzdG9tRm9ybVZhbGlkYXRpb24gPSBuZXcgQ3VzdG9tRm9ybVZhbGlkYXRpb24oKTtcblxuICBjb25zdHJ1Y3RvciAoXG4gICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGF1dGg6IEF1dGhTZXJ2aWNlXG4gICkgeyAgdGhpcy5yZXR1cm5VcmwgPSAnLyc7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBUT0RPOiBDaGVjayBpZiBhbHJlYWR5IGxvZ2dlZCBpbiwgcmVkaXJlY3RcbiAgICB0aGlzLmxvZ2luRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgdXNlcm5hbWU6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgICAgVmFsaWRhdG9ycy5lbWFpbCxcbiAgICAgICAgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuZm9ybVZhbGlkYXRpb24ucmVndWxhckVtYWlsVmFsaWRhdGlvbildXG4gICAgICApXSxcbiAgICAgIHBhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXG4gIH0pO1xuICB9XG5cbiAgLy8gY29udmVuaWVuY2UgZ2V0dGVyIGZvciBlYXN5IGFjY2VzcyB0byBmb3JtIGZpZWxkc1xuICBnZXQgZigpIHsgcmV0dXJuIHRoaXMubG9naW5Gb3JtLmNvbnRyb2xzOyB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBMT0dJTiBGT1JNIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICAgIG9uU3VibWl0KCkge1xuICAgICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgLy8gU3RvcCBoZXJlIGlmIGZvcm0gaXMgaW52YWxpZFxuICAgICAgaWYgKHRoaXMubG9naW5Gb3JtLmludmFsaWQpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIG9iaiB0byBob2xkIGZvcm1kYXRhXG4gICAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgLy8gQXBwZW5kIHVzZXJuYW1lIGFuZCBwYXNzd29yZCB0byBmb3JtIGRhdGFcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgndXNlcm5hbWUnLCB0aGlzLmxvZ2luRm9ybS5nZXQoJ3VzZXJuYW1lJykudmFsdWUpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKCdwYXNzd29yZCcsIHRoaXMubG9naW5Gb3JtLmdldCgncGFzc3dvcmQnKS52YWx1ZSk7XG5cbiAgICAgIHRoaXMuYXV0aC5sb2dpbih0aGlzLmYudXNlcm5hbWUudmFsdWUsIHRoaXMuZi5wYXNzd29yZC52YWx1ZSkudGhlbih1c2VyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYExvZ2dlZCBpbiBhcyAke3VzZXIuX2VtYmVkZGVkLnVzZXIucHJvZmlsZS5maXJzdE5hbWV9YCk7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJldHVyblVybF0pO1xuICAgICAgfSxcbiAgICAgIGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xPR0lOIEVSUk9SOicsIGVycm9yKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZi51c2VybmFtZS5zZXRFcnJvcnMoe2ludmFsaWQ6IHRydWV9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbn1cbiJdfQ==