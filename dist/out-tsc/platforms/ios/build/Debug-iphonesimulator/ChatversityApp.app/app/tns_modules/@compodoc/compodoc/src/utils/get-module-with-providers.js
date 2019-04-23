"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getModuleWithProviders(node) {
    var result;
    if (node.declarationList) {
        if (node.declarationList.declarations && node.declarationList.declarations.length > 0) {
            var i = 0, len = node.declarationList.declarations.length;
            for (i; i < len; i++) {
                var declaration = node.declarationList.declarations[i];
                if (declaration.type) {
                    var type = declaration.type;
                    if (type.typeName) {
                        var text = type.typeName.getText();
                        if (text === 'ModuleWithProviders') {
                            result = declaration.initializer;
                        }
                    }
                }
            }
        }
    }
    return result;
}
exports.getModuleWithProviders = getModuleWithProviders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LW1vZHVsZS13aXRoLXByb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9nZXQtbW9kdWxlLXdpdGgtcHJvdmlkZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsU0FBZ0Isc0JBQXNCLENBQUMsSUFBMEI7SUFDN0QsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDdEIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25GLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDTCxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBRW5ELEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV2RCxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUU7b0JBQ2xCLElBQUksSUFBSSxHQUF5QixXQUFXLENBQUMsSUFBNEIsQ0FBQztvQkFDMUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNmLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ25DLElBQUksSUFBSSxLQUFLLHFCQUFxQixFQUFFOzRCQUNoQyxNQUFNLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQzt5QkFDcEM7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBdkJELHdEQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRzIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2R1bGVXaXRoUHJvdmlkZXJzKG5vZGU6IHRzLlZhcmlhYmxlU3RhdGVtZW50KSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAobm9kZS5kZWNsYXJhdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucyAmJiBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgICAgIGxlbiA9IG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGU6IHRzLlR5cGVSZWZlcmVuY2VOb2RlID0gZGVjbGFyYXRpb24udHlwZSBhcyB0cy5UeXBlUmVmZXJlbmNlTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gdHlwZS50eXBlTmFtZS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGV4dCA9PT0gJ01vZHVsZVdpdGhQcm92aWRlcnMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVjbGFyYXRpb24uaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==