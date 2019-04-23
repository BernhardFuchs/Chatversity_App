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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvT25ib2FyZGluZy9sb2dpbi9sb2dpbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsNkNBQW1EO0FBQ25ELHdDQUF5RjtBQUN6RiwwQ0FBeUQ7QUFDekQsa0VBQThEO0FBQzlELHNFQUEwRTtBQUUxRSxJQUFNLFdBQVcsR0FBRztJQUNsQixPQUFPLEVBQUUsSUFBSSxrQkFBVyxDQUFDO1FBQ3ZCLGNBQWMsRUFBRyxrQkFBa0I7UUFDbkMsZUFBZSxFQUFFLGVBQWU7S0FDakMsQ0FBQztDQUNILENBQUM7QUFRRjtJQU9FLHdCQUNVLFdBQXdCLEVBQ3hCLE1BQWMsRUFDZCxJQUFpQjtRQUZqQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBYTtRQVIzQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsbUJBQWMsR0FBeUIsSUFBSSxzQ0FBb0IsRUFBRSxDQUFDO1FBTTdELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQUMsQ0FBQztJQUU1QixpQ0FBUSxHQUFSO1FBQ0UsNkNBQTZDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDdEMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFVLENBQUMsT0FBTyxDQUFDO29CQUNoQyxrQkFBVSxDQUFDLFFBQVE7b0JBQ25CLGtCQUFVLENBQUMsS0FBSztvQkFDaEIsa0JBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQztpQkFBQyxDQUNoRSxDQUFDO1lBQ0YsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFVLENBQUMsUUFBUSxDQUFDO1NBQ3RDLENBQUMsQ0FBQztJQUNILENBQUM7SUFHRCxzQkFBSSw2QkFBQztRQURMLG9EQUFvRDthQUNwRCxjQUFVLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUUzQyxFQUFFO0lBQ0YsbUZBQW1GO0lBQ25GLEVBQUU7SUFDQSxpQ0FBUSxHQUFSO1FBQUEsaUJBMEJDO1FBekJDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBRXBCLCtCQUErQjtRQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO1lBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE9BQU87U0FDUjtRQUVELDhCQUE4QjtRQUM5QixJQUFNLFFBQVEsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBRTFDLDRDQUE0QztRQUM1QyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRSxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtZQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBVyxDQUFDLENBQUM7WUFDckUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLEVBQ0QsVUFBQSxLQUFLO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkMsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsS0FBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBekRRLGNBQWM7UUFOMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDckMsQ0FBQzt5Q0FVdUIsbUJBQVc7WUFDaEIsZUFBTTtZQUNSLDBCQUFXO09BVmhCLGNBQWMsQ0E0RDFCO0lBQUQscUJBQUM7Q0FBQSxBQTVERCxJQTREQztBQTVEWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE5nRm9ybSwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7QXV0aFNlcnZpY2V9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBDdXN0b21Gb3JtVmFsaWRhdGlvbiB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy9mb3JtLXZhbGlkYXRpb24nO1xuXG5jb25zdCBodHRwT3B0aW9ucyA9IHtcbiAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAnQ29udGVudC1UeXBlJzogICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnQXV0aG9yaXphdGlvbic6ICdteS1hdXRoLXRva2VuJ1xuICB9KVxufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWxvZ2luJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2xvZ2luLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbG9naW4uY29tcG9uZW50LmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBsb2dpbkZvcm06IEZvcm1Hcm91cDtcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgcmV0dXJuVXJsOiBzdHJpbmc7XG4gIGZvcm1WYWxpZGF0aW9uOiBDdXN0b21Gb3JtVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21Gb3JtVmFsaWRhdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yIChcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgYXV0aDogQXV0aFNlcnZpY2VcbiAgKSB7ICB0aGlzLnJldHVyblVybCA9ICcvJzsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFRPRE86IENoZWNrIGlmIGFscmVhZHkgbG9nZ2VkIGluLCByZWRpcmVjdFxuICAgIHRoaXMubG9naW5Gb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICB1c2VybmFtZTogWycnLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICBWYWxpZGF0b3JzLmVtYWlsLFxuICAgICAgICBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5mb3JtVmFsaWRhdGlvbi5yZWd1bGFyRW1haWxWYWxpZGF0aW9uKV1cbiAgICAgICldLFxuICAgICAgcGFzc3dvcmQ6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgfSk7XG4gIH1cblxuICAvLyBjb252ZW5pZW5jZSBnZXR0ZXIgZm9yIGVhc3kgYWNjZXNzIHRvIGZvcm0gZmllbGRzXG4gIGdldCBmKCkgeyByZXR1cm4gdGhpcy5sb2dpbkZvcm0uY29udHJvbHM7IH1cblxuICAvL1xuICAvLyDilIDilIDilIAgSEFORExFIExPR0lOIEZPUk0g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gICAgb25TdWJtaXQoKSB7XG4gICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBTdG9wIGhlcmUgaWYgZm9ybSBpcyBpbnZhbGlkXG4gICAgICBpZiAodGhpcy5sb2dpbkZvcm0uaW52YWxpZCkge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDcmVhdGUgb2JqIHRvIGhvbGQgZm9ybWRhdGFcbiAgICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICAvLyBBcHBlbmQgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIHRvIGZvcm0gZGF0YVxuICAgICAgZm9ybURhdGEuYXBwZW5kKCd1c2VybmFtZScsIHRoaXMubG9naW5Gb3JtLmdldCgndXNlcm5hbWUnKS52YWx1ZSk7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ3Bhc3N3b3JkJywgdGhpcy5sb2dpbkZvcm0uZ2V0KCdwYXNzd29yZCcpLnZhbHVlKTtcblxuICAgICAgdGhpcy5hdXRoLmxvZ2luKHRoaXMuZi51c2VybmFtZS52YWx1ZSwgdGhpcy5mLnBhc3N3b3JkLnZhbHVlKS50aGVuKHVzZXIgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgTG9nZ2VkIGluIGFzICR7dXNlci5fZW1iZWRkZWQudXNlci5wcm9maWxlLmZpcnN0TmFtZX1gKTtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucmV0dXJuVXJsXSk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnTE9HSU4gRVJST1I6JywgZXJyb3IpO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5mLnVzZXJuYW1lLnNldEVycm9ycyh7aW52YWxpZDogdHJ1ZX0pO1xuICAgICAgfSk7XG4gICAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxufVxuIl19