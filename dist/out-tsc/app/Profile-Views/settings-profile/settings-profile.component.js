"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../../Core/_services/auth.service");
var user_service_1 = require("../../Core/_services/user.service");
var environment_prod_1 = require("../../../environments/environment.prod");
var SettingsProfileComponent = /** @class */ (function () {
    function SettingsProfileComponent(formBuilder, authService, userService) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.userService = userService;
        this.loading = false;
        this.submitted = false;
        this.editingForm = false;
        this.name = '';
        this.bio = '';
        this.major = '';
        this.graduationYear = '';
        this.interests = '';
        this.clubs = '';
        this.pondFiles = [];
    }
    SettingsProfileComponent.prototype.pondHandleInit = function () {
        console.log('FilePond has initialised', this.pond);
    };
    SettingsProfileComponent.prototype.pondHandleAddFile = function (event) {
        // event.preventDefault()
        console.log('A file was added');
        // removes the file at index 1
    };
    Object.defineProperty(SettingsProfileComponent.prototype, "f", {
        // Convenience getter for easy access to form fields
        get: function () { return this.profileForm.controls; },
        enumerable: true,
        configurable: true
    });
    // Validation and other actions upon form submission
    SettingsProfileComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.loading = true;
        // Stop here if form is invalid
        if (this.profileForm.invalid) {
            this.loading = false;
            console.log('ERROR: Form invalid');
            return;
        }
        // Get updated profile data from user
        var _name = this.profileForm.get('name').value;
        var _bio = this.profileForm.get('bio').value;
        var _major = this.profileForm.get('major').value;
        var _gradYr = this.profileForm.get('graduationYear').value;
        var _interests = this.profileForm.get('interests').value;
        var _clubs = this.profileForm.get('clubs').value;
        // Get current user custom data
        var currentUserData = this.currentUser.customData;
        console.log('CHATKIT USER CUSTOM DATA: ', currentUserData);
        if (!currentUserData.connections) {
            currentUserData['connections'] = [];
        }
        // Add update data
        currentUserData['name'] = _name;
        currentUserData['bio'] = _bio;
        currentUserData['major'] = _major;
        currentUserData['graduationYear'] = _gradYr;
        currentUserData['interests'] = _interests;
        currentUserData['clubs'] = _clubs;
        // Send the updated data and update the user
        this.userService.update(this.currentUser.id, JSON.stringify(currentUserData))
            .toPromise()
            .then(function (data) {
            console.log('RESPONSE:', data);
            console.log('UPDATED CHATKIT USER:', _this.currentUser);
            _this.setUserProfile(data);
            _this.editingForm = false;
            _this.loading = false;
        });
    };
    // Build profile form
    SettingsProfileComponent.prototype.initForm = function () {
        this.getUserProfile();
        // Build Form
        this.profileForm = this.formBuilder.group({
            // Name
            name: [this.name, forms_1.Validators.required],
            // Bio
            bio: [this.bio, forms_1.MaxLengthValidator],
            // Major
            major: [this.major, forms_1.MaxLengthValidator],
            // Graduation year
            graduationYear: [this.graduationYear, forms_1.MaxLengthValidator],
            // Interests
            interests: [this.interests, forms_1.MaxLengthValidator],
            // Clubs
            clubs: [this.clubs, forms_1.MaxLengthValidator]
        });
    };
    // Set updated profile data
    SettingsProfileComponent.prototype.setUserProfile = function (userData) {
        this.currentUser.customData.avatarURL = userData.avatar_url;
        this.currentUser.customData = userData.custom_data;
        this.currentUser.name = userData.name;
        this.currentUser.updatedAt = userData.updated_at;
    };
    // Bring in chatkit user data
    SettingsProfileComponent.prototype.getUserProfile = function () {
        try {
            this.name = this.currentUser.name;
        }
        catch (error) {
            this.name = '';
        }
        try {
            this.bio = this.currentUser.customData.bio;
        }
        catch (error) {
            this.bio = '';
        }
        try {
            this.major = this.currentUser.customData.major;
        }
        catch (error) {
            this.major = '';
        }
        try {
            this.graduationYear = this.currentUser.customData.graduationYear;
        }
        catch (error) {
            this.graduationYear = '';
        }
        try {
            this.interests = this.currentUser.customData.interests;
        }
        catch (error) {
            this.interests = '';
        }
        try {
            this.clubs = this.currentUser.customData.clubs;
        }
        catch (error) {
            this.clubs = '';
        }
    };
    SettingsProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currentUser = user;
            _this.initForm();
            _this.pondOptions = {
                instantUpload: false,
                class: 'my-filepond',
                multiple: true,
                labelIdle: 'Drop files here',
                acceptedFileTypes: 'image/jpeg, image/png',
                checkValidity: true,
                server: {
                    url: environment_prod_1.environment.apiUrl + "/",
                    process: "user/avatar/" + _this.currentUser.id,
                    revert: './revert.php',
                    restore: './restore.php?id=',
                    fetch: './fetch.php?data='
                }
            };
        });
    };
    __decorate([
        core_1.ViewChild('myPond'),
        __metadata("design:type", Object)
    ], SettingsProfileComponent.prototype, "pond", void 0);
    SettingsProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-settings-profile',
            templateUrl: './settings-profile.component.html',
            styleUrls: ['./settings-profile.component.scss']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            auth_service_1.AuthService,
            user_service_1.UserService])
    ], SettingsProfileComponent);
    return SettingsProfileComponent;
}());
exports.SettingsProfileComponent = SettingsProfileComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1Byb2ZpbGUtVmlld3Mvc2V0dGluZ3MtcHJvZmlsZS9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE0RDtBQUM1RCx3Q0FBeUg7QUFDekgsa0VBQStEO0FBQy9ELGtFQUErRDtBQUUvRCwyRUFBb0U7QUFPcEU7SUFtQ0Usa0NBQ1UsV0FBd0IsRUFDeEIsV0FBd0IsRUFDeEIsV0FBd0I7UUFGeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFyQ2xDLFlBQU8sR0FBRyxLQUFLLENBQUE7UUFDZixjQUFTLEdBQUcsS0FBSyxDQUFBO1FBQ2pCLGdCQUFXLEdBQUcsS0FBSyxDQUFBO1FBUW5CLFNBQUksR0FBRyxFQUFFLENBQUE7UUFDVCxRQUFHLEdBQUcsRUFBRSxDQUFBO1FBQ1IsVUFBSyxHQUFHLEVBQUUsQ0FBQTtRQUNWLG1CQUFjLEdBQUcsRUFBRSxDQUFBO1FBQ25CLGNBQVMsR0FBRyxFQUFFLENBQUE7UUFDZCxVQUFLLEdBQUcsRUFBRSxDQUFBO1FBSVYsY0FBUyxHQUFHLEVBQUUsQ0FBQTtJQWtCdUIsQ0FBQztJQWhCdEMsaURBQWMsR0FBZDtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFJRCxvREFBaUIsR0FBakIsVUFBa0IsS0FBVTtRQUMxQix5QkFBeUI7UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQy9CLDhCQUE4QjtJQUNoQyxDQUFDO0lBU0Qsc0JBQUksdUNBQUM7UUFETCxvREFBb0Q7YUFDcEQsY0FBVSxPQUFPLElB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O2dCQUNkLFNBQVMsRUFBRSxpQkFBaUI7Z0JBQzVCLGlCQUFpQixFQUFFLHVCQUF1QjtnQkFDMUMsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUssOEJBQVcsQ0FBQyxNQUFNLE1BQUc7b0JBQzdCLE9BQU8sRUFBRSxpQkFBZSxLQUFJLENBQUMsV0FBVyxDQUFDLEVBQUk7b0JBQzdDLE1BQU0sRUFBRSxjQUFjO29CQUN0QixPQUFPLEVBQUUsbUJBQW1CO29CQUM1QixLQUFLLEVBQUUsbUJBQW1CO2lCQUMzQjthQUNGLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFyS29CO1FBQXBCLGdCQUFTLENBQUMsUUFBUSxDQUFDOzswREFBVTtJQWxCbkIsd0JBQXdCO1FBTHBDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsc0JBQXNCO1lBQ2hDLFdBQVcsRUFBRSxtQ0FBbUM7WUFDaEQsU0FBUyxFQUFFLENBQUMsbUNBQW1DLENBQUM7U0FDakQsQ0FBQzt5Q0FxQ3VCLG1CQUFXO1lBQ1gsMEJBQVc7WUFDWCwwQkFBVztPQXRDdkIsd0JBQXdCLENBd0xwQztJQUFELCtCQUFDO0NBQUEsQUF4TEQsSUF3TEM7QUF4TFksNERBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sLCBGb3Jtc01vZHVsZSwgTWF4TGVuZ3RoVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSdcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJ1xuaW1wb3J0IHsgRmlsZVBvbmRNb2R1bGUgfSBmcm9tICdmaWxlcG9uZCdcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LnByb2QnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zZXR0aW5ncy1wcm9maWxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NQcm9maWxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgbG9hZGluZyA9IGZhbHNlXG4gIHN1Ym1pdHRlZCA9IGZhbHNlXG4gIGVkaXRpbmdGb3JtID0gZmFsc2VcblxuICBwcm9maWxlRm9ybTogRm9ybUdyb3VwXG4gIHVzZXI6IGFueVxuICBzdWJzY3JpcHRpb246IGFueVxuICBjdXJyZW50VXNlcjogYW55XG4gIHBvbmRPcHRpb25zOiBhbnk7XG5cbiAgbmFtZSA9ICcnXG4gIGJpbyA9ICcnXG4gIG1ham9yID0gJydcbiAgZ3JhZHVhdGlvblllYXIgPSAnJ1xuICBpbnRlcmVzdHMgPSAnJ1xuICBjbHVicyA9ICcnXG5cbiAgQFZpZXdDaGlsZCgnbXlQb25kJykgcG9uZDogYW55XG5cbiAgcG9uZEZpbGVzID0gW11cblxuICBwb25kSGFuZGxlSW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZygnRmlsZVBvbmQgaGFzIGluaXRpYWxpc2VkJywgdGhpcy5wb25kKVxuICB9XG5cblxuXG4gIHBvbmRIYW5kbGVBZGRGaWxlKGV2ZW50OiBhbnkpIHtcbiAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc29sZS5sb2coJ0EgZmlsZSB3YXMgYWRkZWQnKVxuICAgIC8vIHJlbW92ZXMgdGhlIGZpbGUgYXQgaW5kZXggMVxuICB9XG5cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSkge31cblxuICAvLyBDb252ZW5pZW5jZSBnZXR0ZXIgZm9yIGVhc3kgYWNjZXNzIHRvIGZvcm0gZmllbGRzXG4gIGdldCBmKCkgeyByZXR1cm4gdGhpcy5wcm9maWxlRm9ybS5jb250cm9scyB9XG5cbiAgLy8gVmFsaWRhdGlvbiBhbmQgb3RoZXIgYWN0aW9ucyB1cG9uIGZvcm0gc3VibWlzc2lvblxuICBvblN1Ym1pdCgpIHtcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWVcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG5cbiAgICAvLyBTdG9wIGhlcmUgaWYgZm9ybSBpcyBpbnZhbGlkXG4gICAgaWYgKHRoaXMucHJvZmlsZUZvcm0uaW52YWxpZCkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjogRm9ybSBpbnZhbGlkJylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIEdldCB1cGRhdGVkIHByb2ZpbGUgZGF0YSBmcm9tIHVzZXJcbiAgICBjb25zdCBfbmFtZTogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ25hbWUnKS52YWx1ZVxuICAgIGNvbnN0IF9iaW86IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdiaW8nKS52YWx1ZVxuICAgIGNvbnN0IF9tYWpvcjogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ21ham9yJykudmFsdWVcbiAgICBjb25zdCBfZ3JhZFlyOiBudW1iZXIgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnZ3JhZHVhdGlvblllYXInKS52YWx1ZVxuICAgIGNvbnN0IF9pbnRlcmVzdHM6IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdpbnRlcmVzdHMnKS52YWx1ZVxuICAgIGNvbnN0IF9jbHViczogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ2NsdWJzJykudmFsdWVcblxuICAgIC8vIEdldCBjdXJyZW50IHVzZXIgY3VzdG9tIGRhdGFcbiAgICBjb25zdCBjdXJyZW50VXNlckRhdGEgPSB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGFcbiAgICBjb25zb2xlLmxvZygnQ0hBVEtJVCBVU0VSIENVU1RPTSBEQVRBOiAnLCBjdXJyZW50VXNlckRhdGEpXG5cbiAgICBpZiAoIWN1cnJlbnRVc2VyRGF0YS5jb25uZWN0aW9ucykge1xuICAgICAgY3VycmVudFVzZXJEYXRhWydjb25uZWN0aW9ucyddID0gW11cbiAgICB9XG5cbiAgICAvLyBBZGQgdXBkYXRlIGRhdGFcbiAgICBjdXJyZW50VXNlckRhdGFbJ25hbWUnXSA9IF9uYW1lXG4gICAgY3VycmVudFVzZXJEYXRhWydiaW8nXSA9IF9iaW9cbiAgICBjdXJyZW50VXNlckRhdGFbJ21ham9yJ10gPSBfbWFqb3JcbiAgICBjdXJyZW50VXNlckRhdGFbJ2dyYWR1YXRpb25ZZWFyJ10gPSBfZ3JhZFlyXG4gICAgY3VycmVudFVzZXJEYXRhWydpbnRlcmVzdHMnXSA9IF9pbnRlcmVzdHNcbiAgICBjdXJyZW50VXNlckRhdGFbJ2NsdWJzJ10gPSBfY2x1YnNcblxuICAgIC8vIFNlbmQgdGhlIHVwZGF0ZWQgZGF0YSBhbmQgdXBkYXRlIHRoZSB1c2VyXG4gICAgdGhpcy51c2VyU2VydmljZS51cGRhdGUodGhpcy5jdXJyZW50VXNlci5pZCwgSlNPTi5zdHJpbmdpZnkoY3VycmVudFVzZXJEYXRhKSlcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0U6JywgZGF0YSlcbiAgICAgIGNvbnNvbGUubG9nKCdVUERBVEVEIENIQVRLSVQgVVNFUjonLCB0aGlzLmN1cnJlbnRVc2VyKVxuXG4gICAgICB0aGlzLnNldFVzZXJQcm9maWxlKGRhdGEpXG5cbiAgICAgIHRoaXMuZWRpdGluZ0Zvcm0gPSBmYWxzZVxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgLy8gQnVpbGQgcHJvZmlsZSBmb3JtXG4gIGluaXRGb3JtKCkge1xuICAgIHRoaXMuZ2V0VXNlclByb2ZpbGUoKVxuXG4gICAgLy8gQnVpbGQgRm9ybVxuICAgIHRoaXMucHJvZmlsZUZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIC8vIE5hbWVcbiAgICAgIG5hbWU6IFsgdGhpcy5uYW1lLCBWYWxpZGF0b3JzLnJlcXVpcmVkIF0sXG4gICAgICAvLyBCaW9cbiAgICAgIGJpbzogWyB0aGlzLmJpbywgTWF4TGVuZ3RoVmFsaWRhdG9yIF0sXG4gICAgICAvLyBNYWpvclxuICAgICAgbWFqb3I6IFsgdGhpcy5tYWpvciwgTWF4TGVuZ3RoVmFsaWRhdG9yIF0sXG4gICAgICAvLyBHcmFkdWF0aW9uIHllYXJcbiAgICAgIGdyYWR1YXRpb25ZZWFyOiBbIHRoaXMuZ3JhZHVhdGlvblllYXIsIE1heExlbmd0aFZhbGlkYXRvciBdLFxuICAgICAgLy8gSW50ZXJlc3RzXG4gICAgICBpbnRlcmVzdHM6IFsgdGhpcy5pbnRlcmVzdHMsIE1heExlbmd0aFZhbGlkYXRvciBdLFxuICAgICAgICAvLyBDbHVic1xuICAgICAgY2x1YnM6IFsgdGhpcy5jbHVicywgTWF4TGVuZ3RoVmFsaWRhdG9yIF1cbiAgICB9KVxuICB9XG5cbiAgLy8gU2V0IHVwZGF0ZWQgcHJvZmlsZSBkYXRhXG4gIHNldFVzZXJQcm9maWxlKHVzZXJEYXRhKSB7XG4gICAgdGhpcy5jdXJyZW50VXNlci5jdXN0b21EYXRhLmF2YXRhclVSTCA9IHVzZXJEYXRhLmF2YXRhcl91cmxcbiAgICB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGEgPSB1c2VyRGF0YS5jdXN0b21fZGF0YVxuICAgIHRoaXMuY3VycmVudFVzZXIubmFtZSA9IHVzZXJEYXRhLm5hbWVcbiAgICB0aGlzLmN1cnJlbnRVc2VyLnVwZGF0ZWRBdCA9IHVzZXJEYXRhLnVwZGF0ZWRfYXRcbiAgfVxuXG4gIC8vIEJyaW5nIGluIGNoYXRraXQgdXNlciBkYXRhXG4gIGdldFVzZXJQcm9maWxlKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLmN1cnJlbnRVc2VyLm5hbWVcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5uYW1lID0gJydcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5iaW8gPSB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGEuYmlvXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuYmlvID0gJydcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5tYWpvciA9IHRoaXMuY3VycmVudFVzZXIuY3VzdG9tRGF0YS5tYWpvclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLm1ham9yID0gJydcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9IHRoaXMuY3VycmVudFVzZXIuY3VzdG9tRGF0YS5ncmFkdWF0aW9uWWVhclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gJydcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5pbnRlcmVzdHMgPSB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGEuaW50ZXJlc3RzXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuaW50ZXJlc3RzID0gJydcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5jbHVicyA9IHRoaXMuY3VycmVudFVzZXIuY3VzdG9tRGF0YS5jbHVic1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmNsdWJzID0gJydcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcblxuICAgIHRoaXMuYXV0aFNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKS5zdWJzY3JpYmUoKHVzZXIpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICB0aGlzLmluaXRGb3JtKClcbiAgICAgIHRoaXMucG9uZE9wdGlvbnMgPSB7XG4gICAgICAgIGluc3RhbnRVcGxvYWQ6IGZhbHNlLFxuICAgICAgICBjbGFzczogJ215LWZpbGVwb25kJyxcbiAgICAgICAgbXVsdGlwbGU6IHRydWUsXG4gICAgICAgIGxhYmVsSWRsZTogJ0Ryb3AgZmlsZXMgaGVyZScsXG4gICAgICAgIGFjY2VwdGVkRmlsZVR5cGVzOiAnaW1hZ2UvanBlZywgaW1hZ2UvcG5nJyxcbiAgICAgICAgY2hlY2tWYWxpZGl0eTogdHJ1ZSxcbiAgICAgICAgc2VydmVyOiB7XG4gICAgICAgICAgdXJsOiBgJHtlbnZpcm9ubWVudC5hcGlVcmx9L2AsXG4gICAgICAgICAgcHJvY2VzczogYHVzZXIvYXZhdGFyLyR7dGhpcy5jdXJyZW50VXNlci5pZH1gLFxuICAgICAgICAgIHJldmVydDogJy4vcmV2ZXJ0LnBocCcsXG4gICAgICAgICAgcmVzdG9yZTogJy4vcmVzdG9yZS5waHA/aWQ9JyxcbiAgICAgICAgICBmZXRjaDogJy4vZmV0Y2gucGhwP2RhdGE9J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19