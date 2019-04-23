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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvYXBwL09uYm9hcmRpbmcvc2lnbnVwL3NpZ251cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFFbEQsNkNBQWtEO0FBQ2xELDZDQUFtRDtBQUVuRCx3Q0FBeUY7QUFDekYsMENBQXlEO0FBRXpELGtFQUFnRTtBQUdoRSxzRUFBMEU7QUFDMUUsaUVBQWdFO0FBRWhFLHVCQUF1QjtBQUN2QiwwREFBNkQ7QUFDN0QsbURBQXlEO0FBR3pELElBQU0sS0FBSyxHQUFHLG9CQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsb0RBQW9EO0FBQ3BELEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFHeEIsSUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFLElBQUksa0JBQVcsQ0FBQztRQUN2QixjQUFjLEVBQUcsa0JBQWtCO1FBQ25DLGVBQWUsRUFBRSxlQUFlO0tBQ2pDLENBQUM7Q0FDSCxDQUFDO0FBU0Y7SUFXRSx5QkFDVSxXQUF3QixFQUN4QixNQUFjLEVBQ2QsSUFBaUIsRUFDakIsSUFBZ0I7UUFIaEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFNBQUksR0FBSixJQUFJLENBQWE7UUFDakIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQWIxQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFHbEIsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQzNCLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLG1CQUFjLEdBQXlCLElBQUksc0NBQW9CLEVBQUUs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LENBQUM7SUFDTCxDQUFDO0lBM0lVLGVBQWU7UUFQM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1NBQ3RDLENBQUM7eUNBY3VCLG1CQUFXO1lBQ2hCLGVBQU07WUFDUiwwQkFBVztZQUNYLGlCQUFVO09BZmYsZUFBZSxDQTRJM0I7SUFBRCxzQkFBQztDQUFBLEFBNUlELElBNElDO0FBNUlZLDBDQUFlO0FBK0k1QixxR0FBcUc7QUFDckcsOEdBQThHO0FBQzlHLFNBQVM7QUFFVCxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2t0YUF1dGhTZXJ2aWNlIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVW5pdmVyc2l0eSB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy91bml2ZXJzaXR5JztcbmltcG9ydCB7IEN1c3RvbUZvcm1WYWxpZGF0aW9uIH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL2Zvcm0tdmFsaWRhdGlvbic7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5cbi8vIE5hdGl2ZVNjcmlwdCBJbXBvcnRzXG5pbXBvcnQgYXBwbGljYXRpb24gPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvblwiKTtcbmltcG9ydCB7IGdldEZyYW1lQnlJZCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWUnO1xuXG5cbmNvbnN0IGZyYW1lID0gZ2V0RnJhbWVCeUlkKFwic2lnbnVwRnJhbWVcIik7XG4vLyBOYXZpZ2F0ZSBmcm9tIFNpZ251cCBjb21wb25lbnQgdG8gTG9naW4gY29tcG9uZW50XG5mcmFtZS5uYXZpZ2F0ZShcImxvZ2luXCIpO1xuXG5cbmNvbnN0IGh0dHBPcHRpb25zID0ge1xuICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICdDb250ZW50LVR5cGUnOiAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdBdXRob3JpemF0aW9uJzogJ215LWF1dGgtdG9rZW4nXG4gIH0pXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2lnbnVwJyxcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpZ251cC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NpZ251cC5jb21wb25lbnQuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBTaWdudXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBzaWdudXBGb3JtOiBGb3JtR3JvdXA7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgc3VibWl0dGVkID0gZmFsc2U7XG4gIHJldHVyblVybDogc3RyaW5nO1xuICB1bml2ZXJzaXRpZXM6IFVuaXZlcnNpdHlbXTtcbiAgc2VhcmNoaW5nRm9yU2Nob29sID0gZmFsc2U7XG4gIHdyb25nVW5pdmVyc2l0eSA9IGZhbHNlO1xuICBmb3JtVmFsaWRhdGlvbjogQ3VzdG9tRm9ybVZhbGlkYXRpb24gPSBuZXcgQ3VzdG9tRm9ybVZhbGlkYXRpb24oKTtcbiAgZ3Vlc3NVbml2ZXJzaXR5OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIGF1dGg6IEF1dGhTZXJ2aWNlLFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICB0aGlzLnNpZ251cEZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIGZpcnN0bmFtZTogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgIGxhc3RuYW1lOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgdW5pdmVyc2l0eTogW3RoaXMuZ3Vlc3NVbml2ZXJzaXR5LCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgIHVzZXJuYW1lOiBbJycsIFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMuZW1haWwsIFZhbGlkYXRvcnMucGF0dGVybih0aGlzLmZvcm1WYWxpZGF0aW9uLmVkdUVtYWlsVmFsaWRhdGlvbilcbiAgICAgIF0pXSxcbiAgICAgIHBhc3N3b3JkOiBbJycsIFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDgpLCBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5mb3JtVmFsaWRhdGlvbi5wYXNzd29yZFZhbGlkYXRpb24pXG4gICAgICBdKV1cbiAgICB9KTtcblxuICAgIHRoaXMucmV0dXJuVXJsID0gJy9uZXctdXNlcic7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgQ0hFQ0sgRk9SIFVTRVJOQU1FIE9SIFBBU1NXT1JEIEVSUk9SUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgY2hlY2tGb3JGb3JtRXJyb3JzKCkge1xuICAgIGlmICh0aGlzLmYudXNlcm5hbWUuZXJyb3JzIHx8IHRoaXMuZi5wYXNzd29yZC5lcnJvcnMpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgQ09OVkVOSUVOQ0UgR0VUVEVSIEZPUiBFQVNZIEFDQ0VTUyBUTyBGT1JNIEZJRUxEUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgZ2V0IGYoKSB7IHJldHVybiB0aGlzLnNpZ251cEZvcm0uY29udHJvbHM7IH1cblxuICAvL1xuICAvLyDilIDilIDilIAgVkFMSURBVEUgVU5JVkVSU0lUWSBXSVRIIEpTT04gU1RPUkUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIHZhbGlkYXRlVW5pdmVyc2l0eShxdWVyeTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZWFyY2hpbmdGb3JTY2hvb2wgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke2Vudmlyb25tZW50LmFwaVVybH0vdW5pdmVyc2l0eS9uYW1lLyR7cXVlcnl9YClcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbih1bml2ZXJzaXR5ID0+IHtcbiAgICAgIHJldHVybiB1bml2ZXJzaXR5O1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoaW5nRm9yU2Nob29sID0gZmFsc2U7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTRUFSQ0ggRk9SIFVOSVZFUlNJVFkgRlJPTSBKU09OIFNUT1JFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBmaW5kVW5pdmVyc2l0eShxdWVyeTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZWFyY2hpbmdGb3JTY2hvb2wgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KGAke2Vudmlyb25tZW50LmFwaVVybH0vdW5pdmVyc2l0eS8ke3F1ZXJ5fWApXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4odW5pdmVyc2l0eSA9PiB7XG4gICAgICByZXR1cm4gdW5pdmVyc2l0eTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICB0aGlzLnNlYXJjaGluZ0ZvclNjaG9vbCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgR0VUIFVOSVZFUlNJVFkgQlkgRE9NQUlOIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBhc3luYyBnZXRVbml2ZXJzaXR5KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICBsZXQgZGF0YSA9IG5ldyBPYmplY3QoKTtcbiAgICBkYXRhID0gYXdhaXQgdGhpcy5maW5kVW5pdmVyc2l0eShxdWVyeSk7XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5ndWVzc1VuaXZlcnNpdHkgPSBkYXRhWyduYW1lJ107XG4gICAgICB0aGlzLnNpZ251cEZvcm0uZ2V0KCd1bml2ZXJzaXR5Jykuc2V0VmFsdWUodGhpcy5ndWVzc1VuaXZlcnNpdHkpO1xuICAgIH1cbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBVUERBVEUgVU5JVkVSU0lUWSBJRiBVU0VSIENIQU5HRVMgSU5QVVQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIHVzZXJVcGRhdGVVbml2ZXJzaXR5KG5ld1VuaXZlcnNpdHk6IHN0cmluZykge1xuICAgIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5ID0gbmV3VW5pdmVyc2l0eTtcblxuICAgIHRoaXMudmFsaWRhdGVVbml2ZXJzaXR5KHRoaXMuZ3Vlc3NVbml2ZXJzaXR5KVxuICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICB0aGlzLmYudW5pdmVyc2l0eS5zZXRFcnJvcnMoeydpbnZhbGlkJzogdHJ1ZX0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBTSUdOIFVQIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBvblN1Ym1pdCgpIHtcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIC8vIHN0b3AgaGVyZSBpZiBmb3JtIGlzIGludmFsaWRcbiAgICBpZiAodGhpcy5zaWdudXBGb3JtLmludmFsaWQpIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBvYmogdG8gaG9sZCBmb3JtZGF0YVxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgLy8gQXBwZW5kIGlucHV0IHRvIGZvcm0gZGF0YVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlyc3RuYW1lJywgdGhpcy5zaWdudXBGb3JtLmdldCgnZmlyc3RuYW1lJykudmFsdWUpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnbGFzdG5hbWUnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCdsYXN0bmFtZScpLnZhbHVlKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3VuaXZlcnNpdHknLCB0aGlzLmd1ZXNzVW5pdmVyc2l0eSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCd1c2VybmFtZScsIHRoaXMuc2lnbnVwRm9ybS5nZXQoJ3VzZXJuYW1lJykudmFsdWUpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgncGFzc3dvcmQnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCdwYXNzd29yZCcpLnZhbHVlKTtcblxuICAgIHRoaXMuYXV0aC5zaWdudXAodGhpcy5mLmZpcnN0bmFtZS52YWx1ZSwgdGhpcy5mLmxhc3RuYW1lLnZhbHVlLCB0aGlzLmd1ZXNzVW5pdmVyc2l0eSwgdGhpcy5mLnVzZXJuYW1lLnZhbHVlLCB0aGlzLmYucGFzc3dvcmQudmFsdWUpXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5yZXR1cm5VcmxdKTtcbiAgICB9LFxuICAgIGVycm9yID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTSUdOIFVQIEVSUk9SOicsIGVycm9yKTtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG59XG5cblxuLy8gRG9udCBwbGFjZSBhbnkgY29kZSBiZWxvdyB0aGlzIGZpbmFsIGxpbmUgYXMgaXQgd2lsbCBub3QgZXhlY3V0ZSB3aGVuIHJ1bm5pbmcgdGhlIE5hdGl2ZVNjcmlwdCBhcHBcbi8vIFRoaXMgaXMgdGhlIGluaXRhbCBzdGFydGluZyBwb2ludCBvZiB0aGUgYXBwISAgRG9udCBjaGFuZ2UgdW5sZXNzIHdlIGRvIGEgdGVhbSBkaXNjdXNzaW4gYW5kIGRlc2lnbiBjaGFuZ2VzXG4vLyB+IE5vYWhcblxuYXBwbGljYXRpb24ucnVuKHsgbW9kdWxlTmFtZTogXCJzaWdudXBcIiAgfSk7XG4iXX0=