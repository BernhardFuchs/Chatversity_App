"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var http_2 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var auth_service_1 = require("../../Core/_services/auth.service");
var form_validation_1 = require("../../Core/_models/form-validation");
var environment_1 = require("../../../environments/environment");
// NativeScript Imports
var application = require("tns-core-modules/application");
var frame_1 = require("tns-core-modules/ui/frame");
var frame = frame_1.getFrameById("signupFrame");
// Navigate from Signup component to Login component
frame.navigate("login");
var httpOptions = {
    headers: new http_2.HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
var SignupComponent = /** @class */ (function () {
    function SignupComponent(formBuilder, router, auth, http) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.auth = auth;
        this.http = http;
        this.loading = false;
        this.submitted = false;
        this.searchingForSchool = false;
        this.wrongUniversity = false;
        this.formValidation = new form_validation_1.CustomFormValidation();
    }
    SignupComponent.prototype.ngOnInit = function () {
        this.signupForm = this.formBuilder.group({
            firstname: ['', forms_1.Validators.required],
            lastname: ['', forms_1.Validators.required],
            university: [this.guessUniversity, forms_1.Validators.required],
            username: ['', forms_1.Validators.compose([
                    forms_1.Validators.required, forms_1.Validators.email, forms_1.Validators.pattern(this.formValidation.eduEmailValidation)
                ])],
            password: ['', forms_1.Validators.compose([
                    forms_1.Validators.required, forms_1.Validators.minLength(8), forms_1.Validators.pattern(this.formValidation.passwordValidation)
                ])]
        });
        this.returnUrl = '/new-user';
    };
    //
    // ─── CHECK FOR USERNAME OR PASSWORD ERRORS ──────────────────────────────────────
    //
    SignupComponent.prototype.checkForFormErrors = function () {
        if (this.f.username.errors || this.f.password.errors) {
            return true;
        }
        return false;
    };
    Object.defineProperty(SignupComponent.prototype, "f", {
        //
        // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
        //
        get: function () { return this.signupForm.controls; },
        enumerable: true,
        configurable: true
    });
    //
    // ─── VALIDATE UNIVERSITY WITH JSON STORE ──────────────────────────────────────
    //
    SignupComponent.prototype.validateUniversity = function (query) {
        var _this = this;
        this.searchingForSchool = true;
        return this.http.get(environment_1.environment.apiUrl + "/university/name/" + query)
            .toPromise()
            .then(function (university) {
            return university;
        })
            .catch(function (error) {
            _this.searchingForSchool = false;
            return null;
        });
    };
    //
    // ─── SEARCH FOR UNIVERSITY FROM JSON STORE ──────────────────────────────────────
    //
    SignupComponent.prototype.findUniversity = function (query) {
        var _this = this;
        this.searchingForSchool = true;
        return this.http.get(environment_1.environment.apiUrl + "/university/" + query)
            .toPromise()
            .then(function (university) {
            return university;
        })
            .catch(function (error) {
            _this.searchingForSchool = false;
            return null;
        });
    };
    //
    // ─── GET UNIVERSITY BY DOMAIN ──────────────────────────────────────
    //
    SignupComponent.prototype.getUniversity = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = new Object();
                        return [4 /*yield*/, this.findUniversity(query)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.guessUniversity = data['name'];
                            this.signupForm.get('university').setValue(this.guessUniversity);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //
    // ─── UPDATE UNIVERSITY IF USER CHANGES INPUT ──────────────────────────────────────
    //
    SignupComponent.prototype.userUpdateUniversity = function (newUniversity) {
        var _this = this;
        this.guessUniversity = newUniversity;
        this.validateUniversity(this.guessUniversity)
            .then(function (result) {
            if (!result) {
                _this.f.university.setErrors({ 'invalid': true });
            }
        });
    };
    //
    // ─── HANDLE SIGN UP ─────────────────────────────────────────────────────────────
    //
    SignupComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.loading = true;
        // stop here if form is invalid
        if (this.signupForm.invalid) {
            this.loading = false;
            return;
        }
        // Create obj to hold formdata
        var formData = new FormData();
        // Append input to form data
        formData.append('firstname', this.signupForm.get('firstname').value);
        formData.append('lastname', this.signupForm.get('lastname').value);
        formData.append('university', this.guessUniversity);
        formData.append('username', this.signupForm.get('username').value);
        formData.append('password', this.signupForm.get('password').value);
        this.auth.signup(this.f.firstname.value, this.f.lastname.value, this.guessUniversity, this.f.username.value, this.f.password.value)
            .then(function (data) {
            _this.router.navigate([_this.returnUrl]);
        }, function (error) {
            console.log('SIGN UP ERROR:', error);
            _this.loading = false;
        });
    };
    SignupComponent = __decorate([
        core_1.Component({
            selector: 'app-signup',
            moduleId: module.id,
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            router_1.Router,
            auth_service_1.AuthService,
            http_1.HttpClient])
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
// Dont place any code below this final line as it will not execute when running the NativeScript app
// This is the inital starting point of the app!  Dont change unless we do a team discussin and design changes
// ~ Noah
application.run({ moduleName: "signup" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvT25ib2FyZGluZy9zaWdudXAvc2lnbnVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUVsRCw2Q0FBa0Q7QUFDbEQsNkNBQW1EO0FBRW5ELHdDQUF5RjtBQUN6RiwwQ0FBeUQ7QUFFekQsa0VBQWdFO0FBR2hFLHNFQUEwRTtBQUMxRSxpRUFBZ0U7QUFFaEUsdUJBQXVCO0FBQ3ZCLDBEQUE2RDtBQUM3RCxtREFBeUQ7QUFHekQsSUFBTSxLQUFLLEdBQUcsb0JBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxvREFBb0Q7QUFDcEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUd4QixJQUFNLFdBQVcsR0FBRztJQUNsQixPQUFPLEVBQUUsSUFBSSxrQkFBVyxDQUFDO1FBQ3ZCLGNBQWMsRUFBRyxrQkFBa0I7UUFDbkMsZUFBZSxFQUFFLGVBQWU7S0FDakMsQ0FBQztDQUNILENBQUM7QUFTRjtJQVdFLHlCQUNVLFdBQXdCLEVBQ3hCLE1BQWMsRUFDZCxJQUFpQixFQUNqQixJQUFnQjtRQUhoQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUNqQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBYjFCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUdsQix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDM0Isb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsbUJBQWMsR0FBeUIsSUFBSSxzQ0FBb0IsRUFBRSxDQUFDO0lBT3BDLENBQUM7SUFFL0Isa0NBQVEsR0FBUjtRQUVFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxL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LE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsU0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDdEMsQ0FBQzt5Q0FjdUIsbUJBQVc7WUFDaEIsZUFBTTtZQUNSLDBCQUFXO1lBQ1gsaUJBQVU7T0FmZixlQUFlLENBNEkzQjtJQUFELHNCQUFDO0NBQUEsQUE1SUQsSUE0SUM7QUE1SVksMENBQWU7QUErSTVCLHFHQUFxRztBQUNyRyw4R0FBOEc7QUFDOUcsU0FBUztBQUVULFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPa3RhQXV0aFNlcnZpY2UgfSBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBVbml2ZXJzaXR5IH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL3VuaXZlcnNpdHknO1xuaW1wb3J0IHsgQ3VzdG9tRm9ybVZhbGlkYXRpb24gfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvZm9ybS12YWxpZGF0aW9uJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcblxuLy8gTmF0aXZlU2NyaXB0IEltcG9ydHNcbmltcG9ydCBhcHBsaWNhdGlvbiA9IHJlcXVpcmUoXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCIpO1xuaW1wb3J0IHsgZ2V0RnJhbWVCeUlkIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy91aS9mcmFtZSc7XG5cblxuY29uc3QgZnJhbWUgPSBnZXRGcmFtZUJ5SWQoXCJzaWdudXBGcmFtZVwiKTtcbi8vIE5hdmlnYXRlIGZyb20gU2lnbnVwIGNvbXBvbmVudCB0byBMb2dpbiBjb21wb25lbnRcbmZyYW1lLm5hdmlnYXRlKFwibG9naW5cIik7XG5cblxuY29uc3QgaHR0cE9wdGlvbnMgPSB7XG4gIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0F1dGhvcml6YXRpb24nOiAnbXktYXV0aC10b2tlbidcbiAgfSlcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zaWdudXAnLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICB0ZW1wbGF0ZVVybDogJy4vc2lnbnVwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2lnbnVwLmNvbXBvbmVudC5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIFNpZ251cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHNpZ251cEZvcm06IEZvcm1Hcm91cDtcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgcmV0dXJuVXJsOiBzdHJpbmc7XG4gIHVuaXZlcnNpdGllczogVW5pdmVyc2l0eVtdO1xuICBzZWFyY2hpbmdGb3JTY2hvb2wgPSBmYWxzZTtcbiAgd3JvbmdVbml2ZXJzaXR5ID0gZmFsc2U7XG4gIGZvcm1WYWxpZGF0aW9uOiBDdXN0b21Gb3JtVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21Gb3JtVmFsaWRhdGlvbigpO1xuICBndWVzc1VuaXZlcnNpdHk6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgYXV0aDogQXV0aFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIHRoaXMuc2lnbnVwRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgZmlyc3RuYW1lOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgbGFzdG5hbWU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICB1bml2ZXJzaXR5OiBbdGhpcy5ndWVzc1VuaXZlcnNpdHksIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgdXNlcm5hbWU6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5lbWFpbCwgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuZm9ybVZhbGlkYXRpb24uZWR1RW1haWxWYWxpZGF0aW9uKVxuICAgICAgXSldLFxuICAgICAgcGFzc3dvcmQ6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5taW5MZW5ndGgoOCksIFZhbGlkYXRvcnMucGF0dGVybih0aGlzLmZvcm1WYWxpZGF0aW9uLnBhc3N3b3JkVmFsaWRhdGlvbilcbiAgICAgIF0pXVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZXR1cm5VcmwgPSAnL25ldy11c2VyJztcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDSEVDSyBGT1IgVVNFUk5BTUUgT1IgUEFTU1dPUkQgRVJST1JTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBjaGVja0ZvckZvcm1FcnJvcnMoKSB7XG4gICAgaWYgKHRoaXMuZi51c2VybmFtZS5lcnJvcnMgfHwgdGhpcy5mLnBhc3N3b3JkLmVycm9ycykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDT05WRU5JRU5DRSBHRVRURVIgRk9SIEVBU1kgQUNDRVNTIFRPIEZPUk0gRklFTERTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBnZXQgZigpIHsgcmV0dXJuIHRoaXMuc2lnbnVwRm9ybS5jb250cm9sczsgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBWQUxJREFURSBVTklWRVJTSVRZIFdJVEggSlNPTiBTVE9SRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgdmFsaWRhdGVVbml2ZXJzaXR5KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlYXJjaGluZ0ZvclNjaG9vbCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91bml2ZXJzaXR5L25hbWUvJHtxdWVyeX1gKVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKHVuaXZlcnNpdHkgPT4ge1xuICAgICAgcmV0dXJuIHVuaXZlcnNpdHk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgdGhpcy5zZWFyY2hpbmdGb3JTY2hvb2wgPSBmYWxzZTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFNFQVJDSCBGT1IgVU5JVkVSU0lUWSBGUk9NIEpTT04gU1RPUkUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIGZpbmRVbml2ZXJzaXR5KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlYXJjaGluZ0ZvclNjaG9vbCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91bml2ZXJzaXR5LyR7cXVlcnl9YClcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbih1bml2ZXJzaXR5ID0+IHtcbiAgICAgIHJldHVybiB1bml2ZXJzaXR5O1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoaW5nRm9yU2Nob29sID0gZmFsc2U7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBHRVQgVU5JVkVSU0lUWSBCWSBET01BSU4g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIGFzeW5jIGdldFVuaXZlcnNpdHkocXVlcnk6IHN0cmluZykge1xuICAgIGxldCBkYXRhID0gbmV3IE9iamVjdCgpO1xuICAgIGRhdGEgPSBhd2FpdCB0aGlzLmZpbmRVbml2ZXJzaXR5KHF1ZXJ5KTtcblxuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmd1ZXNzVW5pdmVyc2l0eSA9IGRhdGFbJ25hbWUnXTtcbiAgICAgIHRoaXMuc2lnbnVwRm9ybS5nZXQoJ3VuaXZlcnNpdHknKS5zZXRWYWx1ZSh0aGlzLmd1ZXNzVW5pdmVyc2l0eSk7XG4gICAgfVxuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFVQREFURSBVTklWRVJTSVRZIElGIFVTRVIgQ0hBTkdFUyBJTlBVVCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgdXNlclVwZGF0ZVVuaXZlcnNpdHkobmV3VW5pdmVyc2l0eTogc3RyaW5nKSB7XG4gICAgdGhpcy5ndWVzc1VuaXZlcnNpdHkgPSBuZXdVbml2ZXJzaXR5O1xuXG4gICAgdGhpcy52YWxpZGF0ZVVuaXZlcnNpdHkodGhpcy5ndWVzc1VuaXZlcnNpdHkpXG4gICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHRoaXMuZi51bml2ZXJzaXR5LnNldEVycm9ycyh7J2ludmFsaWQnOiB0cnVlfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgSEFORExFIFNJR04gVVAg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIG9uU3VibWl0KCkge1xuICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgLy8gc3RvcCBoZXJlIGlmIGZvcm0gaXMgaW52YWxpZFxuICAgIGlmICh0aGlzLnNpZ251cEZvcm0uaW52YWxpZCkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG9iaiB0byBob2xkIGZvcm1kYXRhXG4gICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAvLyBBcHBlbmQgaW5wdXQgdG8gZm9ybSBkYXRhXG4gICAgZm9ybURhdGEuYXBwZW5kKCdmaXJzdG5hbWUnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCdmaXJzdG5hbWUnKS52YWx1ZSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdsYXN0bmFtZScsIHRoaXMuc2lnbnVwRm9ybS5nZXQoJ2xhc3RuYW1lJykudmFsdWUpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgndW5pdmVyc2l0eScsIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5KTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3VzZXJuYW1lJywgdGhpcy5zaWdudXBGb3JtLmdldCgndXNlcm5hbWUnKS52YWx1ZSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdwYXNzd29yZCcsIHRoaXMuc2lnbnVwRm9ybS5nZXQoJ3Bhc3N3b3JkJykudmFsdWUpO1xuXG4gICAgdGhpcy5hdXRoLnNpZ251cCh0aGlzLmYuZmlyc3RuYW1lLnZhbHVlLCB0aGlzLmYubGFzdG5hbWUudmFsdWUsIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5LCB0aGlzLmYudXNlcm5hbWUudmFsdWUsIHRoaXMuZi5wYXNzd29yZC52YWx1ZSlcbiAgICAudGhlbihkYXRhID0+IHtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJldHVyblVybF0pO1xuICAgIH0sXG4gICAgZXJyb3IgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NJR04gVVAgRVJST1I6JywgZXJyb3IpO1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cblxuXG4vLyBEb250IHBsYWNlIGFueSBjb2RlIGJlbG93IHRoaXMgZmluYWwgbGluZSBhcyBpdCB3aWxsIG5vdCBleGVjdXRlIHdoZW4gcnVubmluZyB0aGUgTmF0aXZlU2NyaXB0IGFwcFxuLy8gVGhpcyBpcyB0aGUgaW5pdGFsIHN0YXJ0aW5nIHBvaW50IG9mIHRoZSBhcHAhICBEb250IGNoYW5nZSB1bmxlc3Mgd2UgZG8gYSB0ZWFtIGRpc2N1c3NpbiBhbmQgZGVzaWduIGNoYW5nZXNcbi8vIH4gTm9haFxuXG5hcHBsaWNhdGlvbi5ydW4oeyBtb2R1bGVOYW1lOiBcInNpZ251cFwiICB9KTtcbiJdfQ==