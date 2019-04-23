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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1Byb2ZpbGUtVmlld3Mvc2V0dGluZ3MtcHJvZmlsZS9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQUNsRCx3Q0FBNkc7QUFDN0csa0VBQWdFO0FBQ2hFLGtFQUFnRTtBQU9oRTtJQWlCRSxrQ0FDVSxXQUF3QixFQUN4QixLQUFrQixFQUNsQixXQUF3QjtRQUhsQyxpQkFXRztRQVZPLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWE7UUFDbEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFuQmxDLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQU9wQixTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsUUFBRyxHQUFHLEVBQUUsQ0FBQztRQUNULFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxtQkFBYyxHQUFHLEVBQUUsQ0FBQztRQUNwQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQU1QLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FDL0IsVUFBQyxJQUFJO1lBQ0gsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFHSCxzQkFBSSx1Q0FBQztRQURMLG9EQUFvRDthQUNwRCxjQUFVLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENB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Q0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztTQUNsRTtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7U0FDeEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCwyQ0FBUSxHQUFSO0lBQ0EsQ0FBQztJQXJKVSx3QkFBd0I7UUFMcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxzQkFBc0I7WUFDaEMsV0FBVyxFQUFFLG1DQUFtQztZQUNoRCxTQUFTLEVBQUUsQ0FBQyxtQ0FBbUMsQ0FBQztTQUNqRCxDQUFDO3lDQW1CdUIsbUJBQVc7WUFDakIsMEJBQVc7WUFDTCwwQkFBVztPQXBCdkIsd0JBQXdCLENBc0pwQztJQUFELCtCQUFDO0NBQUEsQUF0SkQsSUFzSkM7QUF0SlksNERBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nRm9ybSwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2wsIE1heExlbmd0aFZhbGlkYXRvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXNldHRpbmdzLXByb2ZpbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vc2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1Byb2ZpbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIHN1Ym1pdHRlZCA9IGZhbHNlO1xuICBlZGl0aW5nRm9ybSA9IGZhbHNlO1xuXG4gIHByb2ZpbGVGb3JtOiBGb3JtR3JvdXA7XG4gIHVzZXI6IGFueTtcbiAgc3Vic2NyaXB0aW9uOiBhbnk7XG4gIGNoYXRraXRVc2VyOiBhbnk7XG5cbiAgbmFtZSA9ICcnO1xuICBiaW8gPSAnJztcbiAgbWFqb3IgPSAnJztcbiAgZ3JhZHVhdGlvblllYXIgPSAnJztcbiAgaW50ZXJlc3RzID0gJyc7XG4gIGNsdWJzID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXG4gICAgcHJpdmF0ZSBfYXV0aDogQXV0aFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UpIHtcbiAgICAgIHRoaXMuX2F1dGguY2hhdGtpdFVzZXIkLnN1YnNjcmliZShcbiAgICAgICAgKHVzZXIpID0+IHtcbiAgICAgICAgICB0aGlzLmNoYXRraXRVc2VyID0gdXNlcjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQ0hBVEtJVCBVU0VSOicsIHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgLy8gQ29udmVuaWVuY2UgZ2V0dGVyIGZvciBlYXN5IGFjY2VzcyB0byBmb3JtIGZpZWxkc1xuICBnZXQgZigpIHsgcmV0dXJuIHRoaXMucHJvZmlsZUZvcm0uY29udHJvbHM7IH1cblxuICAvLyBWYWxpZGF0aW9uIGFuZCBvdGhlciBhY3Rpb25zIHVwb24gZm9ybSBzdWJtaXNzaW9uXG4gIG9uU3VibWl0KCkge1xuICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgLy8gU3RvcCBoZXJlIGlmIGZvcm0gaXMgaW52YWxpZFxuICAgIGlmICh0aGlzLnByb2ZpbGVGb3JtLmludmFsaWQpIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgY29uc29sZS5sb2coJ0VSUk9SOiBGb3JtIGludmFsaWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHZXQgdXBkYXRlZCBwcm9maWxlIGRhdGEgZnJvbSB1c2VyXG4gICAgY29uc3QgX25hbWU6IHN0cmluZyA9IHRoaXMucHJvZmlsZUZvcm0uZ2V0KCduYW1lJykudmFsdWU7XG4gICAgY29uc3QgX2Jpbzogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ2JpbycpLnZhbHVlO1xuICAgIGNvbnN0IF9tYWpvcjogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ21ham9yJykudmFsdWU7XG4gICAgY29uc3QgX2dyYWRZcjogbnVtYmVyID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ2dyYWR1YXRpb25ZZWFyJykudmFsdWU7XG4gICAgY29uc3QgX2ludGVyZXN0czogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ2ludGVyZXN0cycpLnZhbHVlO1xuICAgIGNvbnN0IF9jbHViczogc3RyaW5nID0gdGhpcy5wcm9maWxlRm9ybS5nZXQoJ2NsdWJzJykudmFsdWU7XG5cbiAgICAvLyBHZXQgY3VycmVudCB1c2VyIGN1c3RvbSBkYXRhXG4gICAgY29uc3QgY3VycmVudFVzZXJEYXRhID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhO1xuICAgIGNvbnNvbGUubG9nKCdDSEFUS0lUIFVTRVIgQ1VTVE9NIERBVEE6ICcsIGN1cnJlbnRVc2VyRGF0YSk7XG5cbiAgICAvLyBBZGQgdXBkYXRlIGRhdGFcbiAgICBjdXJyZW50VXNlckRhdGFbJ25hbWUnXSA9IF9uYW1lO1xuICAgIGN1cnJlbnRVc2VyRGF0YVsnYmlvJ10gPSBfYmlvO1xuICAgIGN1cnJlbnRVc2VyRGF0YVsnbWFqb3InXSA9IF9tYWpvcjtcbiAgICBjdXJyZW50VXNlckRhdGFbJ2dyYWR1YXRpb25ZZWFyJ10gPSBfZ3JhZFlyO1xuICAgIGN1cnJlbnRVc2VyRGF0YVsnaW50ZXJlc3RzJ10gPSBfaW50ZXJlc3RzO1xuICAgIGN1cnJlbnRVc2VyRGF0YVsnY2x1YnMnXSA9IF9jbHVicztcblxuICAgIC8vIFNlbmQgdGhlIHVwZGF0ZWQgZGF0YSBhbmQgdXBkYXRlIHRoZSB1c2VyXG4gICAgdGhpcy51c2VyU2VydmljZS51cGRhdGUodGhpcy5jaGF0a2l0VXNlci5pZCwgSlNPTi5zdHJpbmdpZnkoY3VycmVudFVzZXJEYXRhKSlcbiAgICAudG9Qcm9taXNlKClcbiAgICAudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0U6JywgZGF0YSk7XG4gICAgICBjb25zb2xlLmxvZygnVVBEQVRFRCBDSEFUS0lUIFVTRVI6JywgdGhpcy5jaGF0a2l0VXNlcik7XG5cbiAgICAgIHRoaXMuc2V0VXNlclByb2ZpbGUoZGF0YSk7XG5cbiAgICAgIHRoaXMuZWRpdGluZ0Zvcm0gPSBmYWxzZTtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQnVpbGQgcHJvZmlsZSBmb3JtXG4gIGluaXRGb3JtKCkge1xuICAgIHRoaXMuZ2V0VXNlclByb2ZpbGUoKTtcblxuICAgIC8vIEJ1aWxkIEZvcm1cbiAgICB0aGlzLnByb2ZpbGVGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICAvLyBOYW1lXG4gICAgICBuYW1lOiBbIHRoaXMubmFtZSwgVmFsaWRhdG9ycy5yZXF1aXJlZCBdLFxuICAgICAgLy8gQmlvXG4gICAgICBiaW86IFsgdGhpcy5iaW8sIE1heExlbmd0aFZhbGlkYXRvciBdLFxuICAgICAgLy8gTWFqb3JcbiAgICAgIG1ham9yOiBbIHRoaXMubWFqb3IsIE1heExlbmd0aFZhbGlkYXRvciBdLFxuICAgICAgLy8gR3JhZHVhdGlvbiB5ZWFyXG4gICAgICBncmFkdWF0aW9uWWVhcjogWyB0aGlzLmdyYWR1YXRpb25ZZWFyLCBNYXhMZW5ndGhWYWxpZGF0b3IgXSxcbiAgICAgIC8vIEludGVyZXN0c1xuICAgICAgaW50ZXJlc3RzOiBbIHRoaXMuaW50ZXJlc3RzLCBNYXhMZW5ndGhWYWxpZGF0b3IgXSxcbiAgICAgICAgLy8gQ2x1YnNcbiAgICAgIGNsdWJzOiBbIHRoaXMuY2x1YnMsIE1heExlbmd0aFZhbGlkYXRvciBdXG4gICAgfSk7XG4gIH1cblxuICAvLyBTZXQgdXBkYXRlZCBwcm9maWxlIGRhdGFcbiAgc2V0VXNlclByb2ZpbGUodXNlckRhdGEpIHtcbiAgICB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuYXZhdGFyVVJMID0gdXNlckRhdGEuYXZhdGFyX3VybDtcbiAgICB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuY3VzdG9tRGF0YSA9IHVzZXJEYXRhLmN1c3RvbV9kYXRhO1xuICAgIHRoaXMuY2hhdGtpdFVzZXIubmFtZSA9IHVzZXJEYXRhLm5hbWU7XG4gICAgdGhpcy5jaGF0a2l0VXNlci51cGRhdGVkQXQgPSB1c2VyRGF0YS51cGRhdGVkX2F0O1xuICB9XG5cbiAgLy8gQnJpbmcgaW4gY2hhdGtpdCB1c2VyIGRhdGFcbiAgZ2V0VXNlclByb2ZpbGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMuY2hhdGtpdFVzZXIubmFtZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5uYW1lID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYmlvID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmJpbztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5iaW8gPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5tYWpvciA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5tYWpvcjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5tYWpvciA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmdyYWR1YXRpb25ZZWFyO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuaW50ZXJlc3RzID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmludGVyZXN0cztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5pbnRlcmVzdHMgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5jbHVicyA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5jbHVicztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5jbHVicyA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG59XG4iXX0=