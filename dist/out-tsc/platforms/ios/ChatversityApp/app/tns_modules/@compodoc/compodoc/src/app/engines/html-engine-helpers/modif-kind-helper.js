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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWYta2luZC1oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvbW9kaWYta2luZC1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx1Q0FBeUM7QUFFekMsK0NBQStDO0FBRS9DO0lBQUE7SUFrQ0EsQ0FBQztJQWpDRzs7Ozs7T0FLRztJQUNJLG9DQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxJQUFrQjtRQUM5QyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsUUFBUSxJQUFJLEVBQUU7WUFDVixLQUFLLDBCQUFVLENBQUMsY0FBYztnQkFDMUIsU0FBUyxHQUFHLFNBQVMsQ0FBQztnQkFDdEIsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxlQUFlO2dCQUMzQixTQUFTLEdBQUcsVUFBVSxDQUFDO2dCQUN2QixNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGdCQUFnQjtnQkFDNUIsU0FBUyxHQUFHLFdBQVcsQ0FBQztnQkFDeEIsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxhQUFhO2dCQUN6QixTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUNyQixNQUFNO1lBQ1YsS0FBSywwQkFBVSxDQUFDLGFBQWE7Z0JBQ3pCLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3JCLE1BQU07WUFDVixLQUFLLDBCQUFVLENBQUMsWUFBWTtnQkFDeEIsU0FBUyxHQUFHLE9BQU8sQ0FBQztnQkFDcEIsTUFBTTtZQUNWLEtBQUssMEJBQVUsQ0FBQyxlQUFlO2dCQUMzQixTQUFTLEdBQUcsVUFBVSxDQUFDO2dCQUN2QixNQUFNO1NBQ2I7UUFDRCxPQUFPLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQUFDLEFBbENELElBa0NDO0FBbENZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgSGFuZGxlYmFycyBmcm9tICdoYW5kbGViYXJzJztcblxuaW1wb3J0IHsgdHMsIFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuZXhwb3J0IGNsYXNzIE1vZGlmS2luZEhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm0gU3ludGF4S2luZCBpbnRvIHN0cmluZ1xuICAgICAqIEBwYXJhbSAge2FueX0gICAgICAgICAgIGNvbnRleHQgSGFuZGxlYmFycyBjb250ZXh0XG4gICAgICogQHBhcmFtICB7U3ludGF4S2luZFtdfSBraW5kICBTeW50YXhLaW5kIGNvbmNhdGVuYXRlZFxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgUGFyc2VkIHN0cmluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBoZWxwZXJGdW5jKGNvbnRleHQ6IGFueSwga2luZDogU3ludGF4S2luZFtdKSB7XG4gICAgICAgIGxldCBfa2luZFRleHQgPSAnJztcbiAgICAgICAgc3dpdGNoIChraW5kKSB7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuUHJpdmF0ZUtleXdvcmQ6XG4gICAgICAgICAgICAgICAgX2tpbmRUZXh0ID0gJ1ByaXZhdGUnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlJlYWRvbmx5S2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnUmVhZG9ubHknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLlByb3RlY3RlZEtleXdvcmQ6XG4gICAgICAgICAgICAgICAgX2tpbmRUZXh0ID0gJ1Byb3RlY3RlZCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN5bnRheEtpbmQuUHVibGljS2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnUHVibGljJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgU3ludGF4S2luZC5TdGF0aWNLZXl3b3JkOlxuICAgICAgICAgICAgICAgIF9raW5kVGV4dCA9ICdTdGF0aWMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLkFzeW5jS2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnQXN5bmMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTeW50YXhLaW5kLkFic3RyYWN0S2V5d29yZDpcbiAgICAgICAgICAgICAgICBfa2luZFRleHQgPSAnQWJzdHJhY3QnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKF9raW5kVGV4dCk7XG4gICAgfVxufVxuIl19