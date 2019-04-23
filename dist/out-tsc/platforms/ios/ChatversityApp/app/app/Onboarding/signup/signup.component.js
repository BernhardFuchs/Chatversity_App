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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL2FwcC9PbmJvYXJkaW5nL3NpZ251cC9zaWdudXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBRWxELDZDQUFrRDtBQUNsRCw2Q0FBbUQ7QUFFbkQsd0NBQXlGO0FBQ3pGLDBDQUF5RDtBQUV6RCxrRUFBZ0U7QUFHaEUsc0VBQTBFO0FBQzFFLGlFQUFnRTtBQUVoRSx1QkFBdUI7QUFDdkIsMERBQTZEO0FBQzdELG1EQUF5RDtBQUd6RCxJQUFNLEtBQUssR0FBRyxvQkFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLG9EQUFvRDtBQUNwRCxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBR3hCLElBQU0sV0FBVyxHQUFHO0lBQ2xCLE9BQU8sRUFBRSxJQUFJLGtCQUFXLENBQUM7UUFDdkIsY0FBYyxFQUFHLGtCQUFrQjtRQUNuQyxlQUFlLEVBQUUsZUFBZTtLQUNqQyxDQUFDO0NBQ0gsQ0FBQztBQVNGO0lBV0UseUJBQ1UsV0FBd0IsRUFDeEIsTUFBYyxFQUNkLElBQWlCLEVBQ2pCLElBQWdCO1FBSGhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQVk7UUFiMUIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBR2xCLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUMzQixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixtQkFBYyxHQUF5QixJQUFJLHNDQUFvQixFQUFFLENBQUM7SUFPcEMsQ0FBQztJQUUvQixrQ0FBUSxHQUFSO1FBRUUs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LENBQUM7WUFDVCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDO3lDQWN1QixtQkFBVztZQUNoQixlQUFNO1lBQ1IsMEJBQVc7WUFDWCxpQkFBVTtPQWZmLGVBQWUsQ0E0STNCO0lBQUQsc0JBQUM7Q0FBQSxBQTVJRCxJQTRJQztBQTVJWSwwQ0FBZTtBQStJNUIscUdBQXFHO0FBQ3JHLDhHQUE4RztBQUM5RyxTQUFTO0FBRVQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE5nRm9ybSwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9rdGFBdXRoU2VydmljZSB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBmaXJzdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFVuaXZlcnNpdHkgfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvdW5pdmVyc2l0eSc7XG5pbXBvcnQgeyBDdXN0b21Gb3JtVmFsaWRhdGlvbiB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy9mb3JtLXZhbGlkYXRpb24nO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuXG4vLyBOYXRpdmVTY3JpcHQgSW1wb3J0c1xuaW1wb3J0IGFwcGxpY2F0aW9uID0gcmVxdWlyZShcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIik7XG5pbXBvcnQgeyBnZXRGcmFtZUJ5SWQgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL2ZyYW1lJztcblxuXG5jb25zdCBmcmFtZSA9IGdldEZyYW1lQnlJZChcInNpZ251cEZyYW1lXCIpO1xuLy8gTmF2aWdhdGUgZnJvbSBTaWdudXAgY29tcG9uZW50IHRvIExvZ2luIGNvbXBvbmVudFxuZnJhbWUubmF2aWdhdGUoXCJsb2dpblwiKTtcblxuXG5jb25zdCBodHRwT3B0aW9ucyA9IHtcbiAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAnQ29udGVudC1UeXBlJzogICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnQXV0aG9yaXphdGlvbic6ICdteS1hdXRoLXRva2VuJ1xuICB9KVxufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXNpZ251cCcsXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHRlbXBsYXRlVXJsOiAnLi9zaWdudXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zaWdudXAuY29tcG9uZW50LmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgU2lnbnVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgc2lnbnVwRm9ybTogRm9ybUdyb3VwO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIHN1Ym1pdHRlZCA9IGZhbHNlO1xuICByZXR1cm5Vcmw6IHN0cmluZztcbiAgdW5pdmVyc2l0aWVzOiBVbml2ZXJzaXR5W107XG4gIHNlYXJjaGluZ0ZvclNjaG9vbCA9IGZhbHNlO1xuICB3cm9uZ1VuaXZlcnNpdHkgPSBmYWxzZTtcbiAgZm9ybVZhbGlkYXRpb246IEN1c3RvbUZvcm1WYWxpZGF0aW9uID0gbmV3IEN1c3RvbUZvcm1WYWxpZGF0aW9uKCk7XG4gIGd1ZXNzVW5pdmVyc2l0eTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBhdXRoOiBBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgdGhpcy5zaWdudXBGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBmaXJzdG5hbWU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICBsYXN0bmFtZTogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgIHVuaXZlcnNpdHk6IFt0aGlzLmd1ZXNzVW5pdmVyc2l0eSwgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICB1c2VybmFtZTogWycnLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLmVtYWlsLCBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5mb3JtVmFsaWRhdGlvbi5lZHVFbWFpbFZhbGlkYXRpb24pXG4gICAgICBdKV0sXG4gICAgICBwYXNzd29yZDogWycnLCBWYWxpZGF0b3JzLmNvbXBvc2UoW1xuICAgICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCg4KSwgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuZm9ybVZhbGlkYXRpb24ucGFzc3dvcmRWYWxpZGF0aW9uKVxuICAgICAgXSldXG4gICAgfSk7XG5cbiAgICB0aGlzLnJldHVyblVybCA9ICcvbmV3LXVzZXInO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENIRUNLIEZPUiBVU0VSTkFNRSBPUiBQQVNTV09SRCBFUlJPUlMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIGNoZWNrRm9yRm9ybUVycm9ycygpIHtcbiAgICBpZiAodGhpcy5mLnVzZXJuYW1lLmVycm9ycyB8fCB0aGlzLmYucGFzc3dvcmQuZXJyb3JzKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIENPTlZFTklFTkNFIEdFVFRFUiBGT1IgRUFTWSBBQ0NFU1MgVE8gRk9STSBGSUVMRFMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG4gIGdldCBmKCkgeyByZXR1cm4gdGhpcy5zaWdudXBGb3JtLmNvbnRyb2xzOyB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIFZBTElEQVRFIFVOSVZFUlNJVFkgV0lUSCBKU09OIFNUT1JFIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICB2YWxpZGF0ZVVuaXZlcnNpdHkocXVlcnk6IHN0cmluZykge1xuICAgIHRoaXMuc2VhcmNoaW5nRm9yU2Nob29sID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VuaXZlcnNpdHkvbmFtZS8ke3F1ZXJ5fWApXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4odW5pdmVyc2l0eSA9PiB7XG4gICAgICByZXR1cm4gdW5pdmVyc2l0eTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICB0aGlzLnNlYXJjaGluZ0ZvclNjaG9vbCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgU0VBUkNIIEZPUiBVTklWRVJTSVRZIEZST00gSlNPTiBTVE9SRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgZmluZFVuaXZlcnNpdHkocXVlcnk6IHN0cmluZykge1xuICAgIHRoaXMuc2VhcmNoaW5nRm9yU2Nob29sID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3VuaXZlcnNpdHkvJHtxdWVyeX1gKVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKHVuaXZlcnNpdHkgPT4ge1xuICAgICAgcmV0dXJuIHVuaXZlcnNpdHk7XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgdGhpcy5zZWFyY2hpbmdGb3JTY2hvb2wgPSBmYWxzZTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEdFVCBVTklWRVJTSVRZIEJZIERPTUFJTiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgYXN5bmMgZ2V0VW5pdmVyc2l0eShxdWVyeTogc3RyaW5nKSB7XG4gICAgbGV0IGRhdGEgPSBuZXcgT2JqZWN0KCk7XG4gICAgZGF0YSA9IGF3YWl0IHRoaXMuZmluZFVuaXZlcnNpdHkocXVlcnkpO1xuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuZ3Vlc3NVbml2ZXJzaXR5ID0gZGF0YVsnbmFtZSddO1xuICAgICAgdGhpcy5zaWdudXBGb3JtLmdldCgndW5pdmVyc2l0eScpLnNldFZhbHVlKHRoaXMuZ3Vlc3NVbml2ZXJzaXR5KTtcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgVVBEQVRFIFVOSVZFUlNJVFkgSUYgVVNFUiBDSEFOR0VTIElOUFVUIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuICB1c2VyVXBkYXRlVW5pdmVyc2l0eShuZXdVbml2ZXJzaXR5OiBzdHJpbmcpIHtcbiAgICB0aGlzLmd1ZXNzVW5pdmVyc2l0eSA9IG5ld1VuaXZlcnNpdHk7XG5cbiAgICB0aGlzLnZhbGlkYXRlVW5pdmVyc2l0eSh0aGlzLmd1ZXNzVW5pdmVyc2l0eSlcbiAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgdGhpcy5mLnVuaXZlcnNpdHkuc2V0RXJyb3JzKHsnaW52YWxpZCc6IHRydWV9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBIQU5ETEUgU0lHTiBVUCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cbiAgb25TdWJtaXQoKSB7XG4gICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICAvLyBzdG9wIGhlcmUgaWYgZm9ybSBpcyBpbnZhbGlkXG4gICAgaWYgKHRoaXMuc2lnbnVwRm9ybS5pbnZhbGlkKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgb2JqIHRvIGhvbGQgZm9ybWRhdGFcbiAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIC8vIEFwcGVuZCBpbnB1dCB0byBmb3JtIGRhdGFcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpcnN0bmFtZScsIHRoaXMuc2lnbnVwRm9ybS5nZXQoJ2ZpcnN0bmFtZScpLnZhbHVlKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2xhc3RuYW1lJywgdGhpcy5zaWdudXBGb3JtLmdldCgnbGFzdG5hbWUnKS52YWx1ZSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCd1bml2ZXJzaXR5JywgdGhpcy5ndWVzc1VuaXZlcnNpdHkpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgndXNlcm5hbWUnLCB0aGlzLnNpZ251cEZvcm0uZ2V0KCd1c2VybmFtZScpLnZhbHVlKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3Bhc3N3b3JkJywgdGhpcy5zaWdudXBGb3JtLmdldCgncGFzc3dvcmQnKS52YWx1ZSk7XG5cbiAgICB0aGlzLmF1dGguc2lnbnVwKHRoaXMuZi5maXJzdG5hbWUudmFsdWUsIHRoaXMuZi5sYXN0bmFtZS52YWx1ZSwgdGhpcy5ndWVzc1VuaXZlcnNpdHksIHRoaXMuZi51c2VybmFtZS52YWx1ZSwgdGhpcy5mLnBhc3N3b3JkLnZhbHVlKVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucmV0dXJuVXJsXSk7XG4gICAgfSxcbiAgICBlcnJvciA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU0lHTiBVUCBFUlJPUjonLCBlcnJvcik7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxufVxuXG5cbi8vIERvbnQgcGxhY2UgYW55IGNvZGUgYmVsb3cgdGhpcyBmaW5hbCBsaW5lIGFzIGl0IHdpbGwgbm90IGV4ZWN1dGUgd2hlbiBydW5uaW5nIHRoZSBOYXRpdmVTY3JpcHQgYXBwXG4vLyBUaGlzIGlzIHRoZSBpbml0YWwgc3RhcnRpbmcgcG9pbnQgb2YgdGhlIGFwcCEgIERvbnQgY2hhbmdlIHVubGVzcyB3ZSBkbyBhIHRlYW0gZGlzY3Vzc2luIGFuZCBkZXNpZ24gY2hhbmdlc1xuLy8gfiBOb2FoXG5cbmFwcGxpY2F0aW9uLnJ1bih7IG1vZHVsZU5hbWU6IFwic2lnbnVwXCIgIH0pO1xuIl19