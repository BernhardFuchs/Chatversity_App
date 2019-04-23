"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require('crypto');
var ModuleDepFactory = /** @class */ (function () {
    function ModuleDepFactory(moduleHelper) {
        this.moduleHelper = moduleHelper;
    }
    ModuleDepFactory.prototype.create = function (file, srcFile, name, properties, IO) {
        var sourceCode = srcFile.getText();
        var hash = crypto
            .createHash('md5')
            .update(sourceCode)
            .digest('hex');
        return {
            name: name,
            id: 'module-' + name + '-' + hash,
            file: file,
            ngid: this.moduleHelper.getModuleId(properties, srcFile),
            providers: this.moduleHelper.getModuleProviders(properties, srcFile),
            declarations: this.moduleHelper.getModuleDeclarations(properties, srcFile),
            controllers: this.moduleHelper.getModuleControllers(properties, srcFile),
            entryComponents: this.moduleHelper.getModuleEntryComponents(properties, srcFile),
            imports: this.moduleHelper.getModuleImports(properties, srcFile),
            exports: this.moduleHelper.getModuleExports(properties, srcFile),
            schemas: this.moduleHelper.getModuleSchemas(properties, srcFile),
            bootstrap: this.moduleHelper.getModuleBootstrap(properties, srcFile),
            type: 'module',
            rawdescription: IO.rawdescription,
            methods: IO.methods,
            description: IO.description,
            sourceCode: srcFile.text
        };
    };
    return ModuleDepFactory;
}());
exports.ModuleDepFactory = ModuleDepFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLWRlcC5mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvY29tcGlsZXIvYW5ndWxhci9kZXBzL21vZHVsZS1kZXAuZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUVqQztJQUNJLDBCQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUFHLENBQUM7SUFFM0MsaUNBQU0sR0FBYixVQUNJLElBQVMsRUFDVCxPQUFzQixFQUN0QixJQUFZLEVBQ1osVUFBc0QsRUFDdEQsRUFBTztRQUVQLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxNQUFNO2FBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQzthQUNqQixNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixPQUFPO1lBQ0gsSUFBSSxNQUFBO1lBQ0osRUFBRSxFQUFFLFNBQVMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUk7WUFDakMsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztZQUN4RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO1lBQ3BFLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7WUFDMUUsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztZQUN4RSxlQUFlLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO1lBQ2hGLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7WUFDaEUsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztZQUNoRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO1lBQ2hFLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7WUFDcEUsSUFBSSxFQUFFLFFBQVE7WUFDZCxjQUFjLEVBQUUsRUFBRSxDQUFDLGNBQWM7WUFDakMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPO1lBQ25CLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVztZQUMzQixVQUFVLEVBQUUsT0FBTyxDQUFDLElBQUk7U0FDYixDQUFDO0lBQ3BCLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksNENBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHMgfSBmcm9tICd0cy1zaW1wbGUtYXN0JztcblxuaW1wb3J0IHsgSURlcCB9IGZyb20gJy4uL2RlcGVuZGVuY2llcy5pbnRlcmZhY2VzJztcbmltcG9ydCB7IE1vZHVsZUhlbHBlciB9IGZyb20gJy4vaGVscGVycy9tb2R1bGUtaGVscGVyJztcblxuY29uc3QgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbmV4cG9ydCBjbGFzcyBNb2R1bGVEZXBGYWN0b3J5IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZHVsZUhlbHBlcjogTW9kdWxlSGVscGVyKSB7fVxuXG4gICAgcHVibGljIGNyZWF0ZShcbiAgICAgICAgZmlsZTogYW55LFxuICAgICAgICBzcmNGaWxlOiB0cy5Tb3VyY2VGaWxlLFxuICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgIHByb3BlcnRpZXM6IFJlYWRvbmx5QXJyYXk8dHMuT2JqZWN0TGl0ZXJhbEVsZW1lbnRMaWtlPixcbiAgICAgICAgSU86IGFueVxuICAgICk6IElNb2R1bGVEZXAge1xuICAgICAgICBsZXQgc291cmNlQ29kZSA9IHNyY0ZpbGUuZ2V0VGV4dCgpO1xuICAgICAgICBsZXQgaGFzaCA9IGNyeXB0b1xuICAgICAgICAgICAgLmNyZWF0ZUhhc2goJ21kNScpXG4gICAgICAgICAgICAudXBkYXRlKHNvdXJjZUNvZGUpXG4gICAgICAgICAgICAuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBpZDogJ21vZHVsZS0nICsgbmFtZSArICctJyArIGhhc2gsXG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgbmdpZDogdGhpcy5tb2R1bGVIZWxwZXIuZ2V0TW9kdWxlSWQocHJvcGVydGllcywgc3JjRmlsZSksXG4gICAgICAgICAgICBwcm92aWRlcnM6IHRoaXMubW9kdWxlSGVscGVyLmdldE1vZHVsZVByb3ZpZGVycyhwcm9wZXJ0aWVzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uczogdGhpcy5tb2R1bGVIZWxwZXIuZ2V0TW9kdWxlRGVjbGFyYXRpb25zKHByb3BlcnRpZXMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgY29udHJvbGxlcnM6IHRoaXMubW9kdWxlSGVscGVyLmdldE1vZHVsZUNvbnRyb2xsZXJzKHByb3BlcnRpZXMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgZW50cnlDb21wb25lbnRzOiB0aGlzLm1vZHVsZUhlbHBlci5nZXRNb2R1bGVFbnRyeUNvbXBvbmVudHMocHJvcGVydGllcywgc3JjRmlsZSksXG4gICAgICAgICAgICBpbXBvcnRzOiB0aGlzLm1vZHVsZUhlbHBlci5nZXRNb2R1bGVJbXBvcnRzKHByb3BlcnRpZXMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgZXhwb3J0czogdGhpcy5tb2R1bGVIZWxwZXIuZ2V0TW9kdWxlRXhwb3J0cyhwcm9wZXJ0aWVzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgIHNjaGVtYXM6IHRoaXMubW9kdWxlSGVscGVyLmdldE1vZHVsZVNjaGVtYXMocHJvcGVydGllcywgc3JjRmlsZSksXG4gICAgICAgICAgICBib290c3RyYXA6IHRoaXMubW9kdWxlSGVscGVyLmdldE1vZHVsZUJvb3RzdHJhcChwcm9wZXJ0aWVzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgICAgICAgcmF3ZGVzY3JpcHRpb246IElPLnJhd2Rlc2NyaXB0aW9uLFxuICAgICAgICAgICAgbWV0aG9kczogSU8ubWV0aG9kcyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBJTy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHNvdXJjZUNvZGU6IHNyY0ZpbGUudGV4dFxuICAgICAgICB9IGFzIElNb2R1bGVEZXA7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb2R1bGVEZXAgZXh0ZW5kcyBJRGVwIHtcbiAgICBmaWxlOiBhbnk7XG4gICAgcHJvdmlkZXJzOiBBcnJheTxhbnk+O1xuICAgIGRlY2xhcmF0aW9uczogQXJyYXk8YW55PjtcbiAgICBjb250cm9sbGVyczogQXJyYXk8YW55PjtcbiAgICBlbnRyeUNvbXBvbmVudHM6IEFycmF5PGFueT47XG4gICAgaW1wb3J0czogQXJyYXk8YW55PjtcbiAgICBleHBvcnRzOiBBcnJheTxhbnk+O1xuICAgIGJvb3RzdHJhcDogYW55O1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgcmF3ZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBzb3VyY2VDb2RlOiBzdHJpbmc7XG4gICAgbWV0aG9kczogYW55O1xufVxuIl19