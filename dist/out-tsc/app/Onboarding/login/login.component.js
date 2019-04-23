"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var auth_service_1 = require("../../Core/_services/auth.service");
var form_validation_1 = require("../../Core/_models/form-validation");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var httpOptions = {
    headers: new http_1.HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, router, authService, messageService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.authService = authService;
        this.messageService = messageService;
        this.loading = false;
        this.submitted = false;
        this.returnUrl = 'home';
        this.formValidation = new form_validation_1.CustomFormValidation();
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
        this.authService.login(this.f.username.value, this.f.password.value).then(function (oktaUser) {
            // console.log(`Logged in as ${oktaUser._embedded.user.profile.firstName}`)
            /*******************/
            /* Begin App setup */
            /*******************/
            // Initialize Chatkit
            // this.messageService.initChatkit(oktaUser._embedded.user.id)
            //   .then(chatkitUser => {
            //     this.authService.currentUser = chatkitUser;
            //     console.log(this.authService.currentUser);
            _this.router.navigate([_this.returnUrl]);
            // });
        }, function (error) {
            console.log('LOGIN ERROR:', error);
            _this.loading = false;
            _this.loginForm.setErrors({ 'invalid': true });
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
            auth_service_1.AuthService,
            messaging_service_1.MessagingService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9PbmJvYXJkaW5nL2xvZ2luL2xvZ2luLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUNqRCw2Q0FBa0Q7QUFDbEQsd0NBQXdGO0FBQ3hGLDBDQUF3RDtBQUN4RCxrRUFBNkQ7QUFDN0Qsc0VBQXlFO0FBQ3pFLDRFQUF5RTtBQUV6RSxJQUFNLFdBQVcsR0FBRztJQUNsQixPQUFPLEVBQUUsSUFBSSxrQkFBVyxDQUFDO1FBQ3ZCLGNBQWMsRUFBRyxrQkFBa0I7UUFDbkMsZUFBZSxFQUFFLGVBQWU7S0FDakMsQ0FBQztDQUNILENBQUE7QUFRRDtJQU9FLHdCQUNVLFdBQXdCLEVBQ3hCLE1BQWMsRUFDZCxXQUF3QixFQUN4QixjQUFnQztRQUhoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsbUJBQWMsR0FBZCxjQUFjLENBQWtCO1FBVDFDLFlBQU8sR0FBRyxLQUFLLENBQUE7UUFDZixjQUFTLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLGNBQVMsR0FBRyxNQUFNLENBQUE7UUFDbEIsbUJBQWMsR0FBeUIsSUFBSSxzQ0FBb0IsRUFBRSxDQUFBO0lBTXBCLENBQUM7SUFFOUMsaUNBQVEsR0FBUjtRQUNFLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3RDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLE9BQU8sQ0FBQztvQkFDaEMsa0JBQVUsQ0FBQyxRQUFRO29CQUNuQixrQkFBVSxDQUFDLEtBQUs7b0JBQ2hCLGtCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUM7aUJBQUMsQ0FDaEUsQ0FBQztZQUNGLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztTQUN0QyxDQUFDLENBQUE7SUFDRixDQUFDO0lBR0Qsc0JBQUksNkJBQUM7UUFETCxvREFBb0Q7YUFDcEQsY0FBVSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQzs7O09BQUE7SUFFMUMsRUFBRTtJQUNGLG1GQUFtRjtJQUNuRixFQUFFO0lBQ0EsaUNBQVEsR0FBUjtRQUFBLGlCQTJDQztRQXpDQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUVuQiwrQkFBK0I7UUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtZQUNwQixPQUFNO1NBQ1A7UUFFRCw4QkFBOEI7UUFDOUIsSUFBTSxRQUFRLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQTtRQUV6Qyw0Q0FBNEM7UUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDakUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFakUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7WUFFaEYsMkVBQTJFO1lBRTNFLHFCQUFxQjtZQUNyQixxQkFBcUI7WUFDckIscUJBQXFCO1lBRXJCLHFCQUFxQjtZQUNyQiw4REFBOEQ7WUFDOUQsMkJBQTJCO1lBRTNCLGtEQUFrRDtZQUNsRCxpREFBaUQ7WUFFN0MsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtZQUUxQyxNQUFNO1FBRVIsQ0FBQyxFQUNELFVBQUEsS0FBSztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ2xDLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1lBQ3BCLEtBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFFLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFFLENBQUE7UUFDL0MsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBMUVRLGNBQWM7UUFOMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDckMsQ0FBQzt5Q0FVdUIsbUJBQVc7WUFDaEIsZUFBTTtZQUNELDBCQUFXO1lBQ1Isb0NBQWdCO09BWC9CLGNBQWMsQ0E2RTFCO0lBQUQscUJBQUM7Q0FBQSxBQTdFRCxJQTZFQztBQTdFWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnXG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuaW1wb3J0IHtBdXRoU2VydmljZX0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgQ3VzdG9tRm9ybVZhbGlkYXRpb24gfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvZm9ybS12YWxpZGF0aW9uJ1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJ1xuXG5jb25zdCBodHRwT3B0aW9ucyA9IHtcbiAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAnQ29udGVudC1UeXBlJzogICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnQXV0aG9yaXphdGlvbic6ICdteS1hdXRoLXRva2VuJ1xuICB9KVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbG9naW4nLFxuICB0ZW1wbGF0ZVVybDogJy4vbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9sb2dpbi5jb21wb25lbnQuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBMb2dpbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGxvZ2luRm9ybTogRm9ybUdyb3VwXG4gIGxvYWRpbmcgPSBmYWxzZVxuICBzdWJtaXR0ZWQgPSBmYWxzZVxuICByZXR1cm5VcmwgPSAnaG9tZSdcbiAgZm9ybVZhbGlkYXRpb246IEN1c3RvbUZvcm1WYWxpZGF0aW9uID0gbmV3IEN1c3RvbUZvcm1WYWxpZGF0aW9uKClcblxuICBjb25zdHJ1Y3RvciAoXG4gICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdpbmdTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFRPRE86IENoZWNrIGlmIGFscmVhZHkgbG9nZ2VkIGluLCByZWRpcmVjdFxuICAgIHRoaXMubG9naW5Gb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICB1c2VybmFtZTogWycnLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgICBWYWxpZGF0b3JzLmVtYWlsLFxuICAgICAgICBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5mb3JtVmFsaWRhdGlvbi5yZWd1bGFyRW1haWxWYWxpZGF0aW9uKV1cbiAgICAgICldLFxuICAgICAgcGFzc3dvcmQ6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF1cbiAgfSlcbiAgfVxuXG4gIC8vIGNvbnZlbmllbmNlIGdldHRlciBmb3IgZWFzeSBhY2Nlc3MgdG8gZm9ybSBmaWVsZHNcbiAgZ2V0IGYoKSB7IHJldHVybiB0aGlzLmxvZ2luRm9ybS5jb250cm9scyB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBMT0dJTiBGT1JNIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICAgIG9uU3VibWl0KCkge1xuXG4gICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWVcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcblxuICAgICAgLy8gU3RvcCBoZXJlIGlmIGZvcm0gaXMgaW52YWxpZFxuICAgICAgaWYgKHRoaXMubG9naW5Gb3JtLmludmFsaWQpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBvYmogdG8gaG9sZCBmb3JtZGF0YVxuICAgICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcblxuICAgICAgLy8gQXBwZW5kIHVzZXJuYW1lIGFuZCBwYXNzd29yZCB0byBmb3JtIGRhdGFcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgndXNlcm5hbWUnLCB0aGlzLmxvZ2luRm9ybS5nZXQoJ3VzZXJuYW1lJykudmFsdWUpXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ3Bhc3N3b3JkJywgdGhpcy5sb2dpbkZvcm0uZ2V0KCdwYXNzd29yZCcpLnZhbHVlKVxuXG4gICAgICB0aGlzLmF1dGhTZXJ2aWNlLmxvZ2luKHRoaXMuZi51c2VybmFtZS52YWx1ZSwgdGhpcy5mLnBhc3N3b3JkLnZhbHVlKS50aGVuKG9rdGFVc2VyID0+IHtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgTG9nZ2VkIGluIGFzICR7b2t0YVVzZXIuX2VtYmVkZGVkLnVzZXIucHJvZmlsZS5maXJzdE5hbWV9YClcblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKi9cbiAgICAgICAgLyogQmVnaW4gQXBwIHNldHVwICovXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8vIEluaXRpYWxpemUgQ2hhdGtpdFxuICAgICAgICAvLyB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmluaXRDaGF0a2l0KG9rdGFVc2VyLl9lbWJlZGRlZC51c2VyLmlkKVxuICAgICAgICAvLyAgIC50aGVuKGNoYXRraXRVc2VyID0+IHtcblxuICAgICAgICAvLyAgICAgdGhpcy5hdXRoU2VydmljZS5jdXJyZW50VXNlciA9IGNoYXRraXRVc2VyO1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGhpcy5hdXRoU2VydmljZS5jdXJyZW50VXNlcik7XG5cbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJldHVyblVybF0pXG5cbiAgICAgICAgLy8gfSk7XG5cbiAgICAgIH0sXG4gICAgICBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMT0dJTiBFUlJPUjonLCBlcnJvcilcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5sb2dpbkZvcm0uc2V0RXJyb3JzKCB7J2ludmFsaWQnOiB0cnVlfSApXG4gICAgICB9KVxuICAgIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbn1cbiJdfQ==