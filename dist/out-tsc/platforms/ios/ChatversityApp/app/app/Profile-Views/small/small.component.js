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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL1Byb2ZpbGUtVmlld3Mvc21hbGwvc21hbGwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlEO0FBT3pEO0lBUUU7UUFGUyxpQkFBWSxHQUFHLEtBQUssQ0FBQztJQUVkLENBQUM7SUFFakIsaUNBQVEsR0FBUjtJQUVBLENBQUM7SUFFRCxzREFBc0Q7SUFDdEQsc0NBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFaUTtRQUFSLFlBQUssRUFBRTs7Z0RBQVc7SUFDVjtRQUFSLFlBQUssRUFBRTs7d0RBQXNCO0lBTm5CLGNBQWM7UUFMMUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsU0FBUyxFQUFFLENBQUMsdUJBQXVCLENBQUM7U0FDckMsQ0FBQzs7T0FDVyxjQUFjLENBbUIxQjtJQUFELHFCQUFDO0NBQUEsQUFuQkQsSUFtQkM7QUFuQlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXNtYWxsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NtYWxsLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc21hbGwuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNtYWxsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBiaW86IHN0cmluZztcbiAgZ3JhZHVhdGlvblllYXI6IHN0cmluZztcblxuICBASW5wdXQoKSB1c2VyOiBhbnk7XG4gIEBJbnB1dCgpIGlzQ29ubmVjdGlvbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgfVxuXG4gIC8vIFRPRE86IEltcGxlbWVudCBhY3R1YWwgYWRkIGNvbm5lY3Rpb24gZnVuY3Rpb25hbGl0eVxuICBhZGRDb25uZWN0aW9uKCkge1xuICAgIHRoaXMuaXNDb25uZWN0aW9uID0gdHJ1ZTtcbiAgfVxuXG59XG4iXX0=