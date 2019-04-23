"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../../Core/_services/auth.service");
var user_service_1 = require("../../Core/_services/user.service");
var SettingsProfileComponent = /** @class */ (function () {
    function SettingsProfileComponent(formBuilder, _auth, userService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this._auth = _auth;
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
        this._auth.chatkitUser$.subscribe(function (user) {
            _this.chatkitUser = user;
            console.log('CHATKIT USER:', _this.chatkitUser);
            _this.initForm();
        });
    }
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
        var currentUserData = this.chatkitUser.customData;
        console.log('CHATKIT USER CUSTOM DATA: ', currentUserData);
        // Add update data
        currentUserData['name'] = _name;
        currentUserData['bio'] = _bio;
        currentUserData['major'] = _major;
        currentUserData['graduationYear'] = _gradYr;
        currentUserData['interests'] = _interests;
        currentUserData['clubs'] = _clubs;
        // Send the updated data and update the user
        this.userService.update(this.chatkitUser.id, JSON.stringify(currentUserData))
            .toPromise()
            .then(function (data) {
            console.log('RESPONSE:', data);
            console.log('UPDATED CHATKIT USER:', _this.chatkitUser);
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
        this.chatkitUser.customData.avatarURL = userData.avatar_url;
        this.chatkitUser.customData.customData = userData.custom_data;
        this.chatkitUser.name = userData.name;
        this.chatkitUser.updatedAt = userData.updated_at;
    };
    // Bring in chatkit user data
    SettingsProfileComponent.prototype.getUserProfile = function () {
        try {
            this.name = this.chatkitUser.name;
        }
        catch (error) {
            this.name = '';
        }
        try {
            this.bio = this.chatkitUser.customData.bio;
        }
        catch (error) {
            this.bio = '';
        }
        try {
            this.major = this.chatkitUser.customData.major;
        }
        catch (error) {
            this.major = '';
        }
        try {
            this.graduationYear = this.chatkitUser.customData.graduationYear;
        }
        catch (error) {
            this.graduationYear = '';
        }
        try {
            this.interests = this.chatkitUser.customData.interests;
        }
        catch (error) {
            this.interests = '';
        }
        try {
            this.clubs = this.chatkitUser.customData.clubs;
        }
        catch (error) {
            this.clubs = '';
        }
    };
    SettingsProfileComponent.prototype.ngOnInit = function () {
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC9hcHAvUHJvZmlsZS1WaWV3cy9zZXR0aW5ncy1wcm9maWxlL3NldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBQ2xELHdDQUE2RztBQUM3RyxrRUFBZ0U7QUFDaEUsa0VBQWdFO0FBT2hFO0lBaUJFLGtDQUNVLFdBQXdCLEVBQ3hCLEtBQWtCLEVBQ2xCLFdBQXdCO1FBSGxDLGlCQVdHO1FBVk8sZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQUNsQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQW5CbEMsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBT3BCLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixRQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBTVAsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUMvQixVQUFDLElBQUk7WUFDSCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0MsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUdILHNCQUFJLHVDQUFDO1FBREwsb0RBQW9EO2FB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bmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCwgTWF4TGVuZ3RoVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy91c2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2V0dGluZ3MtcHJvZmlsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNldHRpbmdzUHJvZmlsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgc3VibWl0dGVkID0gZmFsc2U7XG4gIGVkaXRpbmdGb3JtID0gZmFsc2U7XG5cbiAgcHJvZmlsZUZvcm06IEZvcm1Hcm91cDtcbiAgdXNlcjogYW55O1xuICBzdWJzY3JpcHRpb246IGFueTtcbiAgY2hhdGtpdFVzZXI6IGFueTtcblxuICBuYW1lID0gJyc7XG4gIGJpbyA9ICcnO1xuICBtYWpvciA9ICcnO1xuICBncmFkdWF0aW9uWWVhciA9ICcnO1xuICBpbnRlcmVzdHMgPSAnJztcbiAgY2x1YnMgPSAnJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSxcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSkge1xuICAgICAgdGhpcy5fYXV0aC5jaGF0a2l0VXNlciQuc3Vic2NyaWJlKFxuICAgICAgICAodXNlcikgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhdGtpdFVzZXIgPSB1c2VyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdDSEFUS0lUIFVTRVI6JywgdGhpcy5jaGF0a2l0VXNlcik7XG4gICAgICAgICAgdGhpcy5pbml0Rm9ybSgpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAvLyBDb252ZW5pZW5jZSBnZXR0ZXIgZm9yIGVhc3kgYWNjZXNzIHRvIGZvcm0gZmllbGRzXG4gIGdldCBmKCkgeyByZXR1cm4gdGhpcy5wcm9maWxlRm9ybS5jb250cm9sczsgfVxuXG4gIC8vIFZhbGlkYXRpb24gYW5kIG90aGVyIGFjdGlvbnMgdXBvbiBmb3JtIHN1Ym1pc3Npb25cbiAgb25TdWJtaXQoKSB7XG4gICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICAvLyBTdG9wIGhlcmUgaWYgZm9ybSBpcyBpbnZhbGlkXG4gICAgaWYgKHRoaXMucHJvZmlsZUZvcm0uaW52YWxpZCkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICBjb25zb2xlLmxvZygnRVJST1I6IEZvcm0gaW52YWxpZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEdldCB1cGRhdGVkIHByb2ZpbGUgZGF0YSBmcm9tIHVzZXJcbiAgICBjb25zdCBfbmFtZTogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ25hbWUnKS52YWx1ZTtcbiAgICBjb25zdCBfYmlvOiBzdHJpbmcgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnYmlvJykudmFsdWU7XG4gICAgY29uc3QgX21ham9yOiBzdHJpbmcgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnbWFqb3InKS52YWx1ZTtcbiAgICBjb25zdCBfZ3JhZFlyOiBudW1iZXIgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnZ3JhZHVhdGlvblllYXInKS52YWx1ZTtcbiAgICBjb25zdCBfaW50ZXJlc3RzOiBzdHJpbmcgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnaW50ZXJlc3RzJykudmFsdWU7XG4gICAgY29uc3QgX2NsdWJzOiBzdHJpbmcgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnY2x1YnMnKS52YWx1ZTtcblxuICAgIC8vIEdldCBjdXJyZW50IHVzZXIgY3VzdG9tIGRhdGFcbiAgICBjb25zdCBjdXJyZW50VXNlckRhdGEgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGE7XG4gICAgY29uc29sZS5sb2coJ0NIQVRLSVQgVVNFUiBDVVNUT00gREFUQTogJywgY3VycmVudFVzZXJEYXRhKTtcblxuICAgIC8vIEFkZCB1cGRhdGUgZGF0YVxuICAgIGN1cnJlbnRVc2VyRGF0YVsnbmFtZSddID0gX25hbWU7XG4gICAgY3VycmVudFVzZXJEYXRhWydiaW8nXSA9IF9iaW87XG4gICAgY3VycmVudFVzZXJEYXRhWydtYWpvciddID0gX21ham9yO1xuICAgIGN1cnJlbnRVc2VyRGF0YVsnZ3JhZHVhdGlvblllYXInXSA9IF9ncmFkWXI7XG4gICAgY3VycmVudFVzZXJEYXRhWydpbnRlcmVzdHMnXSA9IF9pbnRlcmVzdHM7XG4gICAgY3VycmVudFVzZXJEYXRhWydjbHVicyddID0gX2NsdWJzO1xuXG4gICAgLy8gU2VuZCB0aGUgdXBkYXRlZCBkYXRhIGFuZCB1cGRhdGUgdGhlIHVzZXJcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLnVwZGF0ZSh0aGlzLmNoYXRraXRVc2VyLmlkLCBKU09OLnN0cmluZ2lmeShjdXJyZW50VXNlckRhdGEpKVxuICAgIC50b1Byb21pc2UoKVxuICAgIC50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdSRVNQT05TRTonLCBkYXRhKTtcbiAgICAgIGNvbnNvbGUubG9nKCdVUERBVEVEIENIQVRLSVQgVVNFUjonLCB0aGlzLmNoYXRraXRVc2VyKTtcblxuICAgICAgdGhpcy5zZXRVc2VyUHJvZmlsZShkYXRhKTtcblxuICAgICAgdGhpcy5lZGl0aW5nRm9ybSA9IGZhbHNlO1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICAvLyBCdWlsZCBwcm9maWxlIGZvcm1cbiAgaW5pdEZvcm0oKSB7XG4gICAgdGhpcy5nZXRVc2VyUHJvZmlsZSgpO1xuXG4gICAgLy8gQnVpbGQgRm9ybVxuICAgIHRoaXMucHJvZmlsZUZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIC8vIE5hbWVcbiAgICAgIG5hbWU6IFsgdGhpcy5uYW1lLCBWYWxpZGF0b3JzLnJlcXVpcmVkIF0sXG4gICAgICAvLyBCaW9cbiAgICAgIGJpbzogWyB0aGlzLmJpbywgTWF4TGVuZ3RoVmFsaWRhdG9yIF0sXG4gICAgICAvLyBNYWpvclxuICAgICAgbWFqb3I6IFsgdGhpcy5tYWpvciwgTWF4TGVuZ3RoVmFsaWRhdG9yIF0sXG4gICAgICAvLyBHcmFkdWF0aW9uIHllYXJcbiAgICAgIGdyYWR1YXRpb25ZZWFyOiBbIHRoaXMuZ3JhZHVhdGlvblllYXIsIE1heExlbmd0aFZhbGlkYXRvciBdLFxuICAgICAgLy8gSW50ZXJlc3RzXG4gICAgICBpbnRlcmVzdHM6IFsgdGhpcy5pbnRlcmVzdHMsIE1heExlbmd0aFZhbGlkYXRvciBdLFxuICAgICAgICAvLyBDbHVic1xuICAgICAgY2x1YnM6IFsgdGhpcy5jbHVicywgTWF4TGVuZ3RoVmFsaWRhdG9yIF1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNldCB1cGRhdGVkIHByb2ZpbGUgZGF0YVxuICBzZXRVc2VyUHJvZmlsZSh1c2VyRGF0YSkge1xuICAgIHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5hdmF0YXJVUkwgPSB1c2VyRGF0YS5hdmF0YXJfdXJsO1xuICAgIHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5jdXN0b21EYXRhID0gdXNlckRhdGEuY3VzdG9tX2RhdGE7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5uYW1lID0gdXNlckRhdGEubmFtZTtcbiAgICB0aGlzLmNoYXRraXRVc2VyLnVwZGF0ZWRBdCA9IHVzZXJEYXRhLnVwZGF0ZWRfYXQ7XG4gIH1cblxuICAvLyBCcmluZyBpbiBjaGF0a2l0IHVzZXIgZGF0YVxuICBnZXRVc2VyUHJvZmlsZSgpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5uYW1lID0gdGhpcy5jaGF0a2l0VXNlci5uYW1lO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLm5hbWUgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5iaW8gPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuYmlvO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmJpbyA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLm1ham9yID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLm1ham9yO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLm1ham9yID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZ3JhZHVhdGlvblllYXIgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuZ3JhZHVhdGlvblllYXI7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZ3JhZHVhdGlvblllYXIgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5pbnRlcmVzdHMgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuaW50ZXJlc3RzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmludGVyZXN0cyA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmNsdWJzID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmNsdWJzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmNsdWJzID0gJyc7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cbn1cbiJdfQ==