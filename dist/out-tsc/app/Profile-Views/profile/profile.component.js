"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var auth_service_1 = require("../../Core/_services/auth.service");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(authService) {
        this.authService = authService;
        this.name = '';
        this.bio = '';
        this.major = '';
        this.graduationYear = '';
        this.interests = '';
        this.clubs = '';
    }
    ProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
            console.log('CHATKIT USER:', _this.currentUser);
            _this.initForm();
        });
    };
    ProfileComponent.prototype.initForm = function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1Byb2ZpbGUtVmlld3MvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFpRDtBQU9qRCxrRUFBK0Q7QUFZL0Q7SUFjRSwwQkFBcUIsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFQN0MsU0FBSSxHQUFHLEVBQUUsQ0FBQTtRQUNULFFBQUcsR0FBRyxFQUFFLENBQUE7UUFDUixVQUFLLEdBQUcsRUFBRSxDQUFBO1FBQ1YsbUJBQWMsR0FBRyxFQUFFLENBQUE7UUFDbkIsY0FBUyxHQUFHLEVBQUUsQ0FBQTtRQUNkLFVBQUssR0FBRyxFQUFFLENBQUE7SUFFd0MsQ0FBQztJQUVuRCxtQ0FBUSxHQUFSO1FBQUEsaUJBUUM7UUFQQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQ3BDLFVBQUMsSUFBSTtZQUNILEtBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUM5QyxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDakIsQ0FBQyxDQUNGLENBQUE7SUFDSCxDQUFDO0lBRUQsbUNBQVEsR0FBUjtRQUNFLElBQUk7WUFDRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO1NBQ2xDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtTQUNmO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFBO1NBQzNDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQTtTQUNkO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFBO1NBQy9DO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtTQUNoQjtRQUVELElBQUk7WUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQTtTQUNqRTtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUE7U0FDekI7UUFFRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUE7U0FDdkQ7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO1NBQ3BCO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFBO1NBQy9DO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtTQUNoQjtJQUNILENBQUM7SUE5RFUsZ0JBQWdCO1FBTjVCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBZ0JrQywwQkFBVztPQWRsQyxnQkFBZ0IsQ0ErRDVCO0lBQUQsdUJBQUM7Q0FBQSxBQS9ERCxJQStEQztBQS9EWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSdcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCdcbmltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcydcbmltcG9ydCB7IE5nRm9ybSwgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgVmFsaWRhdG9ycywgRm9ybUNvbnRyb2wsIE1heExlbmd0aFZhbGlkYXRvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJ1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcidcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJ1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi8uLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZCdcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJ1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYXBwLmNvbXBvbmVudCdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXByb2ZpbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vcHJvZmlsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Byb2ZpbGUuY29tcG9uZW50LmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgUHJvZmlsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgdXNlcjogYW55XG4gIGN1cnJlbnRVc2VyOiBhbnlcbiAgY29ubmVjdGlvbnM6IGFueVxuICBzdWJzY3JpcHRpb246IGFueVxuXG4gIG5hbWUgPSAnJ1xuICBiaW8gPSAnJ1xuICBtYWpvciA9ICcnXG4gIGdyYWR1YXRpb25ZZWFyID0gJydcbiAgaW50ZXJlc3RzID0gJydcbiAgY2x1YnMgPSAnJ1xuXG4gIGNvbnN0cnVjdG9yKCBwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYXV0aFNlcnZpY2UuY3VycmVudFVzZXIuc3Vic2NyaWJlKFxuICAgICAgKHVzZXIpID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgY29uc29sZS5sb2coJ0NIQVRLSVQgVVNFUjonLCB0aGlzLmN1cnJlbnRVc2VyKVxuICAgICAgICB0aGlzLmluaXRGb3JtKClcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICBpbml0Rm9ybSgpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5uYW1lID0gdGhpcy5jdXJyZW50VXNlci5uYW1lXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMubmFtZSA9ICcnXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYmlvID0gdGhpcy5jdXJyZW50VXNlci5jdXN0b21EYXRhLmJpb1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmJpbyA9ICcnXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubWFqb3IgPSB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGEubWFqb3JcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5tYWpvciA9ICcnXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZ3JhZHVhdGlvblllYXIgPSB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGEuZ3JhZHVhdGlvblllYXJcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9ICcnXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuaW50ZXJlc3RzID0gdGhpcy5jdXJyZW50VXNlci5jdXN0b21EYXRhLmludGVyZXN0c1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmludGVyZXN0cyA9ICcnXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2x1YnMgPSB0aGlzLmN1cnJlbnRVc2VyLmN1c3RvbURhdGEuY2x1YnNcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5jbHVicyA9ICcnXG4gICAgfVxuICB9XG59XG4iXX0=