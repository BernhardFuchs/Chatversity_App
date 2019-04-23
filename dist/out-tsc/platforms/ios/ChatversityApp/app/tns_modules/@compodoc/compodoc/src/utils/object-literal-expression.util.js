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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LWxpdGVyYWwtZXhwcmVzc2lvbi51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9vYmplY3QtbGl0ZXJhbC1leHByZXNzaW9uLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBMkM7QUFFM0MsU0FBZ0IsZ0NBQWdDLENBQUMsR0FBRztJQUNoRCxJQUFJLGNBQWMsR0FBRyxHQUFHLENBQUM7SUFFekIsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM3QyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBRSxLQUFLO1lBQ25DLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtnQkFDZixjQUFjLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO2dCQUN0QixJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLDBCQUFVLENBQUMsYUFBYSxFQUFFO29CQUN4RCxjQUFjLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztpQkFDM0Q7cUJBQU0sSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFdBQVcsRUFBRTtvQkFDN0QsY0FBYyxJQUFJLE1BQU0sQ0FBQztpQkFDNUI7cUJBQU0sSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSywwQkFBVSxDQUFDLFlBQVksRUFBRTtvQkFDOUQsY0FBYyxJQUFJLE9BQU8sQ0FBQztpQkFDN0I7cUJBQU07b0JBQ0gsY0FBYyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2lCQUMvQzthQUNKO1lBQ0QsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxjQUFjLElBQUksSUFBSSxDQUFDO2FBQzFCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDTjtJQUVELGNBQWMsSUFBSSxHQUFHLENBQUM7SUFFdEIsT0FBTyxjQUFjLENBQUM7QUFDMUIsQ0FBQztBQTVCRCw0RUE0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTeW50YXhLaW5kIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTdHJpbmdpZnlPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihvbGUpIHtcbiAgICBsZXQgcmV0dXJuZWRTdHJpbmcgPSAneyc7XG5cbiAgICBpZiAob2xlLnByb3BlcnRpZXMgJiYgb2xlLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBvbGUucHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuZWRTdHJpbmcgKz0gcHJvcGVydHkubmFtZS50ZXh0ICsgJzogJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplci5raW5kID09PSBTeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuZWRTdHJpbmcgKz0gYCdgICsgcHJvcGVydHkuaW5pdGlhbGl6ZXIudGV4dCArIGAnYDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5LmluaXRpYWxpemVyLmtpbmQgPT09IFN5bnRheEtpbmQuVHJ1ZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuZWRTdHJpbmcgKz0gYHRydWVgO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIua2luZCA9PT0gU3ludGF4S2luZC5GYWxzZUtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuZWRTdHJpbmcgKz0gYGZhbHNlYDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5lZFN0cmluZyArPSBwcm9wZXJ0eS5pbml0aWFsaXplci50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCA8IG9sZS5wcm9wZXJ0aWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5lZFN0cmluZyArPSAnLCAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm5lZFN0cmluZyArPSAnfSc7XG5cbiAgICByZXR1cm4gcmV0dXJuZWRTdHJpbmc7XG59XG4iXX0=