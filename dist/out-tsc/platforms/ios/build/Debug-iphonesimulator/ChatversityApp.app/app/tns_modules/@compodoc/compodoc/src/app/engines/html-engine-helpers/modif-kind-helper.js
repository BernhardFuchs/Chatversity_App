"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var ts_simple_ast_1 = require("ts-simple-ast");
var ModifKindHelper = /** @class */ (function () {
    function ModifKindHelper() {
    }
    /**
     * Transform SyntaxKind into string
     * @param  {any}           context Handlebars context
     * @param  {SyntaxKind[]} kind  SyntaxKind concatenated
     * @return {string}                Parsed string
     */
    ModifKindHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case ts_simple_ast_1.SyntaxKind.PrivateKeyword:
                _kindText = 'Private';
                break;
            case ts_simple_ast_1.SyntaxKind.ReadonlyKeyword:
                _kindText = 'Readonly';
                break;
            case ts_simple_ast_1.SyntaxKind.ProtectedKeyword:
                _kindText = 'Protected';
                break;
            case ts_simple_ast_1.SyntaxKind.PublicKeyword:
                _kindText = 'Public';
                break;
            case ts_simple_ast_1.SyntaxKind.StaticKeyword:
                _kindText = 'Static';
                break;
            case ts_simple_ast_1.SyntaxKind.AsyncKeyword:
                _kindText = 'Async';
                break;
            case ts_simple_ast_1.SyntaxKind.AbstractKeyword:
                _kindText = 'Abstract';
                break;
        }
        return new Handlebars.SafeString(_kindText);
    };
    return ModifKindHelper;
}());
exports.ModifKindHelper = ModifKindHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWYta2luZC1oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZXNpbXVsYXRvci9DaGF0dmVyc2l0eUFwcC5hcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvaHRtbC1lbmdpbmUtaGVscGVycy9tb2RpZi1raW5kLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHVDQUF5QztBQUV6QywrQ0FBK0M7QUFFL0M7SUFBQTtJQWtDQSxDQUFDO0lBakNHOzs7OztPQUtHO0lBQ0ksb0NBQVUsR0FBakIsVUFBa0IsT0FBWSxFQUFFLElBQWtCO1FBQzlDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNuQixRQUFRLElBQUksRUFBRTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxjQUFjO2dCQUMxQixTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUN0QixNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGVBQWU7Z0JBQzNCLFNBQVMsR0FBRyxVQUFVLENBQUM7Z0JBQ3ZCLE1BQU07WUFDVixLQUFLLDBCQUFVLENBQUMsZ0JBQWdCO2dCQUM1QixTQUFTLEdBQUcsV0FBVyxDQUFDO2dCQUN4QixNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGFBQWE7Z0JBQ3pCLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3JCLE1BQU07WUFDVixLQUFLLDBCQUFVLENBQUMsYUFBYTtnQkFDekIsU0FBUyxHQUFHLFFBQVEsQ0FBQztnQkFDckIsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxZQUFZO2dCQUN4QixTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGVBQWU7Z0JBQzNCLFNBQVMsR0FBRyxVQUFVLENBQUM7Z0JBQ3ZCLE1BQU07U0FDYjtRQUNELE9BQU8sSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFsQ0QsSUFrQ0M7QUFsQ1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5pbXBvcnQgKiBhcyBIYW5kbGViYXJzIGZyb20gJ2hhbmRsZWJhcnMnO1xuXG5pbXBvcnQgeyB0cywgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5leHBvcnQgY2xhc3MgTW9kaWZLaW5kSGVscGVyIGltcGxlbWVudHMgSUh0bWxFbmdpbmVIZWxwZXIge1xuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybSBTeW50YXhLaW5kIGludG8gc3RyaW5nXG4gICAgICogQHBhcmFtICB7YW55fSAgICAgICAgICAgY29udGV4dCBIYW5kbGViYXJzIGNvbnRleHRcbiAgICAgKiBAcGFyYW0gIHtTeW50YXhLaW5kW119IGtpbmQgIFN5bnRheEtpbmQgY29uY2F0ZW5hdGVkXG4gICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICBQYXJzZWQgc3RyaW5nXG4gICAgICovXG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBraW5kOiBTeW50YXhLaW5kW10pIHtcbiAgICAgICAgbGV0IF9raW5kVGV4dCA9ICcnO1xuICAgICAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnUHJpdmF0ZSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuUmVhZG9ubHlLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdSZWFkb25seSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuUHJvdGVjdGVkS2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnUHJvdGVjdGVkJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5QdWJsaWNLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdQdWJsaWMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlN0YXRpY0tleXdvcmQ6XG4gICAgICAgICAgICAgICAgX2tpbmRUZXh0ID0gJ1N0YXRpYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuQXN5bmNLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdBc3luYyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuQWJzdHJhY3RLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdBYnN0cmFjdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoX2tpbmRUZXh0KTtcbiAgICB9XG59XG4iXX0=