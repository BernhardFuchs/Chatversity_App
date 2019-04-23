"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
var ControllerDepFactory = /** @class */ (function () {
    function ControllerDepFactory() {
    }
    ControllerDepFactory.prototype.create = function (file, srcFile, name, properties, IO) {
        var sourceCode = srcFile.getText();
        var hash = crypto
            .createHash('md5')
            .update(sourceCode)
            .digest('hex');
        var infos = {
            name: name,
            id: 'controller-' + name + '-' + hash,
            file: file,
            methodsClass: IO.methods,
            type: 'controller',
            description: IO.description,
            sourceCode: srcFile.text
        };
        if (properties && properties.length === 1) {
            if (properties[0].text) {
                infos.prefix = properties[0].text;
            }
        }
        return infos;
    };
    return ControllerDepFactory;
}());
exports.ControllerDepFactory = ControllerDepFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci1kZXAuZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2NvbXBpbGVyL2FuZ3VsYXIvZGVwcy9jb250cm9sbGVyLWRlcC5mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRWpDO0lBQ0k7SUFBZSxDQUFDO0lBRVQscUNBQU0sR0FBYixVQUNJLElBQVMsRUFDVCxPQUFzQixFQUN0QixJQUFZLEVBQ1osVUFBc0QsRUFDdEQsRUFBTztRQUVQLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxNQUFNO2FBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQzthQUNqQixNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBbUI7WUFDeEIsSUFBSSxNQUFBO1lBQ0osRUFBRSxFQUFFLGFBQWEsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUk7WUFDckMsSUFBSSxFQUFFLElBQUk7WUFDVixZQUFZLEVBQUUsRUFBRSxDQUFDLE9BQU87WUFDeEIsSUFBSSxFQUFFLFlBQVk7WUFDbEIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXO1lBQzNCLFVBQVUsRUFBRSxPQUFPLENBQUMsSUFBSTtTQUMzQixDQUFDO1FBQ0YsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO2dCQUNwQixLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDckM7U0FDSjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQUEvQkQsSUErQkM7QUEvQlksb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSURlcCB9IGZyb20gJy4uL2RlcGVuZGVuY2llcy5pbnRlcmZhY2VzJztcbmltcG9ydCB7IHRzIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5leHBvcnQgY2xhc3MgQ29udHJvbGxlckRlcEZhY3Rvcnkge1xuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBjcmVhdGUoXG4gICAgICAgIGZpbGU6IGFueSxcbiAgICAgICAgc3JjRmlsZTogdHMuU291cmNlRmlsZSxcbiAgICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgICBwcm9wZXJ0aWVzOiBSZWFkb25seUFycmF5PHRzLk9iamVjdExpdGVyYWxFbGVtZW50TGlrZT4sXG4gICAgICAgIElPOiBhbnlcbiAgICApOiBJQ29udHJvbGxlckRlcCB7XG4gICAgICAgIGxldCBzb3VyY2VDb2RlID0gc3JjRmlsZS5nZXRUZXh0KCk7XG4gICAgICAgIGxldCBoYXNoID0gY3J5cHRvXG4gICAgICAgICAgICAuY3JlYXRlSGFzaCgnbWQ1JylcbiAgICAgICAgICAgIC51cGRhdGUoc291cmNlQ29kZSlcbiAgICAgICAgICAgIC5kaWdlc3QoJ2hleCcpO1xuICAgICAgICBsZXQgaW5mb3M6IElDb250cm9sbGVyRGVwID0ge1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGlkOiAnY29udHJvbGxlci0nICsgbmFtZSArICctJyArIGhhc2gsXG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgbWV0aG9kc0NsYXNzOiBJTy5tZXRob2RzLFxuICAgICAgICAgICAgdHlwZTogJ2NvbnRyb2xsZXInLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IElPLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgc291cmNlQ29kZTogc3JjRmlsZS50ZXh0XG4gICAgICAgIH07XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydGllc1swXS50ZXh0KSB7XG4gICAgICAgICAgICAgICAgaW5mb3MucHJlZml4ID0gcHJvcGVydGllc1swXS50ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmZvcztcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbnRyb2xsZXJEZXAgZXh0ZW5kcyBJRGVwIHtcbiAgICBmaWxlOiBhbnk7XG4gICAgc291cmNlQ29kZTogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgcHJlZml4Pzogc3RyaW5nO1xuICAgIG1ldGhvZHNDbGFzczogQXJyYXk8YW55Pjtcbn1cbiJdfQ==