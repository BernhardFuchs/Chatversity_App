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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1Byb2ZpbGUtVmlld3MvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFrRDtBQU9sRCxrRUFBZ0U7QUFZaEU7SUFjRSwwQkFBcUIsS0FBa0I7UUFBdkMsaUJBU0M7UUFUb0IsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQVB2QyxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsUUFBRyxHQUFHLEVBQUUsQ0FBQztRQUNULFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxtQkFBYyxHQUFHLEVBQUUsQ0FBQztRQUNwQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUlULElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUNuRCxVQUFDLElBQUk7WUFDSCxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0MsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELG1DQUFRLEdBQVI7SUFDQSxDQUFDO0lBRUQsbUNBQVEsR0FBUjtRQUNFLElBQUk7WUFDRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1NBQ25DO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztTQUNoQjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztTQUM1QztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7U0FDZjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNoRDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDakI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7U0FDbEU7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1NBQ3hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUNyQjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUNoRDtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBaEVVLGdCQUFnQjtRQU41QixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QyxDQUFDO3lDQWdCNEIsMEJBQVc7T0FkNUIsZ0JBQWdCLENBaUU1QjtJQUFELHVCQUFDO0NBQUEsQUFqRUQsSUFpRUM7QUFqRVksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE5nRm9ybSwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2wsIE1heExlbmd0aFZhbGlkYXRvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LnByb2QnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy91c2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYXBwLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1wcm9maWxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Byb2ZpbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wcm9maWxlLmNvbXBvbmVudC5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIFByb2ZpbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHVzZXI6IGFueTtcbiAgY2hhdGtpdFVzZXI6IGFueTtcbiAgY29ubmVjdGlvbnM6IGFueTtcbiAgc3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgbmFtZSA9ICcnO1xuICBiaW8gPSAnJztcbiAgbWFqb3IgPSAnJztcbiAgZ3JhZHVhdGlvblllYXIgPSAnJztcbiAgaW50ZXJlc3RzID0gJyc7XG4gIGNsdWJzID0gJyc7XG5cbiAgY29uc3RydWN0b3IoIHByaXZhdGUgX2F1dGg6IEF1dGhTZXJ2aWNlICkge1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLl9hdXRoLmNoYXRraXRVc2VyJC5zdWJzY3JpYmUoXG4gICAgICAodXNlcikgPT4ge1xuICAgICAgICB0aGlzLmNoYXRraXRVc2VyID0gdXNlcjtcbiAgICAgICAgY29uc29sZS5sb2coJ0NIQVRLSVQgVVNFUjonLCB0aGlzLmNoYXRraXRVc2VyKTtcbiAgICAgICAgdGhpcy5pbml0Rm9ybSgpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG4gIGluaXRGb3JtKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLmNoYXRraXRVc2VyLm5hbWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubmFtZSA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmJpbyA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5iaW87XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuYmlvID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubWFqb3IgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEubWFqb3I7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubWFqb3IgPSAnJztcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5ncmFkdWF0aW9uWWVhcjtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9ICcnO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmludGVyZXN0cyA9IHRoaXMuY2hhdGtpdFVzZXIuY3VzdG9tRGF0YS5pbnRlcmVzdHM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuaW50ZXJlc3RzID0gJyc7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2x1YnMgPSB0aGlzLmNoYXRraXRVc2VyLmN1c3RvbURhdGEuY2x1YnM7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuY2x1YnMgPSAnJztcbiAgICB9XG4gIH1cbn1cbiJdfQ==