"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SmallComponent = /** @class */ (function () {
    function SmallComponent() {
        this.isConnection = false;
    }
    SmallComponent.prototype.ngOnInit = function () {
    };
    // TODO: Implement actual add connection functionality
    SmallComponent.prototype.addConnection = function () {
        this.isConnection = true;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SmallComponent.prototype, "user", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SmallComponent.prototype, "isConnection", void 0);
    SmallComponent = __decorate([
        core_1.Component({
            selector: 'app-small',
            templateUrl: './small.component.html',
            styleUrls: ['./small.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], SmallComponent);
    return SmallComponent;
}());
exports.SmallComponent = SmallComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC9hcHAvUHJvZmlsZS1WaWV3cy9zbWFsbC9zbWFsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUQ7QUFPekQ7SUFRRTtRQUZTLGlCQUFZLEdBQUcsS0FBSyxDQUFDO0lBRWQsQ0FBQztJQUVqQixpQ0FBUSxHQUFSO0lBRUEsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxzQ0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQVpRO1FBQVIsWUFBSyxFQUFFOztnREFBVztJQUNWO1FBQVIsWUFBSyxFQUFFOzt3REFBc0I7SUFObkIsY0FBYztRQUwxQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztTQUNyQyxDQUFDOztPQUNXLGNBQWMsQ0FtQjFCO0lBQUQscUJBQUM7Q0FBQSxBQW5CRCxJQW1CQztBQW5CWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc21hbGwnLFxuICB0ZW1wbGF0ZVVybDogJy4vc21hbGwuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zbWFsbC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU21hbGxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGJpbzogc3RyaW5nO1xuICBncmFkdWF0aW9uWWVhcjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHVzZXI6IGFueTtcbiAgQElucHV0KCkgaXNDb25uZWN0aW9uID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcblxuICB9XG5cbiAgLy8gVE9ETzogSW1wbGVtZW50IGFjdHVhbCBhZGQgY29ubmVjdGlvbiBmdW5jdGlvbmFsaXR5XG4gIGFkZENvbm5lY3Rpb24oKSB7XG4gICAgdGhpcy5pc0Nvbm5lY3Rpb24gPSB0cnVlO1xuICB9XG5cbn1cbiJdfQ==