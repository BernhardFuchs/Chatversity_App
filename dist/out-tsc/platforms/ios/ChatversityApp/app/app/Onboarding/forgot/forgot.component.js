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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZ290LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL2FwcC9PbmJvYXJkaW5nL2ZvcmdvdC9mb3Jnb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBS2xELHdDQUF5RjtBQUN6RiwwQ0FBeUQ7QUFHekQsc0VBQTBFO0FBTzFFO0lBUUUseUJBQ1UsV0FBd0IsRUFDeEIsS0FBcUIsRUFDckIsTUFBYztRQUZkLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3JCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFUeEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLGFBQVEsR0FBRyxpQkFBaUIsQ0FBQztRQUM3QixtQkFBYyxHQUF5QixJQUFJLHNDQUFvQixFQUFFLENBQUM7SUFLdEMsQ0FBQztJQUU3QixrQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUN2QyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBRSxrQkFBVSxDQUFDLFFBQVEsRUFBRSxrQkFBVSxDQUFDLEtBQUssRUFBRSxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFJLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxzQkFBSSw4QkFBQztRQURMLG9EQUFvRDthQUNwRCxjQUFVLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUU1QyxrQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFcEIsc0RBQXNEO1FBRXRELCtCQUErQjtRQUMvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLE9BQU87U0FDUjtRQUVELDhCQUE4QjtRQUM5QixJQUFNLFFBQVEsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBRTFDLDRCQUE0QjtRQUM1QixRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBM0NVLGVBQWU7UUFMM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsU0FBUyxFQUFFLENBQUMsd0JBQXdCLENBQUM7U0FDdEMsQ0FBQzt5Q0FVdUIsbUJBQVc7WUFDakIsdUJBQWM7WUFDYixlQUFNO09BWGIsZUFBZSxDQTZDM0I7SUFBRCxzQkFBQztDQUFBLEFBN0NELElBNkNDO0FBN0NZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXF1ZXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPa3RhQXV0aFNlcnZpY2UgfSBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3VzdG9tRm9ybVZhbGlkYXRpb24gfSBmcm9tICcuLi8uLi9Db3JlL19tb2RlbHMvZm9ybS12YWxpZGF0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWZvcmdvdCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9mb3Jnb3QuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9mb3Jnb3QuY29tcG9uZW50LmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBGb3Jnb3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBmb3Jnb3RGb3JtOiBGb3JtR3JvdXA7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgc3VibWl0dGVkID0gZmFsc2U7XG4gIHJldHVyblVybDogc3RyaW5nO1xuICBhcHBUaXRsZSA9ICdGb3Jnb3QgUGFzc3dvcmQnO1xuICBmb3JtVmFsaWRhdGlvbjogQ3VzdG9tRm9ybVZhbGlkYXRpb24gPSBuZXcgQ3VzdG9tRm9ybVZhbGlkYXRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmZvcmdvdEZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIGVtYWlsOiBbJycsIFZhbGlkYXRvcnMuY29tcG9zZShbIFZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMuZW1haWwsIFZhbGlkYXRvcnMucGF0dGVybih0aGlzLmZvcm1WYWxpZGF0aW9uLnJlZ3VsYXJFbWFpbFZhbGlkYXRpb24pXSldXG4gICAgfSk7XG5cbiAgICB0aGlzLnJldHVyblVybCA9ICcvJztcbiAgfVxuXG4gIC8vIENvbnZlbmllbmNlIGdldHRlciBmb3IgZWFzeSBhY2Nlc3MgdG8gZm9ybSBmaWVsZHNcbiAgZ2V0IGYoKSB7IHJldHVybiB0aGlzLmZvcmdvdEZvcm0uY29udHJvbHM7IH1cblxuICBvblN1Ym1pdCgpIHtcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIC8vIGh0dHAucG9zdChgJHtlbnZpcm9ubWVudC5hcGlVcmx9L3JlY292ZXJ5L2ZvcmdvdGApO1xuXG4gICAgLy8gc3RvcCBoZXJlIGlmIGZvcm0gaXMgaW52YWxpZFxuICAgIGlmICh0aGlzLmZvcmdvdEZvcm0uaW52YWxpZCkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIG9iaiB0byBob2xkIGZvcm1kYXRhXG4gICAgY29uc3QgZm9ybURhdGE6IEZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG5cbiAgICAvLyBBcHBlbmQgaW5wdXQgdG8gZm9ybSBkYXRhXG4gICAgZm9ybURhdGEuYXBwZW5kKCdwYXNzd29yZCcsIHRoaXMuZm9yZ290Rm9ybS5nZXQoJ2VtYWlsJykudmFsdWUpO1xuICAgIFxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==