"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts_simple_ast_1 = require("ts-simple-ast");
var ast = new ts_simple_ast_1.default();
var ImportsUtil = /** @class */ (function () {
    function ImportsUtil() {
    }
    ImportsUtil.getInstance = function () {
        if (!ImportsUtil.instance) {
            ImportsUtil.instance = new ImportsUtil();
        }
        return ImportsUtil.instance;
    };
    /**
     * Find for a sourceFile a variable value in a local enum
     * @param srcFile
     * @param variableName
     * @param variableValue
     */
    ImportsUtil.prototype.findInEnums = function (srcFile, variableName, variableValue) {
        var res = '';
        srcFile.getEnum(function (e) {
            if (e.getName() === variableName) {
                e.getMember(function (m) {
                    if (m.getName() === variableValue) {
                        res = m.getValue();
                    }
                });
            }
        });
        return res;
    };
    /**
     * Find for a sourceFile a variable value in a local static class
     * @param srcFile
     * @param variableName
     * @param variableValue
     */
    ImportsUtil.prototype.findInClasses = function (srcFile, variableName, variableValue) {
        var res = '';
        srcFile.getClass(function (c) {
            var staticProperty = c.getStaticProperty(variableValue);
            if (staticProperty) {
                if (staticProperty.getInitializer()) {
                    res = staticProperty.getInitializer().getText();
                }
            }
        });
        return res;
    };
    /**
     * Find a value in a local variable declaration like an object
     * @param variableDeclaration
     * @param variablesAttributes
     */
    ImportsUtil.prototype.findInObjectVariableDeclaration = function (variableDeclaration, variablesAttributes) {
        var variableKind = variableDeclaration.getKind();
        if (variableKind && variableKind === ts_simple_ast_1.SyntaxKind.VariableDeclaration) {
            var initializer = variableDeclaration.getInitializer();
            if (initializer) {
                var initializerKind = initializer.getKind();
                if (initializerKind && initializerKind === ts_simple_ast_1.SyntaxKind.ObjectLiteralExpression) {
                    var compilerNode = initializer.compilerNode, finalValue_1 = '';
                    // Find thestring from AVAR.BVAR.thestring inside properties
                    var depth_1 = 0;
                    var loopProperties_1 = function (properties) {
                        properties.forEach(function (prop) {
                            if (prop.name) {
                                if (variablesAttributes[depth_1 + 1]) {
                                    if (prop.name.getText() === variablesAttributes[depth_1 + 1]) {
                                        if (prop.initializer) {
                                            if (prop.initializer.properties) {
                                                depth_1 += 1;
                                                loopProperties_1(prop.initializer.properties);
                                            }
                                            else {
                                                finalValue_1 = prop.initializer.text;
                                            }
                                        }
                                        else {
                                            finalValue_1 = prop.initializer.text;
                                        }
                                    }
                                }
                            }
                        });
                    };
                    loopProperties_1(compilerNode.properties);
                    return finalValue_1;
                }
            }
        }
    };
    /**
     * Find in imports something like myvar
     * @param  {string} inputVariableName              like myvar
     * @return {[type]}                                myvar value
     */
    ImportsUtil.prototype.findValueInImportOrLocalVariables = function (inputVariableName, sourceFile) {
        var metadataVariableName = inputVariableName, searchedImport, aliasOriginalName = '', foundWithAlias = false;
        var file = typeof ast.getSourceFile(sourceFile.fileName) !== 'undefined'
            ? ast.getSourceFile(sourceFile.fileName)
            : ast.addExistingSourceFileIfExists(sourceFile.fileName); // tslint:disable-line
        var imports = file.getImportDeclarations();
        /**
         * Loop through all imports, and find one matching inputVariableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasIdentifier()) {
                        importAlias = namedImports[j].getAliasIdentifier().getText();
                    }
                    if (importName === metadataVariableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === metadataVariableName) {
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        function hasFoundValues(variableDeclaration) {
            var variableKind = variableDeclaration.getKind();
            if (variableKind && variableKind === ts_simple_ast_1.SyntaxKind.VariableDeclaration) {
                var initializer = variableDeclaration.getInitializer();
                if (initializer) {
                    var initializerKind = initializer.getKind();
                    if (initializerKind && initializerKind === ts_simple_ast_1.SyntaxKind.ObjectLiteralExpression) {
                        var compilerNode = initializer.compilerNode;
                        return compilerNode.properties;
                    }
                }
            }
        }
        if (typeof searchedImport !== 'undefined') {
            var importPathReference = searchedImport.getModuleSpecifierSourceFile();
            var importPath = void 0;
            if (typeof importPathReference !== 'undefined') {
                importPath = importPathReference.compilerNode.fileName;
                var sourceFileImport = typeof ast.getSourceFile(importPath) !== 'undefined'
                    ? ast.getSourceFile(importPath)
                    : ast.addExistingSourceFileIfExists(importPath); // tslint:disable-line
                if (sourceFileImport) {
                    var variableName = foundWithAlias ? aliasOriginalName : metadataVariableName;
                    var variableDeclaration = sourceFileImport.getVariableDeclaration(variableName);
                    if (variableDeclaration) {
                        return hasFoundValues(variableDeclaration);
                    }
                    else {
                        // Try with exports
                        var exportDeclarations = sourceFileImport.getExportDeclarations();
                        if (exportDeclarations && exportDeclarations.length > 0) {
                            var i = 0, len = exportDeclarations.length;
                            for (i; i < len; i++) {
                                var exportDeclaration = exportDeclarations[i];
                                var sourceFileExportedReference = exportDeclaration.getModuleSpecifierSourceFile();
                                if (sourceFileExportedReference) {
                                    var sourceFileExportedReferencePath = sourceFileExportedReference.getFilePath();
                                    var sourceFileExported = typeof ast.getSourceFile(sourceFileExportedReferencePath) !== 'undefined'
                                        ? ast.getSourceFile(sourceFileExportedReferencePath)
                                        : ast.addExistingSourceFileIfExists(sourceFileExportedReferencePath);
                                    if (sourceFileExported) {
                                        variableDeclaration = sourceFileExported.getVariableDeclaration(variableName);
                                        if (variableDeclaration) {
                                            return hasFoundValues(variableDeclaration);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            // Find in local variables of the file
            var variableDeclaration = file.getVariableDeclaration(metadataVariableName);
            if (variableDeclaration) {
                var variableKind = variableDeclaration.getKind();
                if (variableKind && variableKind === ts_simple_ast_1.SyntaxKind.VariableDeclaration) {
                    var initializer = variableDeclaration.getInitializer();
                    if (initializer) {
                        var initializerKind = initializer.getKind();
                        if (initializerKind &&
                            initializerKind === ts_simple_ast_1.SyntaxKind.ObjectLiteralExpression) {
                            var compilerNode = initializer.compilerNode;
                            return compilerNode.properties;
                        }
                        else if (initializerKind) {
                            return variableDeclaration.compilerNode;
                        }
                    }
                }
            }
        }
        return [];
    };
    ImportsUtil.prototype.getFileNameOfImport = function (variableName, sourceFile) {
        var file = typeof ast.getSourceFile(sourceFile.fileName) !== 'undefined'
            ? ast.getSourceFile(sourceFile.fileName)
            : ast.addExistingSourceFile(sourceFile.fileName); // tslint:disable-line
        var imports = file.getImportDeclarations();
        var searchedImport, aliasOriginalName = '', finalPath = '', foundWithAlias = false;
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasIdentifier()) {
                        importAlias = namedImports[j].getAliasIdentifier().getText();
                    }
                    if (importName === variableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === variableName) {
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        if (typeof searchedImport !== 'undefined') {
            var importPath = path.resolve(path.dirname(sourceFile.fileName) +
                '/' +
                searchedImport.getModuleSpecifierValue() +
                '.ts');
            var cleaner = (process.cwd() + path.sep).replace(/\\/g, '/');
            finalPath = importPath.replace(cleaner, '');
        }
        return finalPath;
    };
    /**
     * Find the file path of imported variable
     * @param  {string} inputVariableName  like thestring
     * @return {[type]}                    thestring destination path
     */
    ImportsUtil.prototype.findFilePathOfImportedVariable = function (inputVariableName, sourceFilePath) {
        var searchedImport, finalPath = '', aliasOriginalName = '', foundWithAlias = false;
        var file = typeof ast.getSourceFile(sourceFilePath) !== 'undefined'
            ? ast.getSourceFile(sourceFilePath)
            : ast.addExistingSourceFile(sourceFilePath); // tslint:disable-line
        var imports = file.getImportDeclarations();
        /**
         * Loop through all imports, and find one matching inputVariableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasIdentifier()) {
                        importAlias = namedImports[j].getAliasIdentifier().getText();
                    }
                    if (importName === inputVariableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === inputVariableName) {
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        if (typeof searchedImport !== 'undefined') {
            finalPath = path.resolve(path.dirname(sourceFilePath) +
                '/' +
                searchedImport.getModuleSpecifierValue() +
                '.ts');
        }
        return finalPath;
    };
    /**
     * Find in imports something like VAR.AVAR.BVAR.thestring
     * @param  {string} inputVariableName                   like VAR.AVAR.BVAR.thestring
     * @return {[type]}                                thestring value
     */
    ImportsUtil.prototype.findPropertyValueInImportOrLocalVariables = function (inputVariableName, sourceFile) {
        var variablesAttributes = inputVariableName.split('.'), metadataVariableName = variablesAttributes[0], searchedImport, aliasOriginalName = '', foundWithAlias = false;
        var file = typeof ast.getSourceFile(sourceFile.fileName) !== 'undefined'
            ? ast.getSourceFile(sourceFile.fileName)
            : ast.addExistingSourceFile(sourceFile.fileName); // tslint:disable-line
        var imports = file.getImportDeclarations();
        /**
         * Loop through all imports, and find one matching inputVariableName
         */
        imports.forEach(function (i) {
            var namedImports = i.getNamedImports(), namedImportsLength = namedImports.length, j = 0;
            if (namedImportsLength > 0) {
                for (j; j < namedImportsLength; j++) {
                    var importName = namedImports[j].getNameNode().getText(), importAlias = void 0;
                    if (namedImports[j].getAliasIdentifier()) {
                        importAlias = namedImports[j].getAliasIdentifier().getText();
                    }
                    if (importName === metadataVariableName) {
                        searchedImport = i;
                        break;
                    }
                    if (importAlias === metadataVariableName) {
                        foundWithAlias = true;
                        aliasOriginalName = importName;
                        searchedImport = i;
                        break;
                    }
                }
            }
        });
        var fileToSearchIn, variableDeclaration;
        if (typeof searchedImport !== 'undefined') {
            var importPath = path.resolve(path.dirname(sourceFile.fileName) +
                '/' +
                searchedImport.getModuleSpecifierValue() +
                '.ts');
            var sourceFileImport = typeof ast.getSourceFile(importPath) !== 'undefined'
                ? ast.getSourceFile(importPath)
                : ast.addExistingSourceFile(importPath); // tslint:disable-line
            if (sourceFileImport) {
                fileToSearchIn = sourceFileImport;
                var variableName = foundWithAlias ? aliasOriginalName : metadataVariableName;
                variableDeclaration = fileToSearchIn.getVariableDeclaration(variableName);
            }
        }
        else {
            fileToSearchIn = file;
            // Find in local variables of the file
            variableDeclaration = fileToSearchIn.getVariableDeclaration(metadataVariableName);
        }
        if (variableDeclaration) {
            return this.findInObjectVariableDeclaration(variableDeclaration, variablesAttributes);
        }
        // Try find it in enums
        if (variablesAttributes.length > 0) {
            if (typeof fileToSearchIn !== 'undefined') {
                var val = this.findInEnums(fileToSearchIn, metadataVariableName, variablesAttributes[1]);
                if (val !== '') {
                    return val;
                }
                val = this.findInClasses(fileToSearchIn, metadataVariableName, variablesAttributes[1]);
                if (val !== '') {
                    return val;
                }
            }
        }
    };
    return ImportsUtil;
}());
exports.ImportsUtil = ImportsUtil;
exports.default = ImportsUtil.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9pbXBvcnRzLnV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFFN0IsK0NBQXlFO0FBRXpFLElBQU0sR0FBRyxHQUFHLElBQUksdUJBQUcsRUFBRSxDQUFDO0FBRXRCO0lBRUk7SUFBdUIsQ0FBQztJQUNWLHVCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDdkIsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1NBQzVDO1FBQ0QsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNLLGlDQUFXLEdBQW5CLFVBQW9CLE9BQU8sRUFBRSxZQUFvQixFQUFFLGFBQXFCO1FBQ3BFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQ2IsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssWUFBWSxFQUFFO2dCQUM5QixDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztvQkFDVCxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxhQUFhLEVBQUU7d0JBQy9CLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ3RCO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2FBQ047UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssbUNBQWEsR0FBckIsVUFBc0IsT0FBTyxFQUFFLFlBQW9CLEVBQUUsYUFBcUI7UUFD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QkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FDekIsQ0FBQztnQkFDRixJQUFJLEdBQUcsS0FBSyxFQUFFLEVBQUU7b0JBQ1osT0FBTyxHQUFHLENBQUM7aUJBQ2Q7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQyxBQWpiRCxJQWliQztBQWpiWSxrQ0FBVztBQW1ieEIsa0JBQWUsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IEFzdCwgeyB0cywgUHJvcGVydHlEZWNsYXJhdGlvbiwgU3ludGF4S2luZCB9IGZyb20gJ3RzLXNpbXBsZS1hc3QnO1xuXG5jb25zdCBhc3QgPSBuZXcgQXN0KCk7XG5cbmV4cG9ydCBjbGFzcyBJbXBvcnRzVXRpbCB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEltcG9ydHNVdGlsO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIGlmICghSW1wb3J0c1V0aWwuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIEltcG9ydHNVdGlsLmluc3RhbmNlID0gbmV3IEltcG9ydHNVdGlsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEltcG9ydHNVdGlsLmluc3RhbmNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaW5kIGZvciBhIHNvdXJjZUZpbGUgYSB2YXJpYWJsZSB2YWx1ZSBpbiBhIGxvY2FsIGVudW1cbiAgICAgKiBAcGFyYW0gc3JjRmlsZVxuICAgICAqIEBwYXJhbSB2YXJpYWJsZU5hbWVcbiAgICAgKiBAcGFyYW0gdmFyaWFibGVWYWx1ZVxuICAgICAqL1xuICAgIHByaXZhdGUgZmluZEluRW51bXMoc3JjRmlsZSwgdmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhcmlhYmxlVmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgcmVzID0gJyc7XG4gICAgICAgIHNyY0ZpbGUuZ2V0RW51bShlID0+IHtcbiAgICAgICAgICAgIGlmIChlLmdldE5hbWUoKSA9PT0gdmFyaWFibGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgZS5nZXRNZW1iZXIobSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtLmdldE5hbWUoKSA9PT0gdmFyaWFibGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gbS5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgZm9yIGEgc291cmNlRmlsZSBhIHZhcmlhYmxlIHZhbHVlIGluIGEgbG9jYWwgc3RhdGljIGNsYXNzXG4gICAgICogQHBhcmFtIHNyY0ZpbGVcbiAgICAgKiBAcGFyYW0gdmFyaWFibGVOYW1lXG4gICAgICogQHBhcmFtIHZhcmlhYmxlVmFsdWVcbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbmRJbkNsYXNzZXMoc3JjRmlsZSwgdmFyaWFibGVOYW1lOiBzdHJpbmcsIHZhcmlhYmxlVmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgcmVzID0gJyc7XG4gICAgICAgIHNyY0ZpbGUuZ2V0Q2xhc3MoYyA9PiB7XG4gICAgICAgICAgICBsZXQgc3RhdGljUHJvcGVydHk6IFByb3BlcnR5RGVjbGFyYXRpb24gPSBjLmdldFN0YXRpY1Byb3BlcnR5KHZhcmlhYmxlVmFsdWUpO1xuICAgICAgICAgICAgaWYgKHN0YXRpY1Byb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRpY1Byb3BlcnR5LmdldEluaXRpYWxpemVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gc3RhdGljUHJvcGVydHkuZ2V0SW5pdGlhbGl6ZXIoKS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGEgdmFsdWUgaW4gYSBsb2NhbCB2YXJpYWJsZSBkZWNsYXJhdGlvbiBsaWtlIGFuIG9iamVjdFxuICAgICAqIEBwYXJhbSB2YXJpYWJsZURlY2xhcmF0aW9uXG4gICAgICogQHBhcmFtIHZhcmlhYmxlc0F0dHJpYnV0ZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbmRJbk9iamVjdFZhcmlhYmxlRGVjbGFyYXRpb24odmFyaWFibGVEZWNsYXJhdGlvbiwgdmFyaWFibGVzQXR0cmlidXRlcykge1xuICAgICAgICBsZXQgdmFyaWFibGVLaW5kID0gdmFyaWFibGVEZWNsYXJhdGlvbi5nZXRLaW5kKCk7XG4gICAgICAgIGlmICh2YXJpYWJsZUtpbmQgJiYgdmFyaWFibGVLaW5kID09PSBTeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIGxldCBpbml0aWFsaXplciA9IHZhcmlhYmxlRGVjbGFyYXRpb24uZ2V0SW5pdGlhbGl6ZXIoKTtcbiAgICAgICAgICAgIGlmIChpbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgIGxldCBpbml0aWFsaXplcktpbmQgPSBpbml0aWFsaXplci5nZXRLaW5kKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyS2luZCAmJiBpbml0aWFsaXplcktpbmQgPT09IFN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBpbGVyTm9kZSA9IGluaXRpYWxpemVyLmNvbXBpbGVyTm9kZSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsVmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgLy8gRmluZCB0aGVzdHJpbmcgZnJvbSBBVkFSLkJWQVIudGhlc3RyaW5nIGluc2lkZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsb29wUHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlc0F0dHJpYnV0ZXNbZGVwdGggKyAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AubmFtZS5nZXRUZXh0KCkgPT09IHZhcmlhYmxlc0F0dHJpYnV0ZXNbZGVwdGggKyAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wLmluaXRpYWxpemVyLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wUHJvcGVydGllcyhwcm9wLmluaXRpYWxpemVyLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxWYWx1ZSA9IHByb3AuaW5pdGlhbGl6ZXIudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsVmFsdWUgPSBwcm9wLmluaXRpYWxpemVyLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGxvb3BQcm9wZXJ0aWVzKGNvbXBpbGVyTm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpbmFsVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBpbiBpbXBvcnRzIHNvbWV0aGluZyBsaWtlIG15dmFyXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBpbnB1dFZhcmlhYmxlTmFtZSAgICAgICAgICAgICAgbGlrZSBteXZhclxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15dmFyIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIGZpbmRWYWx1ZUluSW1wb3J0T3JMb2NhbFZhcmlhYmxlcyhpbnB1dFZhcmlhYmxlTmFtZTogc3RyaW5nLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gICAgICAgIGxldCBtZXRhZGF0YVZhcmlhYmxlTmFtZSA9IGlucHV0VmFyaWFibGVOYW1lLFxuICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQsXG4gICAgICAgICAgICBhbGlhc09yaWdpbmFsTmFtZSA9ICcnLFxuICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBmaWxlID1cbiAgICAgICAgICAgIHR5cGVvZiBhc3QuZ2V0U291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGUuZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlSWZFeGlzdHMoc291cmNlRmlsZS5maWxlTmFtZSk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgICAgY29uc3QgaW1wb3J0cyA9IGZpbGUuZ2V0SW1wb3J0RGVjbGFyYXRpb25zKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvb3AgdGhyb3VnaCBhbGwgaW1wb3J0cywgYW5kIGZpbmQgb25lIG1hdGNoaW5nIGlucHV0VmFyaWFibGVOYW1lXG4gICAgICAgICAqL1xuICAgICAgICBpbXBvcnRzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZWRJbXBvcnRzID0gaS5nZXROYW1lZEltcG9ydHMoKSxcbiAgICAgICAgICAgICAgICBuYW1lZEltcG9ydHNMZW5ndGggPSBuYW1lZEltcG9ydHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGogPSAwO1xuXG4gICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAoajsgaiA8IG5hbWVkSW1wb3J0c0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnROYW1lID0gbmFtZWRJbXBvcnRzW2pdLmdldE5hbWVOb2RlKCkuZ2V0VGV4dCgpIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzID0gbmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0TmFtZSA9PT0gbWV0YWRhdGFWYXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnRBbGlhcyA9PT0gbWV0YWRhdGFWYXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzT3JpZ2luYWxOYW1lID0gaW1wb3J0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBoYXNGb3VuZFZhbHVlcyh2YXJpYWJsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICBsZXQgdmFyaWFibGVLaW5kID0gdmFyaWFibGVEZWNsYXJhdGlvbi5nZXRLaW5kKCk7XG5cbiAgICAgICAgICAgIGlmICh2YXJpYWJsZUtpbmQgJiYgdmFyaWFibGVLaW5kID09PSBTeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5pdGlhbGl6ZXIgPSB2YXJpYWJsZURlY2xhcmF0aW9uLmdldEluaXRpYWxpemVyKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbml0aWFsaXplcktpbmQgPSBpbml0aWFsaXplci5nZXRLaW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsaXplcktpbmQgJiYgaW5pdGlhbGl6ZXJLaW5kID09PSBTeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGlsZXJOb2RlID0gaW5pdGlhbGl6ZXIuY29tcGlsZXJOb2RlIGFzIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBpbGVyTm9kZS5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2hlZEltcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBpbXBvcnRQYXRoUmVmZXJlbmNlID0gc2VhcmNoZWRJbXBvcnQuZ2V0TW9kdWxlU3BlY2lmaWVyU291cmNlRmlsZSgpO1xuICAgICAgICAgICAgbGV0IGltcG9ydFBhdGg7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGltcG9ydFBhdGhSZWZlcmVuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaW1wb3J0UGF0aCA9IGltcG9ydFBhdGhSZWZlcmVuY2UuY29tcGlsZXJOb2RlLmZpbGVOYW1lO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc291cmNlRmlsZUltcG9ydCA9XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhc3QuZ2V0U291cmNlRmlsZShpbXBvcnRQYXRoKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYXN0LmdldFNvdXJjZUZpbGUoaW1wb3J0UGF0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZUlmRXhpc3RzKGltcG9ydFBhdGgpOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG5cbiAgICAgICAgICAgICAgICBpZiAoc291cmNlRmlsZUltcG9ydCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFyaWFibGVOYW1lID0gZm91bmRXaXRoQWxpYXMgPyBhbGlhc09yaWdpbmFsTmFtZSA6IG1ldGFkYXRhVmFyaWFibGVOYW1lO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFyaWFibGVEZWNsYXJhdGlvbiA9IHNvdXJjZUZpbGVJbXBvcnQuZ2V0VmFyaWFibGVEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YXJpYWJsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFzRm91bmRWYWx1ZXModmFyaWFibGVEZWNsYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUcnkgd2l0aCBleHBvcnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBvcnREZWNsYXJhdGlvbnMgPSBzb3VyY2VGaWxlSW1wb3J0LmdldEV4cG9ydERlY2xhcmF0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cG9ydERlY2xhcmF0aW9ucyAmJiBleHBvcnREZWNsYXJhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVuID0gZXhwb3J0RGVjbGFyYXRpb25zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXhwb3J0RGVjbGFyYXRpb24gPSBleHBvcnREZWNsYXJhdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2UgPSBleHBvcnREZWNsYXJhdGlvbi5nZXRNb2R1bGVTcGVjaWZpZXJTb3VyY2VGaWxlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2VQYXRoID0gc291cmNlRmlsZUV4cG9ydGVkUmVmZXJlbmNlLmdldEZpbGVQYXRoKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUZpbGVFeHBvcnRlZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2VQYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBhc3QuZ2V0U291cmNlRmlsZShzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2VQYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGFzdC5hZGRFeGlzdGluZ1NvdXJjZUZpbGVJZkV4aXN0cyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZUV4cG9ydGVkUmVmZXJlbmNlUGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VGaWxlRXhwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uID0gc291cmNlRmlsZUV4cG9ydGVkLmdldFZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc0ZvdW5kVmFsdWVzKHZhcmlhYmxlRGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZpbmQgaW4gbG9jYWwgdmFyaWFibGVzIG9mIHRoZSBmaWxlXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9uID0gZmlsZS5nZXRWYXJpYWJsZURlY2xhcmF0aW9uKG1ldGFkYXRhVmFyaWFibGVOYW1lKTtcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhcmlhYmxlS2luZCA9IHZhcmlhYmxlRGVjbGFyYXRpb24uZ2V0S2luZCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlS2luZCAmJiB2YXJpYWJsZUtpbmQgPT09IFN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5pdGlhbGl6ZXIgPSB2YXJpYWJsZURlY2xhcmF0aW9uLmdldEluaXRpYWxpemVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsaXplcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluaXRpYWxpemVyS2luZCA9IGluaXRpYWxpemVyLmdldEtpbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplcktpbmQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXplcktpbmQgPT09IFN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21waWxlck5vZGUgPSBpbml0aWFsaXplci5jb21waWxlck5vZGUgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBpbGVyTm9kZS5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbml0aWFsaXplcktpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFyaWFibGVEZWNsYXJhdGlvbi5jb21waWxlck5vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcHVibGljIGdldEZpbGVOYW1lT2ZJbXBvcnQodmFyaWFibGVOYW1lOiBzdHJpbmcsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9XG4gICAgICAgICAgICB0eXBlb2YgYXN0LmdldFNvdXJjZUZpbGUoc291cmNlRmlsZS5maWxlTmFtZSkgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgPyBhc3QuZ2V0U291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKVxuICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICBjb25zdCBpbXBvcnRzID0gZmlsZS5nZXRJbXBvcnREZWNsYXJhdGlvbnMoKTtcbiAgICAgICAgbGV0IHNlYXJjaGVkSW1wb3J0LFxuICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSAnJyxcbiAgICAgICAgICAgIGZpbmFsUGF0aCA9ICcnLFxuICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSBmYWxzZTtcbiAgICAgICAgaW1wb3J0cy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWVkSW1wb3J0cyA9IGkuZ2V0TmFtZWRJbXBvcnRzKCksXG4gICAgICAgICAgICAgICAgbmFtZWRJbXBvcnRzTGVuZ3RoID0gbmFtZWRJbXBvcnRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBqID0gMDtcblxuICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c0xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGo7IGogPCBuYW1lZEltcG9ydHNMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1wb3J0TmFtZSA9IG5hbWVkSW1wb3J0c1tqXS5nZXROYW1lTm9kZSgpLmdldFRleHQoKSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRBbGlhcztcblxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRBbGlhcyA9IG5hbWVkSW1wb3J0c1tqXS5nZXRBbGlhc0lkZW50aWZpZXIoKS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydE5hbWUgPT09IHZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydEFsaWFzID09PSB2YXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzT3JpZ2luYWxOYW1lID0gaW1wb3J0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2hlZEltcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBpbXBvcnRQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKSArXG4gICAgICAgICAgICAgICAgICAgICcvJyArXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0LmdldE1vZHVsZVNwZWNpZmllclZhbHVlKCkgK1xuICAgICAgICAgICAgICAgICAgICAnLnRzJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCBjbGVhbmVyID0gKHByb2Nlc3MuY3dkKCkgKyBwYXRoLnNlcCkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgICAgICAgZmluYWxQYXRoID0gaW1wb3J0UGF0aC5yZXBsYWNlKGNsZWFuZXIsICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmluYWxQYXRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIGZpbGUgcGF0aCBvZiBpbXBvcnRlZCB2YXJpYWJsZVxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gaW5wdXRWYXJpYWJsZU5hbWUgIGxpa2UgdGhlc3RyaW5nXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgICAgdGhlc3RyaW5nIGRlc3RpbmF0aW9uIHBhdGhcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZEZpbGVQYXRoT2ZJbXBvcnRlZFZhcmlhYmxlKGlucHV0VmFyaWFibGVOYW1lLCBzb3VyY2VGaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBzZWFyY2hlZEltcG9ydCxcbiAgICAgICAgICAgIGZpbmFsUGF0aCA9ICcnLFxuICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSAnJyxcbiAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGZpbGUgPVxuICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGVQYXRoKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGVQYXRoKVxuICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZShzb3VyY2VGaWxlUGF0aCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgICAgY29uc3QgaW1wb3J0cyA9IGZpbGUuZ2V0SW1wb3J0RGVjbGFyYXRpb25zKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExvb3AgdGhyb3VnaCBhbGwgaW1wb3J0cywgYW5kIGZpbmQgb25lIG1hdGNoaW5nIGlucHV0VmFyaWFibGVOYW1lXG4gICAgICAgICAqL1xuICAgICAgICBpbXBvcnRzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZWRJbXBvcnRzID0gaS5nZXROYW1lZEltcG9ydHMoKSxcbiAgICAgICAgICAgICAgICBuYW1lZEltcG9ydHNMZW5ndGggPSBuYW1lZEltcG9ydHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGogPSAwO1xuXG4gICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAoajsgaiA8IG5hbWVkSW1wb3J0c0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnROYW1lID0gbmFtZWRJbXBvcnRzW2pdLmdldE5hbWVOb2RlKCkuZ2V0VGV4dCgpIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzID0gbmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0TmFtZSA9PT0gaW5wdXRWYXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnRBbGlhcyA9PT0gaW5wdXRWYXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsaWFzT3JpZ2luYWxOYW1lID0gaW1wb3J0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2hlZEltcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGZpbmFsUGF0aCA9IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICBwYXRoLmRpcm5hbWUoc291cmNlRmlsZVBhdGgpICtcbiAgICAgICAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQuZ2V0TW9kdWxlU3BlY2lmaWVyVmFsdWUoKSArXG4gICAgICAgICAgICAgICAgICAgICcudHMnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5hbFBhdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBpbiBpbXBvcnRzIHNvbWV0aGluZyBsaWtlIFZBUi5BVkFSLkJWQVIudGhlc3RyaW5nXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBpbnB1dFZhcmlhYmxlTmFtZSAgICAgICAgICAgICAgICAgICBsaWtlIFZBUi5BVkFSLkJWQVIudGhlc3RyaW5nXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlc3RyaW5nIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIGZpbmRQcm9wZXJ0eVZhbHVlSW5JbXBvcnRPckxvY2FsVmFyaWFibGVzKGlucHV0VmFyaWFibGVOYW1lLCBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKSB7XG4gICAgICAgIGxldCB2YXJpYWJsZXNBdHRyaWJ1dGVzID0gaW5wdXRWYXJpYWJsZU5hbWUuc3BsaXQoJy4nKSxcbiAgICAgICAgICAgIG1ldGFkYXRhVmFyaWFibGVOYW1lID0gdmFyaWFibGVzQXR0cmlidXRlc1swXSxcbiAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0LFxuICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSAnJyxcbiAgICAgICAgICAgIGZvdW5kV2l0aEFsaWFzID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgZmlsZSA9XG4gICAgICAgICAgICB0eXBlb2YgYXN0LmdldFNvdXJjZUZpbGUoc291cmNlRmlsZS5maWxlTmFtZSkgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgPyBhc3QuZ2V0U291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKVxuICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICBjb25zdCBpbXBvcnRzID0gZmlsZS5nZXRJbXBvcnREZWNsYXJhdGlvbnMoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9vcCB0aHJvdWdoIGFsbCBpbXBvcnRzLCBhbmQgZmluZCBvbmUgbWF0Y2hpbmcgaW5wdXRWYXJpYWJsZU5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGltcG9ydHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lZEltcG9ydHMgPSBpLmdldE5hbWVkSW1wb3J0cygpLFxuICAgICAgICAgICAgICAgIG5hbWVkSW1wb3J0c0xlbmd0aCA9IG5hbWVkSW1wb3J0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgICAgIGlmIChuYW1lZEltcG9ydHNMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqOyBqIDwgbmFtZWRJbXBvcnRzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydE5hbWUgPSBuYW1lZEltcG9ydHNbal0uZ2V0TmFtZU5vZGUoKS5nZXRUZXh0KCkgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXM7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c1tqXS5nZXRBbGlhc0lkZW50aWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXMgPSBuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnROYW1lID09PSBtZXRhZGF0YVZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydEFsaWFzID09PSBtZXRhZGF0YVZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSBpbXBvcnROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBmaWxlVG9TZWFyY2hJbiwgdmFyaWFibGVEZWNsYXJhdGlvbjtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWFyY2hlZEltcG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxldCBpbXBvcnRQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShzb3VyY2VGaWxlLmZpbGVOYW1lKSArXG4gICAgICAgICAgICAgICAgICAgICcvJyArXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaGVkSW1wb3J0LmdldE1vZHVsZVNwZWNpZmllclZhbHVlKCkgK1xuICAgICAgICAgICAgICAgICAgICAnLnRzJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZUZpbGVJbXBvcnQgPVxuICAgICAgICAgICAgICAgIHR5cGVvZiBhc3QuZ2V0U291cmNlRmlsZShpbXBvcnRQYXRoKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICAgICAgPyBhc3QuZ2V0U291cmNlRmlsZShpbXBvcnRQYXRoKVxuICAgICAgICAgICAgICAgICAgICA6IGFzdC5hZGRFeGlzdGluZ1NvdXJjZUZpbGUoaW1wb3J0UGF0aCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgICAgICAgIGlmIChzb3VyY2VGaWxlSW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgZmlsZVRvU2VhcmNoSW4gPSBzb3VyY2VGaWxlSW1wb3J0O1xuICAgICAgICAgICAgICAgIGxldCB2YXJpYWJsZU5hbWUgPSBmb3VuZFdpdGhBbGlhcyA/IGFsaWFzT3JpZ2luYWxOYW1lIDogbWV0YWRhdGFWYXJpYWJsZU5hbWU7XG4gICAgICAgICAgICAgICAgdmFyaWFibGVEZWNsYXJhdGlvbiA9IGZpbGVUb1NlYXJjaEluLmdldFZhcmlhYmxlRGVjbGFyYXRpb24odmFyaWFibGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbGVUb1NlYXJjaEluID0gZmlsZTtcbiAgICAgICAgICAgIC8vIEZpbmQgaW4gbG9jYWwgdmFyaWFibGVzIG9mIHRoZSBmaWxlXG4gICAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uID0gZmlsZVRvU2VhcmNoSW4uZ2V0VmFyaWFibGVEZWNsYXJhdGlvbihtZXRhZGF0YVZhcmlhYmxlTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFyaWFibGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluZEluT2JqZWN0VmFyaWFibGVEZWNsYXJhdGlvbih2YXJpYWJsZURlY2xhcmF0aW9uLCB2YXJpYWJsZXNBdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcnkgZmluZCBpdCBpbiBlbnVtc1xuICAgICAgICBpZiAodmFyaWFibGVzQXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpbGVUb1NlYXJjaEluICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGxldCB2YWwgPSB0aGlzLmZpbmRJbkVudW1zKFxuICAgICAgICAgICAgICAgICAgICBmaWxlVG9TZWFyY2hJbixcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGFWYXJpYWJsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlc0F0dHJpYnV0ZXNbMV1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuZmluZEluQ2xhc3NlcyhcbiAgICAgICAgICAgICAgICAgICAgZmlsZVRvU2VhcmNoSW4sXG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhVmFyaWFibGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXNBdHRyaWJ1dGVzWzFdXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW1wb3J0c1V0aWwuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==