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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hbGwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9Qcm9maWxlLVZpZXdzL3NtYWxsL3NtYWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5RDtBQU96RDtJQVFFO1FBRlMsaUJBQVksR0FBRyxLQUFLLENBQUM7SUFFZCxDQUFDO0lBRWpCLGlDQUFRLEdBQVI7SUFFQSxDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELHNDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBWlE7UUFBUixZQUFLLEVBQUU7O2dEQUFXO0lBQ1Y7UUFBUixZQUFLLEVBQUU7O3dEQUFzQjtJQU5uQixjQUFjO1FBTDFCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO1NBQ3JDLENBQUM7O09BQ1csY0FBYyxDQW1CMUI7SUFBRCxxQkFBQztDQUFBLEFBbkJELElBbUJDO0FBbkJZLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zbWFsbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zbWFsbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NtYWxsLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTbWFsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgYmlvOiBzdHJpbmc7XG4gIGdyYWR1YXRpb25ZZWFyOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgdXNlcjogYW55O1xuICBASW5wdXQoKSBpc0Nvbm5lY3Rpb24gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gIH1cblxuICAvLyBUT0RPOiBJbXBsZW1lbnQgYWN0dWFsIGFkZCBjb25uZWN0aW9uIGZ1bmN0aW9uYWxpdHlcbiAgYWRkQ29ubmVjdGlvbigpIHtcbiAgICB0aGlzLmlzQ29ubmVjdGlvbiA9IHRydWU7XG4gIH1cblxufVxuIl19