"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var user_service_1 = require("../../Core/_services/user.service");
var messaging_service_1 = require("../../Core/_services/messaging.service");
var auth_service_1 = require("../../Core/_services/auth.service");
var router_1 = require("@angular/router");
var SearchBarComponent = /** @class */ (function () {
    function SearchBarComponent(formBuilder, _userService, _msgService, authService, router) {
        this.formBuilder = formBuilder;
        this._userService = _userService;
        this._msgService = _msgService;
        this.authService = authService;
        this.router = router;
        this.loading = false;
        this.submitted = false;
    }
    Object.defineProperty(SearchBarComponent.prototype, "f", {
        //
        // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
        //
        get: function () { return this.searchForm.controls; },
        enumerable: true,
        configurable: true
    });
    //
    // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
    //
    SearchBarComponent.prototype.getUser = function (_id) {
        return this.users.find(function (c) { return c.id === _id; });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
    //
    SearchBarComponent.prototype.getRoom = function (_id) {
        return this.rooms.find(function (r) { return r.id === _id; });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── SORT CONNECTIONS LIST ──────────────────────────────────────────────────────
    //
    SearchBarComponent.prototype.sortList = function (users) {
        return users.sort(function (a, b) { return ((a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase())
            > (b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase()) ? 1 : -1); });
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
    //
    SearchBarComponent.prototype.getUsersByName = function (_name) {
        this.userResults = this.search(_name, this.users);
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
    //
    SearchBarComponent.prototype.getRoomsByName = function (_name) {
        this.roomResults = this.search(_name, this.rooms);
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── HELPER SEARCH METHOD ─────────────────────────────────────────────────────────────
    //
    SearchBarComponent.prototype.search = function (_query, _data) {
        var _length = _query.length;
        _query = _query.toLowerCase();
        return _data.filter(function (d) {
            return d.name.toLowerCase().substring(0, _length).includes(_query);
        }).splice(0, 5);
    };
    //
    // ─── HANDLE SEARCH ─────────────────────────────────────────────────────────────
    //
    SearchBarComponent.prototype.onSearch = function () {
        this.submitted = true;
        this.loading = true;
        if (this.searchForm.invalid) {
            this.submitted = false;
            this.loading = false;
            return;
        }
        var query = this.searchForm.get('search').value;
        if (this.userType) {
            this.getUsersByName(query);
        }
        if (this.roomType) {
            this.getRoomsByName(query);
        }
        this.loading = false;
    };
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE CLICK USER BUTTON ───────────────────────────────────────────────────
    //
    SearchBarComponent.prototype.setUser = function (_user) {
        this.selectedUser = _user;
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE CLICK ROOM BUTTON ───────────────────────────────────────────────────
    //
    SearchBarComponent.prototype.setRoom = function (_room) {
        this.selectedRoom = _room;
    };
    // ─────────────────────────────────────────────────────────────────
    //
    // ─── HANDLE CLICK ROOM BUTTON ───────────────────────────────────────────────────
    //
    SearchBarComponent.prototype.getUserActivityStatus = function (_id) {
        return (this.currUser.presenceStore[_id] === 'online') ? true : false;
    };
    // ─────────────────────────────────────────────────────────────────
    SearchBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Get current user
        this.authService.getCurrentUser().subscribe(function (user) {
            _this.currUser = user;
            console.log('CHATKIT USER:', _this.currUser);
            // Get all users
            if (_this.userType) {
                _this._userService.getAll()
                    .toPromise()
                    .then(function (data) {
                    console.log('RESPONSE USER:', data);
                    _this.users = data;
                })
                    .catch(function (error) {
                    console.log(error);
                });
            }
            // Get all rooms
            if (_this.roomType) {
                _this._msgService.getAllRooms()
                    .toPromise()
                    .then(function (data) {
                    console.log('RESPONSE ROOM:', data);
                    _this.rooms = data;
                })
                    .catch(function (error) {
                    console.log(error);
                });
            }
        });
        // Setup search box
        this.searchForm = this.formBuilder.group({
            search: ['', forms_1.Validators.required]
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SearchBarComponent.prototype, "userType", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SearchBarComponent.prototype, "roomType", void 0);
    SearchBarComponent = __decorate([
        core_1.Component({
            selector: 'app-search-bar',
            templateUrl: './search-bar.component.html',
            styleUrls: ['./search-bar.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService, messaging_service_1.MessagingService,
            auth_service_1.AuthService, router_1.Router])
    ], SearchBarComponent);
    return SearchBarComponent;
}());
exports.SearchBarComponent = SearchBarComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBwL1NoYXJlZC9zZWFyY2gtYmFyL3NlYXJjaC1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXdEO0FBQ3hELHdDQUF3RjtBQUN4RixrRUFBK0Q7QUFDL0QsNEVBQXlFO0FBQ3pFLGtFQUErRDtBQUMvRCwwQ0FBd0M7QUFPeEM7SUFrQkUsNEJBQW9CLFdBQXdCLEVBQVUsWUFBeUIsRUFBVSxXQUE2QixFQUM1RyxXQUF3QixFQUFVLE1BQWM7UUFEdEMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM1RyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFaMUQsWUFBTyxHQUFHLEtBQUssQ0FBQTtRQUNmLGNBQVMsR0FBRyxLQUFLLENBQUE7SUFXNkMsQ0FBQztJQU0vRCxzQkFBSSxpQ0FBQztRQUpMLEVBQUU7UUFDRixtRkFBbUY7UUFDbkYsRUFBRTthQUVGLGNBQVUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7OztPQUFBO0lBRTNDLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVGLG9DQUFPLEdBQVAsVUFBUSxHQUFXO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsRUFBWixDQUFZLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBQ0QsbUZBQW1GO0lBRW5GLEVBQUU7SUFDRixtRkFBbUY7SUFDbkYsRUFBRTtJQUVGLG9DQUFPLEdBQVAsVUFBUSxHQUFXO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJ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Q2hCLElBQUksS0FBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUU7cUJBQzdCLFNBQVMsRUFBRTtxQkFDWCxJQUFJLENBQUMsVUFBQyxJQUFJO29CQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUE7b0JBQ25DLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO2dCQUNuQixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLFVBQUMsS0FBSztvQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNwQixDQUFDLENBQUMsQ0FBQTthQUNIO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFSCxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUN2QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7U0FDbEMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQWxMUTtRQUFSLFlBQUssRUFBRTs7d0RBQWtCO0lBQ2pCO1FBQVIsWUFBSyxFQUFFOzt3REFBa0I7SUFGZixrQkFBa0I7UUFMOUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUMxQyxDQUFDO3lDQW1CaUMsbUJBQVcsRUFBd0IsMEJBQVcsRUFBdUIsb0NBQWdCO1lBQy9GLDBCQUFXLEVBQWtCLGVBQU07T0FuQi9DLGtCQUFrQixDQXFMOUI7SUFBRCx5QkFBQztDQUFBLEFBckxELElBcUxDO0FBckxZLGdEQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBOZ0Zvcm0sIEZvcm1Hcm91cCwgRm9ybUJ1aWxkZXIsIFZhbGlkYXRvcnMsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL0NvcmUvX3NlcnZpY2VzL3VzZXIuc2VydmljZSdcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSdcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJ1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2VhcmNoLWJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZWFyY2gtYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2VhcmNoLWJhci5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2VhcmNoQmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgdXNlclR5cGU6IGJvb2xlYW5cbiAgQElucHV0KCkgcm9vbVR5cGU6IGJvb2xlYW5cblxuICBjdXJyVXNlcjogYW55XG5cbiAgc2VhcmNoRm9ybTogRm9ybUdyb3VwXG4gIGxvYWRpbmcgPSBmYWxzZVxuICBzdWJtaXR0ZWQgPSBmYWxzZVxuXG4gIHVzZXJSZXN1bHRzOiBhbnlcbiAgcm9vbVJlc3VsdHM6IGFueVxuXG4gIHVzZXJzOiBhbnlcbiAgc2VsZWN0ZWRVc2VyOiBhbnlcbiAgcm9vbXM6IGFueVxuICBzZWxlY3RlZFJvb206IGFueVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLCBwcml2YXRlIF91c2VyU2VydmljZTogVXNlclNlcnZpY2UsIHByaXZhdGUgX21zZ1NlcnZpY2U6IE1lc3NhZ2luZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHsgfVxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBDT05WRU5JRU5DRSBHRVRURVIgRk9SIEVBU1kgQUNDRVNTIFRPIEZPUk0gRklFTERTIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gIGdldCBmKCkgeyByZXR1cm4gdGhpcy5zZWFyY2hGb3JtLmNvbnRyb2xzIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgUkVUVVJOIFVTRVIgRlJPTSBGUklFTkQgTElTVCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBnZXRVc2VyKF9pZDogbnVtYmVyKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy51c2Vycy5maW5kKGMgPT4gYy5pZCA9PT0gX2lkKVxuICB9XG4gIC8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIC8vXG4gIC8vIOKUgOKUgOKUgCBSRVRVUk4gVVNFUiBGUk9NIEZSSUVORCBMSVNUIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gIGdldFJvb20oX2lkOiBudW1iZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnJvb21zLmZpbmQociA9PiByLmlkID09PSBfaWQpXG4gIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cblxuICAvL1xuICAvLyDilIDilIDilIAgU09SVCBDT05ORUNUSU9OUyBMSVNUIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAvL1xuXG4gIHNvcnRMaXN0KHVzZXJzOiBhbnkpIHtcbiAgICByZXR1cm4gIHVzZXJzLnNvcnQoKGEsIGIpID0+ICgoYS5maXJzdE5hbWUudG9Mb3dlckNhc2UoKSArICcgJyArIGEubGFzdE5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICA+IChiLmZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpICsgJyAnICsgYi5sYXN0TmFtZS50b0xvd2VyQ2FzZSgpKSA/IDEgOiAtMSkpXG4gIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEZJTFRFUiBMSVNUIE9GIFVTRVJTIEJZIE5BTUUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgZ2V0VXNlcnNCeU5hbWUoX25hbWU6IHN0cmluZykge1xuICAgIHRoaXMudXNlclJlc3VsdHMgPSB0aGlzLnNlYXJjaChfbmFtZSwgdGhpcy51c2VycylcbiAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAvL1xuICAvLyDilIDilIDilIAgRklMVEVSIExJU1QgT0YgVVNFUlMgQlkgTkFNRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBnZXRSb29tc0J5TmFtZShfbmFtZTogc3RyaW5nKSB7XG4gICAgIHRoaXMucm9vbVJlc3VsdHMgPSB0aGlzLnNlYXJjaChfbmFtZSwgdGhpcy5yb29tcylcbiAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAvL1xuICAvLyDilIDilIDilIAgSEVMUEVSIFNFQVJDSCBNRVRIT0Qg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gIC8vXG5cbiAgc2VhcmNoKF9xdWVyeTogc3RyaW5nLCBfZGF0YTogYW55KSB7XG4gICAgY29uc3QgX2xlbmd0aCA9IF9xdWVyeS5sZW5ndGhcbiAgICBfcXVlcnkgPSBfcXVlcnkudG9Mb3dlckNhc2UoKVxuXG4gICAgcmV0dXJuIF9kYXRhLmZpbHRlcihkID0+XG4gICAgICBkLm5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMCwgX2xlbmd0aCkuaW5jbHVkZXMoX3F1ZXJ5KSkuc3BsaWNlKDAsIDUpXG4gIH1cblxuICAvL1xuICAvLyDilIDilIDilIAgSEFORExFIFNFQVJDSCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBvblNlYXJjaCgpIHtcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWVcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlXG5cbiAgICBpZiAodGhpcy5zZWFyY2hGb3JtLmludmFsaWQpIHtcbiAgICAgIHRoaXMuc3VibWl0dGVkID0gZmFsc2VcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeTogc3RyaW5nID0gdGhpcy5zZWFyY2hGb3JtLmdldCgnc2VhcmNoJykudmFsdWVcblxuICAgIGlmICh0aGlzLnVzZXJUeXBlKSB7XG4gICAgICB0aGlzLmdldFVzZXJzQnlOYW1lKHF1ZXJ5KVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJvb21UeXBlKSB7XG4gICAgICB0aGlzLmdldFJvb21zQnlOYW1lKHF1ZXJ5KVxuICAgIH1cblxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlXG4gIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBDTElDSyBVU0VSIEJVVFRPTiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBzZXRVc2VyKF91c2VyOiBhbnkpIHtcbiAgICB0aGlzLnNlbGVjdGVkVXNlciA9IF91c2VyXG4gIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBDTElDSyBST09NIEJVVFRPTiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBzZXRSb29tKF9yb29tOiBhbnkpIHtcbiAgICB0aGlzLnNlbGVjdGVkUm9vbSA9IF9yb29tXG4gIH1cbiAgLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgLy9cbiAgLy8g4pSA4pSA4pSAIEhBTkRMRSBDTElDSyBST09NIEJVVFRPTiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgLy9cblxuICBnZXRVc2VyQWN0aXZpdHlTdGF0dXMoX2lkOiBhbnkpIHtcbiAgICByZXR1cm4gKHRoaXMuY3VyclVzZXIucHJlc2VuY2VTdG9yZVtfaWRdID09PSAnb25saW5lJykgPyB0cnVlIDogZmFsc2VcbiAgfVxuICAvLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBHZXQgY3VycmVudCB1c2VyXG4gICAgdGhpcy5hdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnN1YnNjcmliZShcbiAgICAgICh1c2VyKSA9PiB7XG4gICAgICAgIHRoaXMuY3VyclVzZXIgPSB1c2VyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDSEFUS0lUIFVTRVI6JywgdGhpcy5jdXJyVXNlcilcblxuICAgICAgICAvLyBHZXQgYWxsIHVzZXJzXG4gICAgICAgIGlmICh0aGlzLnVzZXJUeXBlKSB7XG4gICAgICAgICAgdGhpcy5fdXNlclNlcnZpY2UuZ2V0QWxsKClcbiAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JFU1BPTlNFIFVTRVI6JywgZGF0YSlcbiAgICAgICAgICAgIHRoaXMudXNlcnMgPSBkYXRhXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IGFsbCByb29tc1xuICAgICAgICBpZiAodGhpcy5yb29tVHlwZSkge1xuICAgICAgICAgIHRoaXMuX21zZ1NlcnZpY2UuZ2V0QWxsUm9vbXMoKVxuICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUkVTUE9OU0UgUk9PTTonLCBkYXRhKVxuICAgICAgICAgICAgdGhpcy5yb29tcyA9IGRhdGFcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgfSlcblxuICAgIC8vIFNldHVwIHNlYXJjaCBib3hcbiAgICB0aGlzLnNlYXJjaEZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgIHNlYXJjaDogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgIH0pXG4gIH1cblxufVxuIl19