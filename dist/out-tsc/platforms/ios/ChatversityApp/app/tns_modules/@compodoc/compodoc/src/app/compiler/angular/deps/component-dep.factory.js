"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../../utils");
var configuration_1 = require("../../../configuration");
var crypto = require('crypto');
var ComponentDepFactory = /** @class */ (function () {
    function ComponentDepFactory(helper) {
        this.helper = helper;
    }
    ComponentDepFactory.prototype.create = function (file, srcFile, name, props, IO) {
        // console.log(util.inspect(props, { showHidden: true, depth: 10 }));
        var sourceCode = srcFile.getText();
        var hash = crypto
            .createHash('md5')
            .update(sourceCode)
            .digest('hex');
        var componentDep = {
            name: name,
            id: 'component-' + name + '-' + hash,
            file: file,
            // animations?: string[]; // TODO
            changeDetection: this.helper.getComponentChangeDetection(props, srcFile),
            encapsulation: this.helper.getComponentEncapsulation(props, srcFile),
            entryComponents: this.helper.getComponentEntryComponents(props, srcFile),
            exportAs: this.helper.getComponentExportAs(props, srcFile),
            host: this.helper.getComponentHost(props),
            inputs: this.helper.getComponentInputsMetadata(props, srcFile),
            // interpolation?: string; // TODO waiting doc infos
            moduleId: this.helper.getComponentModuleId(props, srcFile),
            outputs: this.helper.getComponentOutputs(props, srcFile),
            providers: this.helper.getComponentProviders(props, srcFile),
            // queries?: Deps[]; // TODO
            selector: this.helper.getComponentSelector(props, srcFile),
            styleUrls: this.helper.getComponentStyleUrls(props, srcFile),
            styles: this.helper.getComponentStyles(props, srcFile),
            template: this.helper.getComponentTemplate(props, srcFile),
            templateUrl: this.helper.getComponentTemplateUrl(props, srcFile),
            viewProviders: this.helper.getComponentViewProviders(props, srcFile),
            inputsClass: IO.inputs,
            outputsClass: IO.outputs,
            propertiesClass: IO.properties,
            methodsClass: IO.methods,
            hostBindings: IO.hostBindings,
            hostListeners: IO.hostListeners,
            description: IO.description,
            rawdescription: IO.rawdescription,
            type: 'component',
            sourceCode: srcFile.getText(),
            exampleUrls: this.helper.getComponentExampleUrls(srcFile.getText()),
            tag: this.helper.getComponentTag(props, srcFile),
            styleUrl: this.helper.getComponentStyleUrl(props, srcFile),
            shadow: this.helper.getComponentShadow(props, srcFile),
            scoped: this.helper.getComponentScoped(props, srcFile),
            assetsDir: this.helper.getComponentAssetsDir(props, srcFile),
            assetsDirs: this.helper.getComponentAssetsDirs(props, srcFile),
            styleUrlsData: '',
            stylesData: ''
        };
        if (typeof this.helper.getComponentPreserveWhitespaces(props, srcFile) !== 'undefined') {
            componentDep.preserveWhitespaces = this.helper.getComponentPreserveWhitespaces(props, srcFile);
        }
        if (configuration_1.default.mainData.disableLifeCycleHooks) {
            componentDep.methodsClass = utils_1.cleanLifecycleHooksFromMethods(componentDep.methodsClass);
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            componentDep.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.constructor) {
            componentDep.constructorObj = IO.constructor;
        }
        if (IO.extends) {
            componentDep.extends = IO.extends;
        }
        if (IO.implements && IO.implements.length > 0) {
            componentDep.implements = IO.implements;
        }
        if (IO.accessors) {
            componentDep.accessors = IO.accessors;
        }
        return componentDep;
    };
    return ComponentDepFactory;
}());
exports.ComponentDepFactory = ComponentDepFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LWRlcC5mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvY29tcGlsZXIvYW5ndWxhci9kZXBzL2NvbXBvbmVudC1kZXAuZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFtRTtBQUNuRSx3REFBbUQ7QUFJbkQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRWpDO0lBQ0ksNkJBQW9CLE1BQXVCO1FBQXZCLFdBQU0sR0FBTixNQUFNLENBQWlCO0lBQUcsQ0FBQztJQUV4QyxvQ0FBTSxHQUFiLFVBQWMsSUFBUyxFQUFFLE9BQVksRUFBRSxJQUFTLEVBQUUsS0FBVSxFQUFFLEVBQU87UUFDakUscUVBQXFFO1FBQ3JFLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxNQUFNO2FBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQzthQUNqQixNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixJQUFJLFlBQVksR0FBa0I7WUFDOUIsSUFBSSxNQUFBO1lBQ0osRUFBRSxFQUFFLFlBQVksR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUk7WUFDcEMsSUFBSSxFQUFFLElBQUk7WUFDVixpQ0FBaUM7WUFDakMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsMkJBQTJCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztZQUN4RSxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO1lBQ3BFLGVBQWUsRUFB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RUFBRTtZQUNwRixZQUFZLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FDMUUsS0FBSyxFQUNMLE9BQU8sQ0FDVixDQUFDO1NBQ0w7UUFDRCxJQUFJLHVCQUFhLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1lBQzlDLFlBQVksQ0FBQyxZQUFZLEdBQUcsc0NBQThCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3pGO1FBQ0QsSUFBSSxFQUFFLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN6QyxZQUFZLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1lBQ2hCLFlBQVksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUNoRDtRQUNELElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTtZQUNaLFlBQVksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztTQUNyQztRQUNELElBQUksRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0MsWUFBWSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2QsWUFBWSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDO1NBQ3pDO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FBQyxBQWxGRCxJQWtGQztBQWxGWSxrREFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjbGVhbkxpZmVjeWNsZUhvb2tzRnJvbU1ldGhvZHMgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlscyc7XG5pbXBvcnQgQ29uZmlndXJhdGlvbiBmcm9tICcuLi8uLi8uLi9jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IElEZXAgfSBmcm9tICcuLi9kZXBlbmRlbmNpZXMuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBDb21wb25lbnRIZWxwZXIgfSBmcm9tICcuL2hlbHBlcnMvY29tcG9uZW50LWhlbHBlcic7XG5cbmNvbnN0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50RGVwRmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBoZWxwZXI6IENvbXBvbmVudEhlbHBlcikge31cblxuICAgIHB1YmxpYyBjcmVhdGUoZmlsZTogYW55LCBzcmNGaWxlOiBhbnksIG5hbWU6IGFueSwgcHJvcHM6IGFueSwgSU86IGFueSk6IElDb21wb25lbnREZXAge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh1dGlsLmluc3BlY3QocHJvcHMsIHsgc2hvd0hpZGRlbjogdHJ1ZSwgZGVwdGg6IDEwIH0pKTtcbiAgICAgICAgbGV0IHNvdXJjZUNvZGUgPSBzcmNGaWxlLmdldFRleHQoKTtcbiAgICAgICAgbGV0IGhhc2ggPSBjcnlwdG9cbiAgICAgICAgICAgIC5jcmVhdGVIYXNoKCdtZDUnKVxuICAgICAgICAgICAgLnVwZGF0ZShzb3VyY2VDb2RlKVxuICAgICAgICAgICAgLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgIGxldCBjb21wb25lbnREZXA6IElDb21wb25lbnREZXAgPSB7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgaWQ6ICdjb21wb25lbnQtJyArIG5hbWUgKyAnLScgKyBoYXNoLFxuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbnM/OiBzdHJpbmdbXTsgLy8gVE9ET1xuICAgICAgICAgICAgY2hhbmdlRGV0ZWN0aW9uOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRDaGFuZ2VEZXRlY3Rpb24ocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgZW5jYXBzdWxhdGlvbjogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50RW5jYXBzdWxhdGlvbihwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBlbnRyeUNvbXBvbmVudHM6IHRoaXMuaGVscGVyLmdldENvbXBvbmVudEVudHJ5Q29tcG9uZW50cyhwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBleHBvcnRBczogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50RXhwb3J0QXMocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgaG9zdDogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50SG9zdChwcm9wcyksXG4gICAgICAgICAgICBpbnB1dHM6IHRoaXMuaGVscGVyLmdldENvbXBvbmVudElucHV0c01ldGFkYXRhKHByb3BzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgIC8vIGludGVycG9sYXRpb24/OiBzdHJpbmc7IC8vIFRPRE8gd2FpdGluZyBkb2MgaW5mb3NcbiAgICAgICAgICAgIG1vZHVsZUlkOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRNb2R1bGVJZChwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBvdXRwdXRzOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRPdXRwdXRzKHByb3BzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgIHByb3ZpZGVyczogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50UHJvdmlkZXJzKHByb3BzLCBzcmNGaWxlKSxcbiAgICAgICAgICAgIC8vIHF1ZXJpZXM/OiBEZXBzW107IC8vIFRPRE9cbiAgICAgICAgICAgIHNlbGVjdG9yOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRTZWxlY3Rvcihwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBzdHlsZVVybHM6IHRoaXMuaGVscGVyLmdldENvbXBvbmVudFN0eWxlVXJscyhwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBzdHlsZXM6IHRoaXMuaGVscGVyLmdldENvbXBvbmVudFN0eWxlcyhwcm9wcywgc3JjRmlsZSksIC8vIFRPRE8gZml4IGFyZ3NcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRUZW1wbGF0ZShwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50VGVtcGxhdGVVcmwocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgdmlld1Byb3ZpZGVyczogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50Vmlld1Byb3ZpZGVycyhwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBpbnB1dHNDbGFzczogSU8uaW5wdXRzLFxuICAgICAgICAgICAgb3V0cHV0c0NsYXNzOiBJTy5vdXRwdXRzLFxuICAgICAgICAgICAgcHJvcGVydGllc0NsYXNzOiBJTy5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgbWV0aG9kc0NsYXNzOiBJTy5tZXRob2RzLFxuXG4gICAgICAgICAgICBob3N0QmluZGluZ3M6IElPLmhvc3RCaW5kaW5ncyxcbiAgICAgICAgICAgIGhvc3RMaXN0ZW5lcnM6IElPLmhvc3RMaXN0ZW5lcnMsXG5cbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBJTy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHJhd2Rlc2NyaXB0aW9uOiBJTy5yYXdkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgICAgICAgICAgc291cmNlQ29kZTogc3JjRmlsZS5nZXRUZXh0KCksXG4gICAgICAgICAgICBleGFtcGxlVXJsczogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50RXhhbXBsZVVybHMoc3JjRmlsZS5nZXRUZXh0KCkpLFxuXG4gICAgICAgICAgICB0YWc6IHRoaXMuaGVscGVyLmdldENvbXBvbmVudFRhZyhwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBzdHlsZVVybDogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50U3R5bGVVcmwocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgc2hhZG93OiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRTaGFkb3cocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgc2NvcGVkOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRTY29wZWQocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgYXNzZXRzRGlyOiB0aGlzLmhlbHBlci5nZXRDb21wb25lbnRBc3NldHNEaXIocHJvcHMsIHNyY0ZpbGUpLFxuICAgICAgICAgICAgYXNzZXRzRGlyczogdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50QXNzZXRzRGlycyhwcm9wcywgc3JjRmlsZSksXG4gICAgICAgICAgICBzdHlsZVVybHNEYXRhOiAnJyxcbiAgICAgICAgICAgIHN0eWxlc0RhdGE6ICcnXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5oZWxwZXIuZ2V0Q29tcG9uZW50UHJlc2VydmVXaGl0ZXNwYWNlcyhwcm9wcywgc3JjRmlsZSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb21wb25lbnREZXAucHJlc2VydmVXaGl0ZXNwYWNlcyA9IHRoaXMuaGVscGVyLmdldENvbXBvbmVudFByZXNlcnZlV2hpdGVzcGFjZXMoXG4gICAgICAgICAgICAgICAgcHJvcHMsXG4gICAgICAgICAgICAgICAgc3JjRmlsZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ29uZmlndXJhdGlvbi5tYWluRGF0YS5kaXNhYmxlTGlmZUN5Y2xlSG9va3MpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudERlcC5tZXRob2RzQ2xhc3MgPSBjbGVhbkxpZmVjeWNsZUhvb2tzRnJvbU1ldGhvZHMoY29tcG9uZW50RGVwLm1ldGhvZHNDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKElPLmpzZG9jdGFncyAmJiBJTy5qc2RvY3RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29tcG9uZW50RGVwLmpzZG9jdGFncyA9IElPLmpzZG9jdGFnc1swXS50YWdzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChJTy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgY29tcG9uZW50RGVwLmNvbnN0cnVjdG9yT2JqID0gSU8uY29uc3RydWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKElPLmV4dGVuZHMpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudERlcC5leHRlbmRzID0gSU8uZXh0ZW5kcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uaW1wbGVtZW50cyAmJiBJTy5pbXBsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbXBvbmVudERlcC5pbXBsZW1lbnRzID0gSU8uaW1wbGVtZW50cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoSU8uYWNjZXNzb3JzKSB7XG4gICAgICAgICAgICBjb21wb25lbnREZXAuYWNjZXNzb3JzID0gSU8uYWNjZXNzb3JzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudERlcDtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbXBvbmVudERlcCBleHRlbmRzIElEZXAge1xuICAgIGZpbGU6IGFueTtcbiAgICBjaGFuZ2VEZXRlY3Rpb246IGFueTtcbiAgICBlbmNhcHN1bGF0aW9uOiBhbnk7XG4gICAgZXhwb3J0QXM6IGFueTtcbiAgICBob3N0OiBhbnk7XG4gICAgaW5wdXRzOiBBcnJheTxhbnk+O1xuICAgIG91dHB1dHM6IEFycmF5PGFueT47XG4gICAgcHJvdmlkZXJzOiBBcnJheTxhbnk+O1xuICAgIG1vZHVsZUlkOiBzdHJpbmc7XG4gICAgc2VsZWN0b3I6IHN0cmluZztcbiAgICBzdHlsZVVybHM6IEFycmF5PHN0cmluZz47XG4gICAgc3R5bGVVcmxzRGF0YTogc3RyaW5nO1xuICAgIHN0eWxlczogQXJyYXk8c3RyaW5nPjtcbiAgICBzdHlsZXNEYXRhOiBzdHJpbmc7XG4gICAgdGVtcGxhdGU6IHN0cmluZztcbiAgICB0ZW1wbGF0ZVVybDogQXJyYXk8c3RyaW5nPjtcbiAgICB2aWV3UHJvdmlkZXJzOiBBcnJheTxhbnk+O1xuICAgIGlucHV0c0NsYXNzOiBBcnJheTxhbnk+O1xuICAgIG91dHB1dHNDbGFzczogQXJyYXk8YW55PjtcbiAgICBwcm9wZXJ0aWVzQ2xhc3M6IEFycmF5PGFueT47XG4gICAgbWV0aG9kc0NsYXNzOiBBcnJheTxhbnk+O1xuXG4gICAgZW50cnlDb21wb25lbnRzOiBBcnJheTxhbnk+O1xuXG4gICAgaG9zdEJpbmRpbmdzOiBBcnJheTxhbnk+O1xuICAgIGhvc3RMaXN0ZW5lcnM6IEFycmF5PGFueT47XG5cbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIHJhd2Rlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgc291cmNlQ29kZTogc3RyaW5nO1xuICAgIGV4YW1wbGVVcmxzOiBBcnJheTxzdHJpbmc+O1xuXG4gICAgY29uc3RydWN0b3JPYmo/OiBPYmplY3Q7XG4gICAganNkb2N0YWdzPzogQXJyYXk8c3RyaW5nPjtcbiAgICBleHRlbmRzPzogYW55O1xuICAgIGltcGxlbWVudHM/OiBhbnk7XG4gICAgYWNjZXNzb3JzPzogT2JqZWN0O1xuXG4gICAgdGFnPzogc3RyaW5nO1xuICAgIHN0eWxlVXJsPzogc3RyaW5nO1xuICAgIHNoYWRvdz86IHN0cmluZztcbiAgICBzY29wZWQ/OiBzdHJpbmc7XG4gICAgYXNzZXRzRGlyPzogc3RyaW5nO1xuICAgIGFzc2V0c0RpcnM/OiBBcnJheTxzdHJpbmc+O1xuXG4gICAgcHJlc2VydmVXaGl0ZXNwYWNlcz86IGFueTtcbn1cbiJdfQ==