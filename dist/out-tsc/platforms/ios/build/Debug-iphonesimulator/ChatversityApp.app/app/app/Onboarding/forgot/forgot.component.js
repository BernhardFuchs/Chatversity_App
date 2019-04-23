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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvYXBwL09uYm9hcmRpbmcvZm9yZ290L2ZvcmdvdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFLbEQsd0NBQXlGO0FBQ3pGLDBDQUF5RDtBQUd6RCxzRUFBMEU7QUFPMUU7SUFRRSx5QkFDVSxXQUF3QixFQUN4QixLQUFxQixFQUNyQixNQUFjO1FBRmQsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFDckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVR4QixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsYUFBUSxHQUFHLGlCQUFpQixDQUFDO1FBQzdCLG1CQUFjLEdBQXlCLElBQUksc0NBQW9CLEVBQUUsQ0FBQztJQUt0QyxDQUFDO0lBRTdCLGtDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFFLGtCQUFVLENBQUMsUUFBUSxFQUFFLGtCQUFVLENBQUMsS0FBSyxFQUFFLGtCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUksQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDdkIsQ0FBQztJQUdELHNCQUFJLDhCQUFDO1FBREwsb0RBQW9EO2FBQ3BELGNBQVUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTVDLGtDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVwQixzREFBc0Q7UUFFdEQsK0JBQStCO1FBQy9CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsT0FBTztTQUNSO1FBRUQsOEJBQThCO1FBQzlCLElBQU0sUUFBUSxHQUFhLElBQUksUUFBUSxFQUFFLENBQUM7UUFFMUMsNEJBQTRCO1FBQzVCLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhFLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUEzQ1UsZUFBZTtRQUwzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDO3lDQVV1QixtQkFBVztZQUNqQix1QkFBYztZQUNiLGVBQU07T0FYYixlQUFlLENBNkMzQjtJQUFELHNCQUFDO0NBQUEsQUE3Q0QsSUE2Q0M7QUE3Q1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlcXVlc3QgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE5nRm9ybSwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9rdGFBdXRoU2VydmljZSB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBDdXN0b21Gb3JtVmFsaWRhdGlvbiB9IGZyb20gJy4uLy4uL0NvcmUvX21vZGVscy9mb3JtLXZhbGlkYXRpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtZm9yZ290JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ZvcmdvdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2ZvcmdvdC5jb21wb25lbnQuY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIEZvcmdvdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGZvcmdvdEZvcm06IEZvcm1Hcm91cDtcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgcmV0dXJuVXJsOiBzdHJpbmc7XG4gIGFwcFRpdGxlID0gJ0ZvcmdvdCBQYXNzd29yZCc7XG4gIGZvcm1WYWxpZGF0aW9uOiBDdXN0b21Gb3JtVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21Gb3JtVmFsaWRhdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgcm91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZm9yZ290Rm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgZW1haWw6IFsnJywgVmFsaWRhdG9ycy5jb21wb3NlKFsgVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5lbWFpbCwgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuZm9ybVZhbGlkYXRpb24ucmVndWxhckVtYWlsVmFsaWRhdGlvbildKV1cbiAgICB9KTtcblxuICAgIHRoaXMucmV0dXJuVXJsID0gJy8nO1xuICB9XG5cbiAgLy8gQ29udmVuaWVuY2UgZ2V0dGVyIGZvciBlYXN5IGFjY2VzcyB0byBmb3JtIGZpZWxkc1xuICBnZXQgZigpIHsgcmV0dXJuIHRoaXMuZm9yZ290Rm9ybS5jb250cm9sczsgfVxuXG4gIG9uU3VibWl0KCkge1xuICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgLy8gaHR0cC5wb3N0KGAke2Vudmlyb25tZW50LmFwaVVybH0vcmVjb3ZlcnkvZm9yZ290YCk7XG5cbiAgICAvLyBzdG9wIGhlcmUgaWYgZm9ybSBpcyBpbnZhbGlkXG4gICAgaWYgKHRoaXMuZm9yZ290Rm9ybS5pbnZhbGlkKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgb2JqIHRvIGhvbGQgZm9ybWRhdGFcbiAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuICAgIC8vIEFwcGVuZCBpbnB1dCB0byBmb3JtIGRhdGFcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3Bhc3N3b3JkJywgdGhpcy5mb3Jnb3RGb3JtLmdldCgnZW1haWwnKS52YWx1ZSk7XG4gICAgXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxufVxuIl19