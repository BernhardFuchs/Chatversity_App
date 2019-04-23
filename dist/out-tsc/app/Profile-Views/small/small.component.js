"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SmallComponent = /** @class */ (function () {
    function SmallComponent() {
        this.isConnection = false;
    }
    SmallComponent.prototype.ngOnInit = function () {
        // Get user bio
        try {
            this.bio = this.user.customData.bio;
        }
        catch (err) {
            try {
                this.bio = this.user.custom_data.bio;
            }
            catch (error) {
                this.bio = '';
            }
        }
        // Get user graduation year
        try {
            this.graduationYear = this.user.customData.graduationYear;
        }
        catch (err) {
            try {
                this.graduationYear = this.user.custom_data.graduationYear;
            }
            catch (error) {
                this.graduationYear = '';
            }
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Qcm9maWxlLVZpZXdzL3NtYWxsL3NtYWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF3RDtBQU94RDtJQVFFO1FBRlMsaUJBQVksR0FBRyxLQUFLLENBQUE7SUFFYixDQUFDO0lBRWpCLGlDQUFRLEdBQVI7UUFDRSxlQUFlO1FBQ2YsSUFBSTtZQUNGLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFBO1NBQ3BDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJO2dCQUNGLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFBO2FBQ3JDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUE7YUFDZDtTQUNGO1FBRUQsMkJBQTJCO1FBQzNCLElBQUk7WUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQTtTQUMxRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSTtnQkFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQTthQUMzRDtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO2FBQ3pCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELHNDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtJQUMxQixDQUFDO0lBaENRO1FBQVIsWUFBSyxFQUFFOztnREFBVTtJQUNUO1FBQVIsWUFBSyxFQUFFOzt3REFBcUI7SUFObEIsY0FBYztRQUwxQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFdBQVc7WUFDckIsV0FBVyxFQUFFLHdCQUF3QjtZQUNyQyxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztTQUNyQyxDQUFDOztPQUNXLGNBQWMsQ0F1QzFCO0lBQUQscUJBQUM7Q0FBQSxBQXZDRCxJQXVDQztBQXZDWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zbWFsbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zbWFsbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NtYWxsLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTbWFsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgYmlvOiBzdHJpbmdcbiAgZ3JhZHVhdGlvblllYXI6IHN0cmluZ1xuXG4gIEBJbnB1dCgpIHVzZXI6IGFueVxuICBASW5wdXQoKSBpc0Nvbm5lY3Rpb24gPSBmYWxzZVxuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gR2V0IHVzZXIgYmlvXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYmlvID0gdGhpcy51c2VyLmN1c3RvbURhdGEuYmlvXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmJpbyA9IHRoaXMudXNlci5jdXN0b21fZGF0YS5iaW9cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuYmlvID0gJydcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBHZXQgdXNlciBncmFkdWF0aW9uIHllYXJcbiAgICB0cnkge1xuICAgICAgdGhpcy5ncmFkdWF0aW9uWWVhciA9IHRoaXMudXNlci5jdXN0b21EYXRhLmdyYWR1YXRpb25ZZWFyXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gdGhpcy51c2VyLmN1c3RvbV9kYXRhLmdyYWR1YXRpb25ZZWFyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aGlzLmdyYWR1YXRpb25ZZWFyID0gJydcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOiBJbXBsZW1lbnQgYWN0dWFsIGFkZCBjb25uZWN0aW9uIGZ1bmN0aW9uYWxpdHlcbiAgYWRkQ29ubmVjdGlvbigpIHtcbiAgICB0aGlzLmlzQ29ubmVjdGlvbiA9IHRydWVcbiAgfVxuXG59XG4iXX0=