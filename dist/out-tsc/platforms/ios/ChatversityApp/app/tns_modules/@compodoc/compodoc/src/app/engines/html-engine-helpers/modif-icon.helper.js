"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = require("ts-simple-ast");
var ModifIconHelper = /** @class */ (function () {
    function ModifIconHelper() {
    }
    ModifIconHelper.prototype.helperFunc = function (context, kind) {
        var _kindText = '';
        switch (kind) {
            case ts_simple_ast_1.SyntaxKind.PrivateKeyword:
                _kindText = 'lock'; // private
                break;
            case ts_simple_ast_1.SyntaxKind.ProtectedKeyword:
                _kindText = 'lock'; // protected
                break;
            case ts_simple_ast_1.SyntaxKind.StaticKeyword:
                _kindText = 'reset'; // static
                break;
            case ts_simple_ast_1.SyntaxKind.ExportKeyword:
                _kindText = 'export'; // export
                break;
            default:
                _kindText = 'reset';
                break;
        }
        return _kindText;
    };
    return ModifIconHelper;
}());
exports.ModifIconHelper = ModifIconHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWYtaWNvbi5oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvbW9kaWYtaWNvbi5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQ0FBK0M7QUFFL0M7SUFBQTtJQXNCQSxDQUFDO0lBckJVLG9DQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxJQUFnQjtRQUM1QyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsUUFBUSxJQUFJLEVBQUU7WUFDVixLQUFLLDBCQUFVLENBQUMsY0FBYztnQkFDMUIsU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLFVBQVU7Z0JBQzlCLE1BQU07WUFDVixLQUFLLDBCQUFVLENBQUMsZ0JBQWdCO2dCQUM1QixTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsWUFBWTtnQkFDaEMsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxhQUFhO2dCQUN6QixTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUMsU0FBUztnQkFDOUIsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxhQUFhO2dCQUN6QixTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsU0FBUztnQkFDL0IsTUFBTTtZQUNWO2dCQUNJLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBQ3BCLE1BQU07U0FDYjtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUF0QkQsSUFzQkM7QUF0QlksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5cbmltcG9ydCB7IHRzLCBTeW50YXhLaW5kIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmV4cG9ydCBjbGFzcyBNb2RpZkljb25IZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCBraW5kOiBTeW50YXhLaW5kKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IF9raW5kVGV4dCA9ICcnO1xuICAgICAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5Qcml2YXRlS2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnbG9jayc7IC8vIHByaXZhdGVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5Qcm90ZWN0ZWRLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdsb2NrJzsgLy8gcHJvdGVjdGVkXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuU3RhdGljS2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAncmVzZXQnOyAvLyBzdGF0aWNcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5FeHBvcnRLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdleHBvcnQnOyAvLyBleHBvcnRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgX2tpbmRUZXh0ID0gJ3Jlc2V0JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2tpbmRUZXh0O1xuICAgIH1cbn1cbiJdfQ==