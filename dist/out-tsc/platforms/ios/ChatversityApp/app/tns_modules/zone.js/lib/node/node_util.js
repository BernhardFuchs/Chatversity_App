"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
Zone.__load_patch('node_util', function (global, Zone, api) {
    api.patchOnProperties = utils_1.patchOnProperties;
    api.patchMethod = utils_1.patchMethod;
    api.bindArguments = utils_1.bindArguments;
    utils_1.setShouldCopySymbolProperties(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvbm9kZS9ub2RlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx5Q0FBNkc7QUFFN0csSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCO0lBQzVFLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyx5QkFBaUIsQ0FBQztJQUMxQyxHQUFHLENBQUMsV0FBVyxHQUFHLG1CQUFXLENBQUM7SUFDOUIsR0FBRyxDQUFDLGFBQWEsR0FBRyxxQkFBYSxDQUFDO0lBQ2xDLHFDQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2JpbmRBcmd1bWVudHMsIHBhdGNoTWV0aG9kLCBwYXRjaE9uUHJvcGVydGllcywgc2V0U2hvdWxkQ29weVN5bWJvbFByb3BlcnRpZXN9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdub2RlX3V0aWwnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBhcGkucGF0Y2hPblByb3BlcnRpZXMgPSBwYXRjaE9uUHJvcGVydGllcztcbiAgYXBpLnBhdGNoTWV0aG9kID0gcGF0Y2hNZXRob2Q7XG4gIGFwaS5iaW5kQXJndW1lbnRzID0gYmluZEFyZ3VtZW50cztcbiAgc2V0U2hvdWxkQ29weVN5bWJvbFByb3BlcnRpZXModHJ1ZSk7XG59KTtcbiJdfQ==