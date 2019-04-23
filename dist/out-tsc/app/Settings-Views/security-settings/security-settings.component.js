"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var form_validation_1 = require("../../Core/_models/form-validation");
var SecuritySettingsComponent = /** @class */ (function () {
    function SecuritySettingsComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.formValidation = new form_validation_1.CustomFormValidation;
        this.oldPassword = new forms_1.FormControl('');
    }
    SecuritySettingsComponent.prototype.onChanges = function () {
        var _this = this;
        this.changePassForm.valueChanges.subscribe(function (val) {
            if (val.oldPassword === val.newPassword) {
                _this.samePassword = true;
            }
            else {
                _this.samePassword = false;
            }
            if (val.newPassword === val.confirmPassword) {
                _this.passwordsMatch = true;
            }
            else {
                _this.passwordsMatch = false;
            }
        });
    };
    SecuritySettingsComponent.prototype.onSubmit = function () {
        if (this.changePassForm.invalid) {
            return;
        }
        console.log("hi");
    };
    SecuritySettingsComponent.prototype.ngOnInit = function () {
        this.changePassForm = this.formBuilder.group({
            oldPassword: new forms_1.FormControl([''], forms_1.Validators.required),
            newPassword: new forms_1.FormControl([''], forms_1.Validators.compose([
                forms_1.Validators.required, forms_1.Validators.pattern(this.formValidation.passwordValidation)
            ])),
            confirmPassword: new forms_1.FormControl([''], forms_1.Validators.required),
        });
        this.onChanges();
    };
    SecuritySettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-security-settings',
            templateUrl: './security-settings.component.html',
            styleUrls: ['./security-settings.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], SecuritySettingsComponent);
    return SecuritySettingsComponent;
}());
exports.SecuritySettingsComponent = SecuritySettingsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHktc2V0dGluZ3MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9TZXR0aW5ncy1WaWV3cy9zZWN1cml0eS1zZXR0aW5ncy9zZWN1cml0eS1zZXR0aW5ncy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsd0NBQWlGO0FBQ2pGLHNFQUEwRTtBQVExRTtJQU9FLG1DQUFvQixXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUw1QyxtQkFBYyxHQUFHLElBQUksc0NBQW9CLENBQUM7UUFDMUMsZ0JBQVcsR0FBRyxJQUFJLG1CQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7SUFJZSxDQUFDO0lBRWpELDZDQUFTLEdBQVQ7UUFBQSxpQkFnQkQ7UUFmRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO1lBRTVDLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUMsV0FBVyxFQUFFO2dCQUN2QyxLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTthQUN6QjtpQkFDSTtnQkFDSCxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQTthQUMxQjtZQUVELElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxHQUFHLENBQUMsZUFBZSxFQUFFO2dCQUMzQyxLQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQTthQUMzQjtpQkFBTTtnQkFDTCxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQTthQUM1QjtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVDLDRDQUFRLEdBQVI7UUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1lBQy9CLE9BQU87U0FDUjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbkIsQ0FBQztJQUNELDRDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQzNDLFdBQVcsRUFBRSxJQUFJLG1CQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztZQUN2RCxXQUFXLEVBQUUsSUFBSSxtQkFBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsa0JBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BELGtCQUFVLENBQUMsUUFBUSxFQUFFLGtCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7YUFDaEYsQ0FBQyxDQUFDO1lBQ0gsZUFBZSxFQUFFLElBQUksbUJBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGtCQUFVLENBQUMsUUFBUSxDQUFDO1NBQzVELENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUNsQixDQUFDO0lBM0NVLHlCQUF5QjtRQUxyQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxXQUFXLEVBQUUsb0NBQW9DO1lBQ2pELFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO1NBQ2pELENBQUM7eUNBUWlDLG1CQUFXO09BUGpDLHlCQUF5QixDQTZDckM7SUFBRCxnQ0FBQztDQUFBLEFBN0NELElBNkNDO0FBN0NZLDhEQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEN1c3RvbUZvcm1WYWxpZGF0aW9uIH0gZnJvbSAnLi4vLi4vQ29yZS9fbW9kZWxzL2Zvcm0tdmFsaWRhdGlvbic7XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXNlY3VyaXR5LXNldHRpbmdzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NlY3VyaXR5LXNldHRpbmdzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2VjdXJpdHktc2V0dGluZ3MuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNlY3VyaXR5U2V0dGluZ3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGZvcm1WYWxpZGF0aW9uID0gbmV3IEN1c3RvbUZvcm1WYWxpZGF0aW9uO1xuICBvbGRQYXNzd29yZCA9IG5ldyBGb3JtQ29udHJvbCgnJylcbiAgY2hhbmdlUGFzc0Zvcm06IEZvcm1Hcm91cDtcbiAgc2FtZVBhc3N3b3JkOiBib29sZWFuO1xuICBwYXNzd29yZHNNYXRjaDogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLmNoYW5nZVBhc3NGb3JtLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUodmFsID0+IHtcblxuICAgICAgaWYgKHZhbC5vbGRQYXNzd29yZCA9PT0gdmFsLm5ld1Bhc3N3b3JkKSB7XG4gICAgICAgIHRoaXMuc2FtZVBhc3N3b3JkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc2FtZVBhc3N3b3JkID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbC5uZXdQYXNzd29yZCA9PT0gdmFsLmNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgICB0aGlzLnBhc3N3b3Jkc01hdGNoID0gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYXNzd29yZHNNYXRjaCA9IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbn1cblxuICBvblN1Ym1pdCgpe1xuICAgIGlmICh0aGlzLmNoYW5nZVBhc3NGb3JtLmludmFsaWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJoaVwiKVxuICB9XG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY2hhbmdlUGFzc0Zvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIG9sZFBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woWycnXSwgVmFsaWRhdG9ycy5yZXF1aXJlZCksXG4gICAgICBuZXdQYXNzd29yZDogbmV3IEZvcm1Db250cm9sKFsnJ10sIFZhbGlkYXRvcnMuY29tcG9zZShbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRvcnMucGF0dGVybih0aGlzLmZvcm1WYWxpZGF0aW9uLnBhc3N3b3JkVmFsaWRhdGlvbilcbiAgICAgIF0pKSxcbiAgICAgIGNvbmZpcm1QYXNzd29yZDogbmV3IEZvcm1Db250cm9sKFsnJ10sIFZhbGlkYXRvcnMucmVxdWlyZWQpLFxuICAgIH0pXG5cbiAgICB0aGlzLm9uQ2hhbmdlcygpXG4gIH1cblxufVxuIl19