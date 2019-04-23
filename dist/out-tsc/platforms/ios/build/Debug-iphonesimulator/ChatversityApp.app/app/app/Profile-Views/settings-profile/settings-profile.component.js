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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9Qcm9maWxlLVZpZXdzL3NldHRpbmdzLXByb2ZpbGUvc2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFDbEQsd0NBQTZHO0FBQzdHLGtFQUFnRTtBQUNoRSxrRUFBZ0U7QUFPaEU7SUFpQkUsa0NBQ1UsV0FBd0IsRUFDeEIsS0FBa0IsRUFDbEIsV0FBd0I7UUFIbEMsaUJBV0c7UUFWTyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ2xCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBbkJsQyxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFPcEIsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFFBQUcsR0FBRyxFQUFFLENBQUM7UUFDVCxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLFVBQUssR0FBRyxFQUFFLENBQUM7UUFNUCxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQy9CLFVBQUMsSUFBSTtZQUNILEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvQyxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUNGLENBQUM7SUFD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ImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sLCBNYXhMZW5ndGhWYWxpZGF0b3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zZXR0aW5ncy1wcm9maWxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NQcm9maWxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBzdWJtaXR0ZWQgPSBmYWxzZTtcbiAgZWRpdGluZ0Zvcm0gPSBmYWxzZTtcblxuICBwcm9maWxlRm9ybTogRm9ybUdyb3VwO1xuICB1c2VyOiBhbnk7XG4gIHN1YnNjcmlwdGlvbjogYW55O1xuICBjaGF0a2l0VXNlcjogYW55O1xuXG4gIG5hbWUgPSAnJztcbiAgYmlvID0gJyc7XG4gIG1ham9yID0gJyc7XG4gIGdyYWR1YXRpb25ZZWFyID0gJyc7XG4gIGludGVyZXN0cyA9ICcnO1xuICBjbHVicyA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlLFxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlKSB7XG4gICAgICB0aGlzLl9hdXRoLmNoYXRraXRVc2VyJC5zdWJzY3JpYmUoXG4gICAgICAgICh1c2VyKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGF0a2l0VXNlciA9IHVzZXI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0NIQVRLSVQgVVNFUjonLCB0aGlzLmNoYXRraXRVc2VyKTtcbiAgICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gIC8vIENvbnZlbmllbmNlIGdldHRlciBmb3IgZWFzeSBhY2Nlc3MgdG8gZm9ybSBmaWVsZHNcbiAgZ2V0IGYoKSB7IHJldHVybiB0aGlzLnByb2ZpbGVGb3JtLmNvbnRyb2xzOyB9XG5cbiAgLy8gVmFsaWRhdGlvbiBhbmQgb3RoZXIgYWN0aW9ucyB1cG9uIGZvcm0gc3VibWlzc2lvblxuICBvblN1Ym1pdCgpIHtcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIC8vIFN0b3AgaGVyZSBpZiBmb3JtIGlzIGludmFsaWRcbiAgICBpZiAodGhpcy5wcm9maWxlRm9ybS5pbnZhbGlkKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIGNvbnNvbGUubG9nKCdFUlJPUjogRm9ybSBpbnZhbGlkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gR2V0IHVwZGF0ZWQgcHJvZmlsZSBkYXRhIGZyb20gdXNlclxuICAgIGNvbnN0IF9uYW1lOiBzdHJpbmcgPSB0aGlzLnByb2ZpbGVGb3JtLmdldCgnbmFtZScpLnZhbHVlO1xuICAgIGNvbnN0IF9iaW86IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdiaW8nKS52YWx1ZTtcbiAgICBjb25zdCBfbWFqb3I6IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdtYWpvcicpLnZhbHVlO1xuICAgIGNvbnN0IF9ncmFkWXI6IG51bWJlciA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdncmFkdWF0aW9uWWVhcicpLnZhbHVlO1xuICAgIGNvbnN0IF9pbnRlcmVzdHM6IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdpbnRlcmVzdHMnKS52YWx1ZTtcbiAgICBjb25zdCBfY2x1YnM6IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCdjbHVicycpLnZhbHVlO1xuXG4gICAgLy8gR2V0IGN1cnJlbnQgdXNlciBjdXN0b20gZGF0YVxuICAgIGNvbnN0IGN1cnJlbnRVc2VyRGF0YSA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ0hBVEtJVCBVU0VSIENVU1RPTSBEQVRBOiAnLCBjdXJyZW50VXNlckRhdGEpO1xuXG4gICAgLy8gQWRkIHVwZGF0ZSBkYXRhXG4gICAgY3VycmVudFVzZXJEYXRhWyduYW1lJ10gPSBfbmFtZTtcbiAgICBjdXJyZW50VXNlckRhdGFbJ2JpbyddID0gX2JpbztcbiAgICBjdXJyZW50VXNlckRhdGFbJ21ham9yJ10gPSBfbWFqb3I7XG4gICAgY3VycmVudFVzZXJEYXRhWydncmFkdWF0aW9uWWVhciddID0gX2dyYWRZcjtcbiAgICBjdXJyZW50VXNlckRhdGFbJ2ludGVyZXN0cyddID0gX2ludGVyZXN0cztcbiAgICBjdXJyZW50VXNlckRhdGFbJ2NsdWJzJ10gPSBfY2x1YnM7XG5cbiAgICAvLyBTZW5kIHRoZSB1cGRhdGVkIGRhdGEgYW5kIHVwZGF0ZSB0aGUgdXNlclxuICAgIHRoaXMudXNlclNlcnZpY2UudXBkYXRlKHRoaXMuY2hhdGtpdFVzZXIuaWQsIEpTT04uc3RyaW5naWZ5KGN1cnJlbnRVc2VyRGF0YSkpXG4gICAgLnRvUHJvbWlzZSgpXG4gICAgLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgY29uc29sZS5sb2coJ1JFU1BPTlNFOicsIGRhdGEpO1xuICAgICAgY29uc29sZS5sb2coJ1VQREFURUQgQ0hBVEtJVCBVU0VSOicsIHRoaXMuY2hhdGtpdFVzZXIpO1xuXG4gICAgICB0aGlzLnNldFVzZXJQcm9maWxlKGRhdGEpO1xuXG4gICAgICB0aGlzLmVkaXRpbmdGb3JtID0gZmFsc2U7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEJ1aWxkIHByb2ZpbGUgZm9ybVxuICBpbml0Rm9ybSgpIHtcbiAgICB0aGlzLmdldFVzZXJQcm9maWxlKCk7XG5cbiAgICAvLyBCdWlsZCBGb3JtXG4gICAgdGhpcy5wcm9maWxlRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgLy8gTmFtZVxuICAgICAgbmFtZTogWyB0aGlzLm5hbWUsIFZhbGlkYXRvcnMucmVxdWlyZWQgXSxcbiAgICAgIC8vIEJpb1xuICAgICAgYmlvOiBbIHRoaXMuYmlvLCBNYXhMZW5ndGhWYWxpZGF0b3IgXSxcbiAgICAgIC8vIE1ham9yXG4gICAgICBtYWpvcjogWyB0aGlzLm1ham9yLCBNYXhMZW5ndGhWYWxpZGF0b3IgXSxcbiAgICAgIC8vIEdyYWR1YXRpb24geWVhclxuICAgICAgZ3JhZHVhdGlvblllYXI6IFsgdGhpcy5ncmFkdWF0aW9uWWVhciwgTWF4TGVuZ3RoVmFsaWRhdG9yIF0sXG4gICAgICAvLyBJbnRlcmVzdHNcbiAgICAgIGludGVyZXN0czogWyB0aGlzLmludGVyZXN0cywgTWF4TGVuZ3RoVmFsaWRhdG9yIF0sXG4gICAgICAgIC8vIENsdWJzXG4gICAgICBjbHViczogWyB0aGlzLmNsdWJzLCBNYXhMZW5ndGhWYWxpZGF0b3IgXVxuICAgIH0pO1xuICB9XG5cbiAgLy8gU2V0IHVwZGF0ZWQgcHJvZmlsZSBkYXRhXG4gIHNldFVzZXJQcm9maWxlKHVzZXJEYXRhKSB7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmF2YXRhclVSTCA9IHVzZXJEYXRhLmF2YXRhcl91cmw7XG4gICAgdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmN1c3RvbURhdGEgPSB1c2VyRGF0YS5jdXN0b21fZGF0YTtcbiAgICB0aGlzLmNoYXRraXRVc2VyLm5hbWUgPSB1c2VyRGF0YS5uYW1lO1xuICAgIHRoaXMuY2hhdGtpdFVzZXIudXBkYXRlZEF0ID0gdXNlckRhdGEudXBkYXRlZF9hdDtcbiAgfVxuXG4gIC8vIEJyaW5nIGluIGNoYXRraXQgdXNlciBkYXRhXG4gIGdldFVzZXJQcm9maWxlKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLmNoYXRraXRVc2VyLm5hbWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubmFtZSA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmJpbyA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5iaW87XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuYmlvID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubWFqb3IgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEubWFqb3I7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubWFqb3IgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5ncmFkdWF0aW9uWWVhcjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmludGVyZXN0cyA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5pbnRlcmVzdHM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuaW50ZXJlc3RzID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2x1YnMgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuY2x1YnM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuY2x1YnMgPSAnJztcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxufVxuIl19