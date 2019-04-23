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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL2FwcC9Qcm9maWxlLVZpZXdzL3Byb2ZpbGUvcHJvZmlsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBa0Q7QUFPbEQsa0VBQWdFO0FBWWhFO0lBY0UsMEJBQXFCLEtBQWtCO1FBQXZDLGlCQVNDO1FBVG9CLFVBQUssR0FBTCxLQUFLLENBQWE7UUFQdkMsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFFBQUcsR0FBRyxFQUFFLENBQUM7UUFDVCxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLFVBQUssR0FBRyxFQUFFLENBQUM7UUFJVCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FDbkQsVUFBQyxJQUFJO1lBQ0gsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxtQ0FBUSxHQUFSO0lBQ0EsQ0FBQztJQUVELG1DQUFRLEdBQVI7UUFDRSxJQUFJO1lBQ0YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztTQUNuQztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7U0FDaEI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7U0FDNUM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7U0FDaEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQ2pCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO1NBQ2xFO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztTQUMxQjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztTQUN4RDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDckI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7U0FDaEQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQWhFVSxnQkFBZ0I7UUFONUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsU0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7U0FDdkMsQ0FBQzt5Q0FnQjRCLDBCQUFXO09BZDVCLGdCQUFnQixDQWlFNUI7SUFBRCx1QkFBQztDQUFBLEFBakVELElBaUVDO0FBakVZLDRDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sLCBNYXhMZW5ndGhWYWxpZGF0b3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uLy4uLy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FwcC5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtcHJvZmlsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9wcm9maWxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcHJvZmlsZS5jb21wb25lbnQuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBQcm9maWxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICB1c2VyOiBhbnk7XG4gIGNoYXRraXRVc2VyOiBhbnk7XG4gIGNvbm5lY3Rpb25zOiBhbnk7XG4gIHN1YnNjcmlwdGlvbjogYW55O1xuXG4gIG5hbWUgPSAnJztcbiAgYmlvID0gJyc7XG4gIG1ham9yID0gJyc7XG4gIGdyYWR1YXRpb25ZZWFyID0gJyc7XG4gIGludGVyZXN0cyA9ICcnO1xuICBjbHVicyA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKCBwcml2YXRlIF9hdXRoOiBBdXRoU2VydmljZSApIHtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5fYXV0aC5jaGF0a2l0VXNlciQuc3Vic2NyaWJlKFxuICAgICAgKHVzZXIpID0+IHtcbiAgICAgICAgdGhpcy5jaGF0a2l0VXNlciA9IHVzZXI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDSEFUS0lUIFVTRVI6JywgdGhpcy5jaGF0a2l0VXNlcik7XG4gICAgICAgIHRoaXMuaW5pdEZvcm0oKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxuICBpbml0Rm9ybSgpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5uYW1lID0gdGhpcy5jaGF0a2l0VXNlci5uYW1lO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLm5hbWUgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5iaW8gPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuYmlvO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmJpbyA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLm1ham9yID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLm1ham9yO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLm1ham9yID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZ3JhZHVhdGlvblllYXIgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuZ3JhZHVhdGlvblllYXI7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZ3JhZHVhdGlvblllYXIgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5pbnRlcmVzdHMgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuaW50ZXJlc3RzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmludGVyZXN0cyA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmNsdWJzID0gdGhpcy5jaGF0a2l0VXNlci5jdXN0b21EYXRhLmNsdWJzO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmNsdWJzID0gJyc7XG4gICAgfVxuICB9XG59XG4iXX0=