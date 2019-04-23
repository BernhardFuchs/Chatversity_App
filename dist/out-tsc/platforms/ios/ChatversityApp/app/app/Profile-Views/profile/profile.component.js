"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("../../Core/_services/auth.service");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(_auth) {
        var _this = this;
        this._auth = _auth;
        this.name = '';
        this.bio = '';
        this.major = '';
        this.graduationYear = '';
        this.interests = '';
        this.clubs = '';
        this.subscription = this._auth.chatkitUser$.subscribe(function (user) {
            _this.chatkitUser = user;
            console.log('CHATKIT USER:', _this.chatkitUser);
            _this.initForm();
        });
    }
    ProfileComponent.prototype.ngOnInit = function () {
    };
    ProfileComponent.prototype.initForm = function () {
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
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css']
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC9hcHAvUHJvZmlsZS1WaWV3cy9wcm9maWxlL3Byb2ZpbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtEO0FBT2xELGtFQUFnRTtBQVloRTtJQWNFLDBCQUFxQixLQUFrQjtRQUF2QyxpQkFTQztRQVRvQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBUHZDLFNBQUksR0FBRyxFQUFFLENBQUM7UUFDVixRQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBSVQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ25ELFVBQUMsSUFBSTtZQUNILEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvQyxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsbUNBQVEsR0FBUjtJQUNBLENBQUM7SUFFRCxtQ0FBUSxHQUFSO1FBQ0UsSUFBSTtZQUNGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7U0FDbkM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQ2hCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1NBQzVDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztTQUNmO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztTQUNsRTtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7U0FDeEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFoRVUsZ0JBQWdCO1FBTjVCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBZ0I0QiwwQkFBVztPQWQ1QixnQkFBZ0IsQ0FpRTVCO0lBQUQsdUJBQUM7Q0FBQSxBQWpFRCxJQWlFQztBQWpFWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTmdGb3JtLCBGb3JtR3JvdXAsIEZvcm1CdWlsZGVyLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCwgTWF4TGVuZ3RoVmFsaWRhdG9yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZCc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hcHAuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXByb2ZpbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vcHJvZmlsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Byb2ZpbGUuY29tcG9uZW50LmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgUHJvZmlsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgdXNlcjogYW55O1xuICBjaGF0a2l0VXNlcjogYW55O1xuICBjb25uZWN0aW9uczogYW55O1xuICBzdWJzY3JpcHRpb246IGFueTtcblxuICBuYW1lID0gJyc7XG4gIGJpbyA9ICcnO1xuICBtYWpvciA9ICcnO1xuICBncmFkdWF0aW9uWWVhciA9ICcnO1xuICBpbnRlcmVzdHMgPSAnJztcbiAgY2x1YnMgPSAnJztcblxuICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBfYXV0aDogQXV0aFNlcnZpY2UgKSB7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuX2F1dGguY2hhdGtpdFVzZXIkLnN1YnNjcmliZShcbiAgICAgICh1c2VyKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhdGtpdFVzZXIgPSB1c2VyO1xuICAgICAgICBjb25zb2xlLmxvZygnQ0hBVEtJVCBVU0VSOicsIHRoaXMuY2hhdGtpdFVzZXIpO1xuICAgICAgICB0aGlzLmluaXRGb3JtKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgaW5pdEZvcm0oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMuY2hhdGtpdFVzZXIubmFtZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5uYW1lID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYmlvID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmJpbztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5iaW8gPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5tYWpvciA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5tYWpvcjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5tYWpvciA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmdyYWR1YXRpb25ZZWFyO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuaW50ZXJlc3RzID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmludGVyZXN0cztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5pbnRlcmVzdHMgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5jbHVicyA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5jbHVicztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5jbHVicyA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19