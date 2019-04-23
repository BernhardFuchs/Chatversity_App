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
        this.returnUrl = 'new-user';
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
// This is the inital starting point of the app!  Dont change unless we do a team discussion and design changes
// ~ Noah
application.run({ moduleName: "signup" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvT25ib2FyZGluZy9zaWdudXAvc2lnbnVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQUVqRCw2Q0FBaUQ7QUFDakQsNkNBQWtEO0FBRWxELHdDQUF3RjtBQUN4RiwwQ0FBd0Q7QUFFeEQsa0VBQStEO0FBRy9ELHNFQUF5RTtBQUN6RSxpRUFBK0Q7QUFFL0QsdUJBQXVCO0FBQ3ZCLDBEQUE2RDtBQUM3RCxtREFBeUQ7QUFHekQsSUFBTSxLQUFLLEdBQUcsb0JBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxvREFBb0Q7QUFDcEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUd4QixJQUFNLFdBQVcsR0FBRztJQUNsQixPQUFPLEVBQUUsSUFBSSxrQkFBVyxDQUFDO1FBQ3ZCLGNBQWMsRUFBRyxrQkFBa0I7UUFDbkMsZUFBZSxFQUFFLGVBQWU7S0FDakMsQ0FBQztDQUNILENBQUE7QUFTRDtJQVdFLHlCQUNVLFdBQXdCLEVBQ3hCLE1BQWMsRUFDZCxJQUFpQixFQUNqQixJQUFnQjtRQUhoQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUNqQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBYjFCLFlBQU8sR0FBRyxLQUFLLENBQUE7UUFDZixjQUFTLEdBQUcsS0FBSyxDQUFBO1FBR2pCLHVCQUFrQixHQUFHLEtBQUssQ0FBQTtRQUMxQixvQkFBZSxHQUFHLEtBQUssQ0FBQTtRQUN2QixtQkFBYyxHQUF5QixJQUFJLHNDQUFvQixFQUFFLENBQUE7SUFPbkMsQ0FBQztJQUUvQixrQ0FBUSxHQUFSO1FBRUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtB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TUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDO3lDQWN1QixtQkFBVztZQUNoQixlQUFNO1lBQ1IsMEJBQVc7WUFDWCxpQkFBVTtPQWZmLGVBQWUsQ0E0STNCO0lBQUQsc0JBQUM7Q0FBQSxBQTVJRCxJQTRJQztBQTVJWSwwQ0FBZTtBQStJNUIscUdBQXFHO0FBQ3JHLCtHQUErRztBQUMvRyxTQUFTO0FBRVQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJ1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnXG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJ1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnXG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuaW1wb3J0IHsgT2t0YUF1dGhTZXJ2aWNlIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJ1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnXG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJ1xuaW1wb3J0IHsgVW5pdmVyc2l0eSB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy91bml2ZXJzaXR5J1xuaW1wb3J0IHsgQ3VzdG9tRm9ybVZhbGlkYXRpb24gfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvZm9ybS12YWxpZGF0aW9uJ1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnXG5cbi8vIE5hdGl2ZVNjcmlwdCBJbXBvcnRzXG5pbXBvcnQgYXBwbGljYXRpb24gPSByZXF1aXJlKFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvblwiKTtcbmltcG9ydCB7IGdldEZyYW1lQnlJZCB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvZnJhbWUnO1xuXG5cbmNvbnN0IGZyYW1lID0gZ2V0RnJhbWVCeUlkKFwic2lnbnVwRnJhbWVcIik7XG4vLyBOYXZpZ2F0ZSBmcm9tIFNpZ251cCBjb21wb25lbnQgdG8gTG9naW4gY29tcG9uZW50XG5mcmFtZS5uYXZpZ2F0ZShcImxvZ2luXCIpO1xuXG5cbmNvbnN0IGh0dHBPcHRpb25zID0ge1xuICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICdDb250ZW50LVR5cGUnOiAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdBdXRob3JpemF0aW9uJzogJ215LWF1dGgtdG9rZW4nXG4gIH0pXG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zaWdudXAnLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICB0ZW1wbGF0ZVVybDogJy4vc2lnbnVwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2lnbnVwLmNvbXBvbmVudC5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIFNpZ251cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHNpZ251cEZvcm06IEZvcm1Hcm91cFxuICBsb2FkaW5nID0gZmFsc2VcbiAgc3VibWl0dGVkID0gZmFsc2VcbiAgcmV0dXJuVXJsOiBzdHJpbmdcbiAgdW5pdmVyc2l0aWVzOiBVbml2ZXJzaXR5W11cbiAgc2VhcmNoaW5nRm9yU2Nob29sID0gZmFsc2VcbiAgd3JvbmdVbml2ZXJzaXR5ID0gZmFsc2VcbiAgZm9ybVZhbGlkYXRpb246IEN1c3RvbUZvcm1WYWxpZGF0aW9uID0gbmV3IEN1c3RvbUZvcm1WYWxpZGF0aW9uKClcbiAgZ3Vlc3NVbml2ZXJzaXR5OiBzdHJpbmdcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgYXV0aDogQXV0aFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIHRoaXMuc2lnbnVwRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgZmlyc3RuYW1lOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgbGFzdG5hbWU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICB1bml2ZXJzaXR5OiBbdGhpcy5ndWVzc1VuaXZlcnNpdHksIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgdXNlcm5hbWU6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5lbWFpbCwgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuZm9ybVZhbGlkYXRpb24uZWR1RW1haWxWYWxpZGF0aW9uKVxuICAgICAgXSldLFxuICAgICAgcGFzc3dvcmQ6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFtcbiAgICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5taW5MZW5ndGgoOCksIFZhbGlkYXRvcnMucGF0dGVybih0aGlzLmZvcm1WYWxpZGF0aW9uLnBhc3N3b3JkVmFsaWRhdGlvbilcbiAgICAgIF0pXVxuICAgIH0pXG5cbiAgICB0aGlzLnJldHVyblVybCA9ICduZXctdXNlcidcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDSEVDSyBGT1IgVVNFUk5BTUUgT1IgUEFTU1dPUkQgRVJST1JTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBjaGVja0ZvckZvcm1FcnJvcnMoKSB7XG4gICAgaWYgKHRoaXMuZi51c2VybmFtZS5lcnJvcnMgfHwgdGhpcy5mLnBhc3N3b3JkLmVycm9ycykge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgQ09OVkVOSUVOQ0UgR0VUVEVSIEZPUiBFQVNZIEFDQ0VTUyBUTyBGT1JNIEZJRUxEUyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgZ2V0IGYoKSB7IHJldHVybiB0aGlzLnNpZ251cEZvcm0uY29udHJvbHMgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBWQUxJREFURSBVTklWRVJTSVRZIFdJVEggSlNPTiBTVE9SRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgdmFsaWRhdGVVbml2ZXJzaXR5KHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlYXJjaGluZ0ZvclNjaG9vbCA9IHRydWVcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VuaXZlcnNpdHkvbmFtZS8ke3F1ZXJ5fWApXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4odW5pdmVyc2l0eSA9PiB7XG4gICAgICByZXR1cm4gdW5pdmVyc2l0eVxuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgIHRoaXMuc2VhcmNoaW5nRm9yU2Nob29sID0gZmFsc2VcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSlcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBTRUFSQ0ggRk9SIFVOSVZFUlNJVFkgRlJPTSBKU09OIFNUT1JFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBmaW5kVW5pdmVyc2l0eShxdWVyeTogc3RyaW5nKSB7XG4gICAgdGhpcy5zZWFyY2hpbmdGb3JTY2hvb2wgPSB0cnVlXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7ZW52aXJvbm1lbnQuYXBpVXJsfS91bml2ZXJzaXR5LyR7cXVlcnl9YClcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbih1bml2ZXJzaXR5ID0+IHtcbiAgICAgIHJldHVybiB1bml2ZXJzaXR5XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgdGhpcy5zZWFyY2hpbmdGb3JTY2hvb2wgPSBmYWxzZVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9KVxuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEdFVCBVTklWRVJTSVRZIEJZIERPTUFJTiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgYXN5bmMgZ2V0VW5pdmVyc2l0eShxdWVyeTogc3RyaW5nKSB7XG4gICAgbGV0IGRhdGEgPSBuZXcgT2JqZWN0KClcbiAgICBkYXRhID0gYXdhaXQgdGhpcy5maW5kVW5pdmVyc2l0eShxdWVyeSlcblxuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLmd1ZXNzVW5pdmVyc2l0eSA9IGRhdGFbJ25hbWUnXVxuICAgICAgdGhpcy5zaWdudXBGb3JtLmdldCgndW5pdmVyc2l0eScpLnNldFZhbHVlKHRoaXMuZ3Vlc3NVbml2ZXJzaXR5KVxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBVUERBVEUgVU5JVkVSU0lUWSBJRiBVU0VSIENIQU5HRVMgSU5QVVQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIHVzZXJVcGRhdGVVbml2ZXJzaXR5KG5ld1VuaXZlcnNpdHk6IHN0cmluZykge1xuICAgIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5ID0gbmV3VW5pdmVyc2l0eVxuXG4gICAgdGhpcy52YWxpZGF0ZVVuaXZlcnNpdHkodGhpcy5ndWVzc1VuaXZlcnNpdHkpXG4gICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgIHRoaXMuZi51bml2ZXJzaXR5LnNldEVycm9ycyh7J2ludmFsaWQnOiB0cnVlfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBTSUdOIFVQIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICBvblN1Ym1pdCgpIHtcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWVcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG5cbiAgICAvLyBzdG9wIGhlcmUgaWYgZm9ybSBpcyBpbnZhbGlkXG4gICAgaWYgKHRoaXMuc2lnbnVwRm9ybS5pbnZhbGlkKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG9iaiB0byBob2xkIGZvcm1kYXRhXG4gICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcblxuICAgIC8vIEFwcGVuZCBpbnB1dCB0byBmb3JtIGRhdGFcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpcnN0bmFtZScsIHRoaXMuc2lnbnVwRm9ybS5nZXQoJ2ZpcnN0bmFtZScpLnZhbHVlKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgnbGFzdG5hbWUnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCdsYXN0bmFtZScpLnZhbHVlKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgndW5pdmVyc2l0eScsIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5KVxuICAgIGZvcm1EYXRhLmFwcGVuZCgndXNlcm5hbWUnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCd1c2VybmFtZScpLnZhbHVlKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgncGFzc3dvcmQnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCdwYXNzd29yZCcpLnZhbHVlKVxuXG4gICAgdGhpcy5hdXRoLnNpZ251cCh0aGlzLmYuZmlyc3RuYW1lLnZhbHVlLCB0aGlzLmYubGFzdG5hbWUudmFsdWUsIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5LCB0aGlzLmYudXNlcm5hbWUudmFsdWUsIHRoaXMuZi5wYXNzd29yZC52YWx1ZSlcbiAgICAudGhlbihkYXRhID0+IHtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJldHVyblVybF0pXG4gICAgfSxcbiAgICBlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU0lHTiBVUCBFUlJPUjonLCBlcnJvcilcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgfSlcbiAgfVxufVxuXG5cbi8vIERvbnQgcGxhY2UgYW55IGNvZGUgYmVsb3cgdGhpcyBmaW5hbCBsaW5lIGFzIGl0IHdpbGwgbm90IGV4ZWN1dGUgd2hlbiBydW5uaW5nIHRoZSBOYXRpdmVTY3JpcHQgYXBwXG4vLyBUaGlzIGlzIHRoZSBpbml0YWwgc3RhcnRpbmcgcG9pbnQgb2YgdGhlIGFwcCEgIERvbnQgY2hhbmdlIHVubGVzcyB3ZSBkbyBhIHRlYW0gZGlzY3Vzc2lvbiBhbmQgZGVzaWduIGNoYW5nZXNcbi8vIH4gTm9haFxuXG5hcHBsaWNhdGlvbi5ydW4oeyBtb2R1bGVOYW1lOiBcInNpZ251cFwiICB9KTtcbiJdfQ==