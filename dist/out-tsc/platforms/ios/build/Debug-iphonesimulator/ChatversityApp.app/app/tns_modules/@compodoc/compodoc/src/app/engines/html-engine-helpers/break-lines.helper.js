"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var BreakLinesHelper = /** @class */ (function () {
    function BreakLinesHelper(bars) {
        this.bars = bars;
    }
    BreakLinesHelper.prototype.helperFunc = function (context, text) {
        text = this.bars.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
        text = text.replace(/ /gm, '&nbsp;');
        text = text.replace(/	/gm, '&nbsp;&nbsp;&nbsp;&nbsp;');
        return new Handlebars.SafeString(text);
    };
    return BreakLinesHelper;
}());
exports.BreakLinesHelper = BreakLinesHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWstbGluZXMuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvYnJlYWstbGluZXMuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXlDO0FBRXpDO0lBQ0ksMEJBQW9CLElBQUk7UUFBSixTQUFJLEdBQUosSUFBSSxDQUFBO0lBQUcsQ0FBQztJQUVyQixxQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsSUFBWTtRQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVlksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUh0bWxFbmdpbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlci5pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgSGFuZGxlYmFycyBmcm9tICdoYW5kbGViYXJzJztcblxuZXhwb3J0IGNsYXNzIEJyZWFrTGluZXNIZWxwZXIgaW1wbGVtZW50cyBJSHRtbEVuZ2luZUhlbHBlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBiYXJzKSB7fVxuXG4gICAgcHVibGljIGhlbHBlckZ1bmMoY29udGV4dDogYW55LCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdGV4dCA9IHRoaXMuYmFycy5VdGlscy5lc2NhcGVFeHByZXNzaW9uKHRleHQpO1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCAnPGJyPicpO1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8gL2dtLCAnJm5ic3A7Jyk7XG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1x0L2dtLCAnJm5ic3A7Jm5ic3A7Jm5ic3A7Jm5ic3A7Jyk7XG4gICAgICAgIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKHRleHQpO1xuICAgIH1cbn1cbiJdfQ==