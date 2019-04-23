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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2ltcG9ydHMudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUE2QjtBQUU3QiwrQ0FBeUU7QUFFekUsSUFBTSxHQUFHLEdBQUcsSUFBSSx1QkFBRyxFQUFFLENBQUM7QUFFdEI7SUFFSTtJQUF1QixDQUFDO0lBQ1YsdUJBQVcsR0FBekI7UUFDSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUN2QixXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7U0FDNUM7UUFDRCxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFDaEMsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0ssaUNBQVcsR0FBbkIsVUFBb0IsT0FBTyxFQUFFLFlBQW9CLEVBQUUsYUFBcUI7UUFDcEUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDYixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxZQUFZLEVBQUU7Z0JBQzlCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDO29CQUNULElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLGFBQWEsRUFBRTt3QkFDL0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDdEI7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7YUFDTjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxtQ0FBYSxHQUFy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QUMsYUFBYSxDQUNwQixjQUFjLEVBQ2Qsb0JBQW9CLEVBQ3BCLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUN6QixDQUFDO2dCQUNGLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtvQkFDWixPQUFPLEdBQUcsQ0FBQztpQkFDZDthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQUFDLEFBamJELElBaWJDO0FBamJZLGtDQUFXO0FBbWJ4QixrQkFBZSxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgQXN0LCB7IHRzLCBQcm9wZXJ0eURlY2xhcmF0aW9uLCBTeW50YXhLaW5kIH0gZnJvbSAndHMtc2ltcGxlLWFzdCc7XG5cbmNvbnN0IGFzdCA9IG5ldyBBc3QoKTtcblxuZXhwb3J0IGNsYXNzIEltcG9ydHNVdGlsIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogSW1wb3J0c1V0aWw7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFJbXBvcnRzVXRpbC5pbnN0YW5jZSkge1xuICAgICAgICAgICAgSW1wb3J0c1V0aWwuaW5zdGFuY2UgPSBuZXcgSW1wb3J0c1V0aWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSW1wb3J0c1V0aWwuaW5zdGFuY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgZm9yIGEgc291cmNlRmlsZSBhIHZhcmlhYmxlIHZhbHVlIGluIGEgbG9jYWwgZW51bVxuICAgICAqIEBwYXJhbSBzcmNGaWxlXG4gICAgICogQHBhcmFtIHZhcmlhYmxlTmFtZVxuICAgICAqIEBwYXJhbSB2YXJpYWJsZVZhbHVlXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaW5kSW5FbnVtcyhzcmNGaWxlLCB2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFyaWFibGVWYWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCByZXMgPSAnJztcbiAgICAgICAgc3JjRmlsZS5nZXRFbnVtKGUgPT4ge1xuICAgICAgICAgICAgaWYgKGUuZ2V0TmFtZSgpID09PSB2YXJpYWJsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBlLmdldE1lbWJlcihtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG0uZ2V0TmFtZSgpID09PSB2YXJpYWJsZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBtLmdldFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBmb3IgYSBzb3VyY2VGaWxlIGEgdmFyaWFibGUgdmFsdWUgaW4gYSBsb2NhbCBzdGF0aWMgY2xhc3NcbiAgICAgKiBAcGFyYW0gc3JjRmlsZVxuICAgICAqIEBwYXJhbSB2YXJpYWJsZU5hbWVcbiAgICAgKiBAcGFyYW0gdmFyaWFibGVWYWx1ZVxuICAgICAqL1xuICAgIHByaXZhdGUgZmluZEluQ2xhc3NlcyhzcmNGaWxlLCB2YXJpYWJsZU5hbWU6IHN0cmluZywgdmFyaWFibGVWYWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCByZXMgPSAnJztcbiAgICAgICAgc3JjRmlsZS5nZXRDbGFzcyhjID0+IHtcbiAgICAgICAgICAgIGxldCBzdGF0aWNQcm9wZXJ0eTogUHJvcGVydHlEZWNsYXJhdGlvbiA9IGMuZ2V0U3RhdGljUHJvcGVydHkodmFyaWFibGVWYWx1ZSk7XG4gICAgICAgICAgICBpZiAoc3RhdGljUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGljUHJvcGVydHkuZ2V0SW5pdGlhbGl6ZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXMgPSBzdGF0aWNQcm9wZXJ0eS5nZXRJbml0aWFsaXplcigpLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgYSB2YWx1ZSBpbiBhIGxvY2FsIHZhcmlhYmxlIGRlY2xhcmF0aW9uIGxpa2UgYW4gb2JqZWN0XG4gICAgICogQHBhcmFtIHZhcmlhYmxlRGVjbGFyYXRpb25cbiAgICAgKiBAcGFyYW0gdmFyaWFibGVzQXR0cmlidXRlc1xuICAgICAqL1xuICAgIHByaXZhdGUgZmluZEluT2JqZWN0VmFyaWFibGVEZWNsYXJhdGlvbih2YXJpYWJsZURlY2xhcmF0aW9uLCB2YXJpYWJsZXNBdHRyaWJ1dGVzKSB7XG4gICAgICAgIGxldCB2YXJpYWJsZUtpbmQgPSB2YXJpYWJsZURlY2xhcmF0aW9uLmdldEtpbmQoKTtcbiAgICAgICAgaWYgKHZhcmlhYmxlS2luZCAmJiB2YXJpYWJsZUtpbmQgPT09IFN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgbGV0IGluaXRpYWxpemVyID0gdmFyaWFibGVEZWNsYXJhdGlvbi5nZXRJbml0aWFsaXplcigpO1xuICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluaXRpYWxpemVyS2luZCA9IGluaXRpYWxpemVyLmdldEtpbmQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6ZXJLaW5kICYmIGluaXRpYWxpemVyS2luZCA9PT0gU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcGlsZXJOb2RlID0gaW5pdGlhbGl6ZXIuY29tcGlsZXJOb2RlIGFzIHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxWYWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZXN0cmluZyBmcm9tIEFWQVIuQlZBUi50aGVzdHJpbmcgaW5zaWRlIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvb3BQcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWFibGVzQXR0cmlidXRlc1tkZXB0aCArIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcC5uYW1lLmdldFRleHQoKSA9PT0gdmFyaWFibGVzQXR0cmlidXRlc1tkZXB0aCArIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AuaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AuaW5pdGlhbGl6ZXIucHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwdGggKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb3BQcm9wZXJ0aWVzKHByb3AuaW5pdGlhbGl6ZXIucHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFZhbHVlID0gcHJvcC5pbml0aWFsaXplci50ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxWYWx1ZSA9IHByb3AuaW5pdGlhbGl6ZXIudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbG9vcFByb3BlcnRpZXMoY29tcGlsZXJOb2RlLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmluYWxWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGluIGltcG9ydHMgc29tZXRoaW5nIGxpa2UgbXl2YXJcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGlucHV0VmFyaWFibGVOYW1lICAgICAgICAgICAgICBsaWtlIG15dmFyXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXl2YXIgdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZFZhbHVlSW5JbXBvcnRPckxvY2FsVmFyaWFibGVzKGlucHV0VmFyaWFibGVOYW1lOiBzdHJpbmcsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgICAgICAgbGV0IG1ldGFkYXRhVmFyaWFibGVOYW1lID0gaW5wdXRWYXJpYWJsZU5hbWUsXG4gICAgICAgICAgICBzZWFyY2hlZEltcG9ydCxcbiAgICAgICAgICAgIGFsaWFzT3JpZ2luYWxOYW1lID0gJycsXG4gICAgICAgICAgICBmb3VuZFdpdGhBbGlhcyA9IGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGZpbGUgPVxuICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGUuZmlsZU5hbWUpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgID8gYXN0LmdldFNvdXJjZUZpbGUoc291cmNlRmlsZS5maWxlTmFtZSlcbiAgICAgICAgICAgICAgICA6IGFzdC5hZGRFeGlzdGluZ1NvdXJjZUZpbGVJZkV4aXN0cyhzb3VyY2VGaWxlLmZpbGVOYW1lKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICBjb25zdCBpbXBvcnRzID0gZmlsZS5nZXRJbXBvcnREZWNsYXJhdGlvbnMoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9vcCB0aHJvdWdoIGFsbCBpbXBvcnRzLCBhbmQgZmluZCBvbmUgbWF0Y2hpbmcgaW5wdXRWYXJpYWJsZU5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGltcG9ydHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lZEltcG9ydHMgPSBpLmdldE5hbWVkSW1wb3J0cygpLFxuICAgICAgICAgICAgICAgIG5hbWVkSW1wb3J0c0xlbmd0aCA9IG5hbWVkSW1wb3J0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgICAgIGlmIChuYW1lZEltcG9ydHNMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqOyBqIDwgbmFtZWRJbXBvcnRzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydE5hbWUgPSBuYW1lZEltcG9ydHNbal0uZ2V0TmFtZU5vZGUoKS5nZXRUZXh0KCkgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXM7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c1tqXS5nZXRBbGlhc0lkZW50aWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXMgPSBuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnROYW1lID09PSBtZXRhZGF0YVZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydEFsaWFzID09PSBtZXRhZGF0YVZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSBpbXBvcnROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhc0ZvdW5kVmFsdWVzKHZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIGxldCB2YXJpYWJsZUtpbmQgPSB2YXJpYWJsZURlY2xhcmF0aW9uLmdldEtpbmQoKTtcblxuICAgICAgICAgICAgaWYgKHZhcmlhYmxlS2luZCAmJiB2YXJpYWJsZUtpbmQgPT09IFN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGxldCBpbml0aWFsaXplciA9IHZhcmlhYmxlRGVjbGFyYXRpb24uZ2V0SW5pdGlhbGl6ZXIoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluaXRpYWxpemVyS2luZCA9IGluaXRpYWxpemVyLmdldEtpbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyS2luZCAmJiBpbml0aWFsaXplcktpbmQgPT09IFN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21waWxlck5vZGUgPSBpbml0aWFsaXplci5jb21waWxlck5vZGUgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb247XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGlsZXJOb2RlLnByb3BlcnRpZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHNlYXJjaGVkSW1wb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGV0IGltcG9ydFBhdGhSZWZlcmVuY2UgPSBzZWFyY2hlZEltcG9ydC5nZXRNb2R1bGVTcGVjaWZpZXJTb3VyY2VGaWxlKCk7XG4gICAgICAgICAgICBsZXQgaW1wb3J0UGF0aDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0UGF0aFJlZmVyZW5jZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBpbXBvcnRQYXRoID0gaW1wb3J0UGF0aFJlZmVyZW5jZS5jb21waWxlck5vZGUuZmlsZU5hbWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VGaWxlSW1wb3J0ID1cbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKGltcG9ydFBhdGgpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBhc3QuZ2V0U291cmNlRmlsZShpbXBvcnRQYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlSWZFeGlzdHMoaW1wb3J0UGF0aCk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcblxuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VGaWxlSW1wb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YXJpYWJsZU5hbWUgPSBmb3VuZFdpdGhBbGlhcyA/IGFsaWFzT3JpZ2luYWxOYW1lIDogbWV0YWRhdGFWYXJpYWJsZU5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YXJpYWJsZURlY2xhcmF0aW9uID0gc291cmNlRmlsZUltcG9ydC5nZXRWYXJpYWJsZURlY2xhcmF0aW9uKHZhcmlhYmxlTmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYXNGb3VuZFZhbHVlcyh2YXJpYWJsZURlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyeSB3aXRoIGV4cG9ydHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cG9ydERlY2xhcmF0aW9ucyA9IHNvdXJjZUZpbGVJbXBvcnQuZ2V0RXhwb3J0RGVjbGFyYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhwb3J0RGVjbGFyYXRpb25zICYmIGV4cG9ydERlY2xhcmF0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW4gPSBleHBvcnREZWNsYXJhdGlvbnMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBleHBvcnREZWNsYXJhdGlvbiA9IGV4cG9ydERlY2xhcmF0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNvdXJjZUZpbGVFeHBvcnRlZFJlZmVyZW5jZSA9IGV4cG9ydERlY2xhcmF0aW9uLmdldE1vZHVsZVNwZWNpZmllclNvdXJjZUZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZUZpbGVFeHBvcnRlZFJlZmVyZW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNvdXJjZUZpbGVFeHBvcnRlZFJlZmVyZW5jZVBhdGggPSBzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2UuZ2V0RmlsZVBhdGgoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc291cmNlRmlsZUV4cG9ydGVkID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgYXN0LmdldFNvdXJjZUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUZpbGVFeHBvcnRlZFJlZmVyZW5jZVBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGVFeHBvcnRlZFJlZmVyZW5jZVBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZUlmRXhpc3RzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlRXhwb3J0ZWRSZWZlcmVuY2VQYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZUZpbGVFeHBvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24gPSBzb3VyY2VGaWxlRXhwb3J0ZWQuZ2V0VmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWFibGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFzRm91bmRWYWx1ZXModmFyaWFibGVEZWNsYXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRmluZCBpbiBsb2NhbCB2YXJpYWJsZXMgb2YgdGhlIGZpbGVcbiAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlRGVjbGFyYXRpb24gPSBmaWxlLmdldFZhcmlhYmxlRGVjbGFyYXRpb24obWV0YWRhdGFWYXJpYWJsZU5hbWUpO1xuICAgICAgICAgICAgaWYgKHZhcmlhYmxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFyaWFibGVLaW5kID0gdmFyaWFibGVEZWNsYXJhdGlvbi5nZXRLaW5kKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFyaWFibGVLaW5kICYmIHZhcmlhYmxlS2luZCA9PT0gU3ludGF4S2luZC5WYXJpYWJsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbml0aWFsaXplciA9IHZhcmlhYmxlRGVjbGFyYXRpb24uZ2V0SW5pdGlhbGl6ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5pdGlhbGl6ZXJLaW5kID0gaW5pdGlhbGl6ZXIuZ2V0S2luZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVyS2luZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemVyS2luZCA9PT0gU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBpbGVyTm9kZSA9IGluaXRpYWxpemVyLmNvbXBpbGVyTm9kZSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGlsZXJOb2RlLnByb3BlcnRpZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluaXRpYWxpemVyS2luZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZURlY2xhcmF0aW9uLmNvbXBpbGVyTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RmlsZU5hbWVPZkltcG9ydCh2YXJpYWJsZU5hbWU6IHN0cmluZywgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgICAgICBjb25zdCBmaWxlID1cbiAgICAgICAgICAgIHR5cGVvZiBhc3QuZ2V0U291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGUuZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlKHNvdXJjZUZpbGUuZmlsZU5hbWUpOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgIGNvbnN0IGltcG9ydHMgPSBmaWxlLmdldEltcG9ydERlY2xhcmF0aW9ucygpO1xuICAgICAgICBsZXQgc2VhcmNoZWRJbXBvcnQsXG4gICAgICAgICAgICBhbGlhc09yaWdpbmFsTmFtZSA9ICcnLFxuICAgICAgICAgICAgZmluYWxQYXRoID0gJycsXG4gICAgICAgICAgICBmb3VuZFdpdGhBbGlhcyA9IGZhbHNlO1xuICAgICAgICBpbXBvcnRzLmZvckVhY2goaSA9PiB7XG4gICAgICAgICAgICBsZXQgbmFtZWRJbXBvcnRzID0gaS5nZXROYW1lZEltcG9ydHMoKSxcbiAgICAgICAgICAgICAgICBuYW1lZEltcG9ydHNMZW5ndGggPSBuYW1lZEltcG9ydHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGogPSAwO1xuXG4gICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAoajsgaiA8IG5hbWVkSW1wb3J0c0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnROYW1lID0gbmFtZWRJbXBvcnRzW2pdLmdldE5hbWVOb2RlKCkuZ2V0VGV4dCgpIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydEFsaWFzID0gbmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpLmdldFRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0TmFtZSA9PT0gdmFyaWFibGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0QWxpYXMgPT09IHZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSBpbXBvcnROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mIHNlYXJjaGVkSW1wb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGV0IGltcG9ydFBhdGggPSBwYXRoLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpICtcbiAgICAgICAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQuZ2V0TW9kdWxlU3BlY2lmaWVyVmFsdWUoKSArXG4gICAgICAgICAgICAgICAgICAgICcudHMnXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IGNsZWFuZXIgPSAocHJvY2Vzcy5jd2QoKSArIHBhdGguc2VwKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgICAgICBmaW5hbFBhdGggPSBpbXBvcnRQYXRoLnJlcGxhY2UoY2xlYW5lciwgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5hbFBhdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgZmlsZSBwYXRoIG9mIGltcG9ydGVkIHZhcmlhYmxlXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBpbnB1dFZhcmlhYmxlTmFtZSAgbGlrZSB0aGVzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICAgICB0aGVzdHJpbmcgZGVzdGluYXRpb24gcGF0aFxuICAgICAqL1xuICAgIHB1YmxpYyBmaW5kRmlsZVBhdGhPZkltcG9ydGVkVmFyaWFibGUoaW5wdXRWYXJpYWJsZU5hbWUsIHNvdXJjZUZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHNlYXJjaGVkSW1wb3J0LFxuICAgICAgICAgICAgZmluYWxQYXRoID0gJycsXG4gICAgICAgICAgICBhbGlhc09yaWdpbmFsTmFtZSA9ICcnLFxuICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZmlsZSA9XG4gICAgICAgICAgICB0eXBlb2YgYXN0LmdldFNvdXJjZUZpbGUoc291cmNlRmlsZVBhdGgpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgID8gYXN0LmdldFNvdXJjZUZpbGUoc291cmNlRmlsZVBhdGgpXG4gICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlKHNvdXJjZUZpbGVQYXRoKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICBjb25zdCBpbXBvcnRzID0gZmlsZS5nZXRJbXBvcnREZWNsYXJhdGlvbnMoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9vcCB0aHJvdWdoIGFsbCBpbXBvcnRzLCBhbmQgZmluZCBvbmUgbWF0Y2hpbmcgaW5wdXRWYXJpYWJsZU5hbWVcbiAgICAgICAgICovXG4gICAgICAgIGltcG9ydHMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lZEltcG9ydHMgPSBpLmdldE5hbWVkSW1wb3J0cygpLFxuICAgICAgICAgICAgICAgIG5hbWVkSW1wb3J0c0xlbmd0aCA9IG5hbWVkSW1wb3J0cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgICAgIGlmIChuYW1lZEltcG9ydHNMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqOyBqIDwgbmFtZWRJbXBvcnRzTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltcG9ydE5hbWUgPSBuYW1lZEltcG9ydHNbal0uZ2V0TmFtZU5vZGUoKS5nZXRUZXh0KCkgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXM7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c1tqXS5nZXRBbGlhc0lkZW50aWZpZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0QWxpYXMgPSBuYW1lZEltcG9ydHNbal0uZ2V0QWxpYXNJZGVudGlmaWVyKCkuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnROYW1lID09PSBpbnB1dFZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydEFsaWFzID09PSBpbnB1dFZhcmlhYmxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxpYXNPcmlnaW5hbE5hbWUgPSBpbXBvcnROYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodHlwZW9mIHNlYXJjaGVkSW1wb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZmluYWxQYXRoID0gcGF0aC5yZXNvbHZlKFxuICAgICAgICAgICAgICAgIHBhdGguZGlybmFtZShzb3VyY2VGaWxlUGF0aCkgK1xuICAgICAgICAgICAgICAgICAgICAnLycgK1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydC5nZXRNb2R1bGVTcGVjaWZpZXJWYWx1ZSgpICtcbiAgICAgICAgICAgICAgICAgICAgJy50cydcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbmFsUGF0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGluIGltcG9ydHMgc29tZXRoaW5nIGxpa2UgVkFSLkFWQVIuQlZBUi50aGVzdHJpbmdcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGlucHV0VmFyaWFibGVOYW1lICAgICAgICAgICAgICAgICAgIGxpa2UgVkFSLkFWQVIuQlZBUi50aGVzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVzdHJpbmcgdmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluZFByb3BlcnR5VmFsdWVJbkltcG9ydE9yTG9jYWxWYXJpYWJsZXMoaW5wdXRWYXJpYWJsZU5hbWUsIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgICAgICAgbGV0IHZhcmlhYmxlc0F0dHJpYnV0ZXMgPSBpbnB1dFZhcmlhYmxlTmFtZS5zcGxpdCgnLicpLFxuICAgICAgICAgICAgbWV0YWRhdGFWYXJpYWJsZU5hbWUgPSB2YXJpYWJsZXNBdHRyaWJ1dGVzWzBdLFxuICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQsXG4gICAgICAgICAgICBhbGlhc09yaWdpbmFsTmFtZSA9ICcnLFxuICAgICAgICAgICAgZm91bmRXaXRoQWxpYXMgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBmaWxlID1cbiAgICAgICAgICAgIHR5cGVvZiBhc3QuZ2V0U291cmNlRmlsZShzb3VyY2VGaWxlLmZpbGVOYW1lKSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKHNvdXJjZUZpbGUuZmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgOiBhc3QuYWRkRXhpc3RpbmdTb3VyY2VGaWxlKHNvdXJjZUZpbGUuZmlsZU5hbWUpOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gICAgICAgIGNvbnN0IGltcG9ydHMgPSBmaWxlLmdldEltcG9ydERlY2xhcmF0aW9ucygpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb29wIHRocm91Z2ggYWxsIGltcG9ydHMsIGFuZCBmaW5kIG9uZSBtYXRjaGluZyBpbnB1dFZhcmlhYmxlTmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgaW1wb3J0cy5mb3JFYWNoKGkgPT4ge1xuICAgICAgICAgICAgbGV0IG5hbWVkSW1wb3J0cyA9IGkuZ2V0TmFtZWRJbXBvcnRzKCksXG4gICAgICAgICAgICAgICAgbmFtZWRJbXBvcnRzTGVuZ3RoID0gbmFtZWRJbXBvcnRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBqID0gMDtcblxuICAgICAgICAgICAgaWYgKG5hbWVkSW1wb3J0c0xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGo7IGogPCBuYW1lZEltcG9ydHNMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1wb3J0TmFtZSA9IG5hbWVkSW1wb3J0c1tqXS5nZXROYW1lTm9kZSgpLmdldFRleHQoKSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRBbGlhcztcblxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZWRJbXBvcnRzW2pdLmdldEFsaWFzSWRlbnRpZmllcigpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRBbGlhcyA9IG5hbWVkSW1wb3J0c1tqXS5nZXRBbGlhc0lkZW50aWZpZXIoKS5nZXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcG9ydE5hbWUgPT09IG1ldGFkYXRhVmFyaWFibGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0QWxpYXMgPT09IG1ldGFkYXRhVmFyaWFibGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZFdpdGhBbGlhcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlhc09yaWdpbmFsTmFtZSA9IGltcG9ydE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hlZEltcG9ydCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGZpbGVUb1NlYXJjaEluLCB2YXJpYWJsZURlY2xhcmF0aW9uO1xuICAgICAgICBpZiAodHlwZW9mIHNlYXJjaGVkSW1wb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbGV0IGltcG9ydFBhdGggPSBwYXRoLnJlc29sdmUoXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHNvdXJjZUZpbGUuZmlsZU5hbWUpICtcbiAgICAgICAgICAgICAgICAgICAgJy8nICtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoZWRJbXBvcnQuZ2V0TW9kdWxlU3BlY2lmaWVyVmFsdWUoKSArXG4gICAgICAgICAgICAgICAgICAgICcudHMnXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlRmlsZUltcG9ydCA9XG4gICAgICAgICAgICAgICAgdHlwZW9mIGFzdC5nZXRTb3VyY2VGaWxlKGltcG9ydFBhdGgpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgICAgICA/IGFzdC5nZXRTb3VyY2VGaWxlKGltcG9ydFBhdGgpXG4gICAgICAgICAgICAgICAgICAgIDogYXN0LmFkZEV4aXN0aW5nU291cmNlRmlsZShpbXBvcnRQYXRoKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuICAgICAgICAgICAgaWYgKHNvdXJjZUZpbGVJbXBvcnQpIHtcbiAgICAgICAgICAgICAgICBmaWxlVG9TZWFyY2hJbiA9IHNvdXJjZUZpbGVJbXBvcnQ7XG4gICAgICAgICAgICAgICAgbGV0IHZhcmlhYmxlTmFtZSA9IGZvdW5kV2l0aEFsaWFzID8gYWxpYXNPcmlnaW5hbE5hbWUgOiBtZXRhZGF0YVZhcmlhYmxlTmFtZTtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZURlY2xhcmF0aW9uID0gZmlsZVRvU2VhcmNoSW4uZ2V0VmFyaWFibGVEZWNsYXJhdGlvbih2YXJpYWJsZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsZVRvU2VhcmNoSW4gPSBmaWxlO1xuICAgICAgICAgICAgLy8gRmluZCBpbiBsb2NhbCB2YXJpYWJsZXMgb2YgdGhlIGZpbGVcbiAgICAgICAgICAgIHZhcmlhYmxlRGVjbGFyYXRpb24gPSBmaWxlVG9TZWFyY2hJbi5nZXRWYXJpYWJsZURlY2xhcmF0aW9uKG1ldGFkYXRhVmFyaWFibGVOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJpYWJsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5kSW5PYmplY3RWYXJpYWJsZURlY2xhcmF0aW9uKHZhcmlhYmxlRGVjbGFyYXRpb24sIHZhcmlhYmxlc0F0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyeSBmaW5kIGl0IGluIGVudW1zXG4gICAgICAgIGlmICh2YXJpYWJsZXNBdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsZVRvU2VhcmNoSW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IHRoaXMuZmluZEluRW51bXMoXG4gICAgICAgICAgICAgICAgICAgIGZpbGVUb1NlYXJjaEluLFxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YVZhcmlhYmxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzQXR0cmlidXRlc1sxXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy5maW5kSW5DbGFzc2VzKFxuICAgICAgICAgICAgICAgICAgICBmaWxlVG9TZWFyY2hJbixcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGFWYXJpYWJsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlc0F0dHJpYnV0ZXNbMV1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICh2YWwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbXBvcnRzVXRpbC5nZXRJbnN0YW5jZSgpO1xuIl19