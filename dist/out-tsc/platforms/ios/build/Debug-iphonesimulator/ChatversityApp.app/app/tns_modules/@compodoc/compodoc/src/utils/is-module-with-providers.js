"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isModuleWithProviders(node) {
    var result = false;
    if (node.declarationList) {
        if (node.declarationList.declarations && node.declarationList.declarations.length > 0) {
            var i = 0, declarations = node.declarationList.declarations, len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var declaration = node.declarationList.declarations[i];
                if (declaration.type) {
                    var type = declaration.type;
                    if (type.typeName) {
                        var text = type.typeName.getText();
                        if (text === 'ModuleWithProviders') {
                            result = true;
                        }
                    }
                }
            }
        }
    }
    return result;
}
exports.isModuleWithProviders = isModuleWithProviders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtbW9kdWxlLXdpdGgtcHJvdmlkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2lzLW1vZHVsZS13aXRoLXByb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLFNBQWdCLHFCQUFxQixDQUFDLElBQTBCO0lBQzVELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNuQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDdEIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25GLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDTCxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQ2hELEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFFbkQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXZELElBQUksV0FBVyxDQUFDLElBQUksRUFBRTtvQkFDbEIsSUFBSSxJQUFJLEdBQXlCLFdBQVcsQ0FBQyxJQUE0QixDQUFDO29CQUMxRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDbkMsSUFBSSxJQUFJLEtBQUsscUJBQXFCLEVBQUU7NEJBQ2hDLE1BQU0sR0FBRyxJQUFJLENBQUM7eUJBQ2pCO3FCQUNKO2lCQUNKO2FBQ0o7U0FDSjtLQUNKO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQXhCRCxzREF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0cyB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNNb2R1bGVXaXRoUHJvdmlkZXJzKG5vZGU6IHRzLlZhcmlhYmxlU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChub2RlLmRlY2xhcmF0aW9uTGlzdCkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zICYmIG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDAsXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zLFxuICAgICAgICAgICAgICAgIGxlbiA9IG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGU6IHRzLlR5cGVSZWZlcmVuY2VOb2RlID0gZGVjbGFyYXRpb24udHlwZSBhcyB0cy5UeXBlUmVmZXJlbmNlTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gdHlwZS50eXBlTmFtZS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dCA9PT0gJ01vZHVsZVdpdGhQcm92aWRlcnMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuIl19