"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = require("ts-simple-ast");
function StringifyObjectLiteralExpression(ole) {
    var returnedString = '{';
    if (ole.properties && ole.properties.length > 0) {
        ole.properties.forEach(function (property, index) {
            if (property.name) {
                returnedString += property.name.text + ': ';
            }
            if (property.initializer) {
                if (property.initializer.kind === ts_simple_ast_1.SyntaxKind.StringLiteral) {
                    returnedString += "'" + property.initializer.text + "'";
                }
                else if (property.initializer.kind === ts_simple_ast_1.SyntaxKind.TrueKeyword) {
                    returnedString += "true";
                }
                else if (property.initializer.kind === ts_simple_ast_1.SyntaxKind.FalseKeyword) {
                    returnedString += "false";
                }
                else {
                    returnedString += property.initializer.text;
                }
            }
            if (index < ole.properties.length - 1) {
                returnedString += ', ';
            }
        });
    }
    returnedString += '}';
    return returnedString;
}
exports.StringifyObjectLiteralExpression = StringifyObjectLiteralExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWxpdGVyYWwtZXhwcmVzc2lvbi51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL29iamVjdC1saXRlcmFsLWV4cHJlc3Npb24udXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUEyQztBQUUzQyxTQUFnQixnQ0FBZ0MsQ0FBQyxHQUFHO0lBQ2hELElBQUksY0FBYyxHQUFHLEdBQUcsQ0FBQztJQUV6QixJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzdDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUSxFQUFFLEtBQUs7WUFDbkMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNmLGNBQWMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDL0M7WUFDRCxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3RCLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssMEJBQVUsQ0FBQyxhQUFhLEVBQUU7b0JBQ3hELGNBQWMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO2lCQUMzRDtxQkFBTSxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsV0FBVyxFQUFFO29CQUM3RCxjQUFjLElBQUksTUFBTSxDQUFDO2lCQUM1QjtxQkFBTSxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsWUFBWSxFQUFFO29CQUM5RCxjQUFjLElBQUksT0FBTyxDQUFDO2lCQUM3QjtxQkFBTTtvQkFDSCxjQUFjLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7aUJBQy9DO2FBQ0o7WUFDRCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25DLGNBQWMsSUFBSSxJQUFJLENBQUM7YUFDMUI7UUFDTCxDQUFDLENBQUMsQ0FBQztLQUNOO0lBRUQsY0FBYyxJQUFJLEdBQUcsQ0FBQztJQUV0QixPQUFPLGNBQWMsQ0FBQztBQUMxQixDQUFDO0FBNUJELDRFQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN5bnRheEtpbmQgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIFN0cmluZ2lmeU9iamVjdExpdGVyYWxFeHByZXNzaW9uKG9sZSkge1xuICAgIGxldCByZXR1cm5lZFN0cmluZyA9ICd7JztcblxuICAgIGlmIChvbGUucHJvcGVydGllcyAmJiBvbGUucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIG9sZS5wcm9wZXJ0aWVzLmZvckVhY2goKHByb3BlcnR5LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5lZFN0cmluZyArPSBwcm9wZXJ0eS5uYW1lLnRleHQgKyAnOiAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmluaXRpYWxpemVyLmtpbmQgPT09IFN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5lZFN0cmluZyArPSBgJ2AgKyBwcm9wZXJ0eS5pbml0aWFsaXplci50ZXh0ICsgYCdgO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIua2luZCA9PT0gU3ludGF4S2luZC5UcnVlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5lZFN0cmluZyArPSBgdHJ1ZWA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplci5raW5kID09PSBTeW50YXhLaW5kLkZhbHNlS2V5d29yZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5lZFN0cmluZyArPSBgZmFsc2VgO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybmVkU3RyaW5nICs9IHByb3BlcnR5LmluaXRpYWxpemVyLnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4IDwgb2xlLnByb3BlcnRpZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybmVkU3RyaW5nICs9ICcsICc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybmVkU3RyaW5nICs9ICd9JztcblxuICAgIHJldHVybiByZXR1cm5lZFN0cmluZztcbn1cbiJdfQ==