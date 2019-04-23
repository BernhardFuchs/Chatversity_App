"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var _ = require("lodash");
var break_comma_helper_1 = require("./html-engine-helpers/break-comma.helper");
var break_lines_helper_1 = require("./html-engine-helpers/break-lines.helper");
var clean_paragraph_helper_1 = require("./html-engine-helpers/clean-paragraph.helper");
var compare_helper_1 = require("./html-engine-helpers/compare.helper");
var debug_helper_1 = require("./html-engine-helpers/debug.helper");
var element_alone_helper_1 = require("./html-engine-helpers/element-alone.helper");
var escape_simple_quote_helper_1 = require("./html-engine-helpers/escape-simple-quote.helper");
var filter_angular2_modules_helper_1 = require("./html-engine-helpers/filter-angular2-modules.helper");
var function_signature_helper_1 = require("./html-engine-helpers/function-signature.helper");
var has_own_helper_1 = require("./html-engine-helpers/has-own.helper");
var i18n_helper_1 = require("./html-engine-helpers/i18n.helper");
var if_string_helper_1 = require("./html-engine-helpers/if-string.helper");
var indexable_signature_helper_1 = require("./html-engine-helpers/indexable-signature.helper");
var is_initial_tab_helper_1 = require("./html-engine-helpers/is-initial-tab.helper");
var is_not_toggle_helper_1 = require("./html-engine-helpers/is-not-toggle.helper");
var is_tab_enabled_helper_1 = require("./html-engine-helpers/is-tab-enabled.helper");
var jsdoc_code_example_helper_1 = require("./html-engine-helpers/jsdoc-code-example.helper");
var jsdoc_default_helper_1 = require("./html-engine-helpers/jsdoc-default.helper");
var jsdoc_example_helper_1 = require("./html-engine-helpers/jsdoc-example.helper");
var jsdoc_params_valid_helper_1 = require("./html-engine-helpers/jsdoc-params-valid.helper");
var jsdoc_params_helper_1 = require("./html-engine-helpers/jsdoc-params.helper");
var jsdoc_returns_comment_helper_1 = require("./html-engine-helpers/jsdoc-returns-comment.helper");
var link_type_helper_1 = require("./html-engine-helpers/link-type.helper");
var modif_icon_helper_1 = require("./html-engine-helpers/modif-icon.helper");
var modif_kind_helper_1 = require("./html-engine-helpers/modif-kind-helper");
var object_length_helper_1 = require("./html-engine-helpers/object-length.helper");
var object_helper_1 = require("./html-engine-helpers/object.helper");
var one_parameter_has_helper_1 = require("./html-engine-helpers/one-parameter-has.helper");
var or_length_helper_1 = require("./html-engine-helpers/or-length.helper");
var or_helper_1 = require("./html-engine-helpers/or.helper");
var parse_description_helper_1 = require("./html-engine-helpers/parse-description.helper");
var relative_url_helper_1 = require("./html-engine-helpers/relative-url.helper");
var short_url_helper_1 = require("./html-engine-helpers/short-url.helper");
var strip_url_helper_1 = require("./html-engine-helpers/strip-url.helper");
var HtmlEngineHelpers = /** @class */ (function () {
    function HtmlEngineHelpers() {
    }
    HtmlEngineHelpers.prototype.registerHelpers = function (bars) {
        this.registerHelper(bars, 'compare', new compare_helper_1.CompareHelper());
        this.registerHelper(bars, 'or', new or_helper_1.OrHelper());
        this.registerHelper(bars, 'functionSignature', new function_signature_helper_1.FunctionSignatureHelper());
        this.registerHelper(bars, 'isNotToggle', new is_not_toggle_helper_1.IsNotToggleHelper());
        this.registerHelper(bars, 'isInitialTab', new is_initial_tab_helper_1.IsInitialTabHelper());
        this.registerHelper(bars, 'isTabEnabled', new is_tab_enabled_helper_1.IsTabEnabledHelper());
        this.registerHelper(bars, 'ifString', new if_string_helper_1.IfStringHelper());
        this.registerHelper(bars, 'orLength', new or_length_helper_1.OrLengthHelper());
        this.registerHelper(bars, 'filterAngular2Modules', new filter_angular2_modules_helper_1.FilterAngular2ModulesHelper());
        this.registerHelper(bars, 'debug', new debug_helper_1.DebugHelper());
        this.registerHelper(bars, 'breaklines', new break_lines_helper_1.BreakLinesHelper(bars));
        this.registerHelper(bars, 'clean-paragraph', new clean_paragraph_helper_1.CleanParagraphHelper());
        this.registerHelper(bars, 'escapeSimpleQuote', new escape_simple_quote_helper_1.EscapeSimpleQuoteHelper());
        this.registerHelper(bars, 'breakComma', new break_comma_helper_1.BreakCommaHelper(bars));
        this.registerHelper(bars, 'modifKind', new modif_kind_helper_1.ModifKindHelper());
        this.registerHelper(bars, 'modifIcon', new modif_icon_helper_1.ModifIconHelper());
        this.registerHelper(bars, 'relativeURL', new relative_url_helper_1.RelativeURLHelper());
        this.registerHelper(bars, 'jsdoc-returns-comment', new jsdoc_returns_comment_helper_1.JsdocReturnsCommentHelper());
        this.registerHelper(bars, 'jsdoc-code-example', new jsdoc_code_example_helper_1.JsdocCodeExampleHelper());
        this.registerHelper(bars, 'jsdoc-example', new jsdoc_example_helper_1.JsdocExampleHelper());
        this.registerHelper(bars, 'jsdoc-params', new jsdoc_params_helper_1.JsdocParamsHelper());
        this.registerHelper(bars, 'jsdoc-params-valid', new jsdoc_params_valid_helper_1.JsdocParamsValidHelper());
        this.registerHelper(bars, 'jsdoc-default', new jsdoc_default_helper_1.JsdocDefaultHelper());
        this.registerHelper(bars, 'linkType', new link_type_helper_1.LinkTypeHelper());
        this.registerHelper(bars, 'indexableSignature', new indexable_signature_helper_1.IndexableSignatureHelper());
        this.registerHelper(bars, 'object', new object_helper_1.ObjectHelper());
        this.registerHelper(bars, 'objectLength', new object_length_helper_1.ObjectLengthHelper());
        this.registerHelper(bars, 'parseDescription', new parse_description_helper_1.ParseDescriptionHelper());
        this.registerHelper(bars, 'one-parameter-has', new one_parameter_has_helper_1.OneParameterHasHelper());
        this.registerHelper(bars, 'element-alone', new element_alone_helper_1.ElementAloneHelper());
        this.registerHelper(bars, 'hasOwn', new has_own_helper_1.HasOwnHelper());
        this.registerHelper(bars, 'short-url', new short_url_helper_1.ShortURLHelper());
        this.registerHelper(bars, 'strip-url', new strip_url_helper_1.StripURLHelper());
        this.registerHelper(bars, 't', new i18n_helper_1.I18nHelper());
    };
    HtmlEngineHelpers.prototype.registerHelper = function (bars, key, helper) {
        Handlebars.registerHelper(key, function () {
            // tslint:disable-next-line:no-invalid-this
            return helper.helperFunc.apply(helper, [this].concat(_.slice(arguments)));
        });
    };
    return HtmlEngineHelpers;
}());
exports.HtmlEngineHelpers = HtmlEngineHelpers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5lbmdpbmUuaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLmVuZ2luZS5oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXlDO0FBQ3pDLDBCQUE0QjtBQUU1QiwrRUFBNEU7QUFDNUUsK0VBQTRFO0FBQzVFLHVGQUFvRjtBQUNwRix1RUFBcUU7QUFDckUsbUVBQWlFO0FBQ2pFLG1GQUFnRjtBQUNoRiwrRkFBMkY7QUFDM0YsdUdBQW1HO0FBQ25HLDZGQUEwRjtBQUMxRix1RUFBb0U7QUFFcEUsaUVBQStEO0FBQy9ELDJFQUF3RTtBQUN4RSwrRkFBNEY7QUFDNUYscUZBQWlGO0FBQ2pGLG1GQUErRTtBQUMvRSxxRkFBaUY7QUFDakYsNkZBQXlGO0FBQ3pGLG1GQUFnRjtBQUNoRixtRkFBZ0Y7QUFDaEYsNkZBQXlGO0FBQ3pGLGlGQUE4RTtBQUM5RSxtR0FBK0Y7QUFDL0YsMkVBQXdFO0FBQ3hFLDZFQUEwRTtBQUMxRSw2RUFBMEU7QUFDMUUsbUZBQWdGO0FBQ2hGLHFFQUFtRTtBQUNuRSwyRkFBdUY7QUFDdkYsMkVBQXdFO0FBQ3hFLDZEQUEyRDtBQUMzRCwyRkFBd0Y7QUFDeEYsaUZBQThFO0FBQzlFLDJFQUF3RTtBQUN4RSwyRUFBd0U7QUFFeEU7SUFBQTtJQTRDQSxDQUFDO0lBM0NVLDJDQUFlLEdBQXRCLFVBQXVCLElBQUk7UUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksOEJBQWEsRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVB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c0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSGFuZGxlYmFycyBmcm9tICdoYW5kbGViYXJzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHsgQnJlYWtDb21tYUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9icmVhay1jb21tYS5oZWxwZXInO1xuaW1wb3J0IHsgQnJlYWtMaW5lc0hlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9icmVhay1saW5lcy5oZWxwZXInO1xuaW1wb3J0IHsgQ2xlYW5QYXJhZ3JhcGhIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvY2xlYW4tcGFyYWdyYXBoLmhlbHBlcic7XG5pbXBvcnQgeyBDb21wYXJlSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL2NvbXBhcmUuaGVscGVyJztcbmltcG9ydCB7IERlYnVnSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL2RlYnVnLmhlbHBlcic7XG5pbXBvcnQgeyBFbGVtZW50QWxvbmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvZWxlbWVudC1hbG9uZS5oZWxwZXInO1xuaW1wb3J0IHsgRXNjYXBlU2ltcGxlUXVvdGVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvZXNjYXBlLXNpbXBsZS1xdW90ZS5oZWxwZXInO1xuaW1wb3J0IHsgRmlsdGVyQW5ndWxhcjJNb2R1bGVzSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL2ZpbHRlci1hbmd1bGFyMi1tb2R1bGVzLmhlbHBlcic7XG5pbXBvcnQgeyBGdW5jdGlvblNpZ25hdHVyZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9mdW5jdGlvbi1zaWduYXR1cmUuaGVscGVyJztcbmltcG9ydCB7IEhhc093bkhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9oYXMtb3duLmhlbHBlcic7XG5pbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEkxOG5IZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvaTE4bi5oZWxwZXInO1xuaW1wb3J0IHsgSWZTdHJpbmdIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvaWYtc3RyaW5nLmhlbHBlcic7XG5pbXBvcnQgeyBJbmRleGFibGVTaWduYXR1cmVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvaW5kZXhhYmxlLXNpZ25hdHVyZS5oZWxwZXInO1xuaW1wb3J0IHsgSXNJbml0aWFsVGFiSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL2lzLWluaXRpYWwtdGFiLmhlbHBlcic7XG5pbXBvcnQgeyBJc05vdFRvZ2dsZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9pcy1ub3QtdG9nZ2xlLmhlbHBlcic7XG5pbXBvcnQgeyBJc1RhYkVuYWJsZWRIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvaXMtdGFiLWVuYWJsZWQuaGVscGVyJztcbmltcG9ydCB7IEpzZG9jQ29kZUV4YW1wbGVIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvanNkb2MtY29kZS1leGFtcGxlLmhlbHBlcic7XG5pbXBvcnQgeyBKc2RvY0RlZmF1bHRIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvanNkb2MtZGVmYXVsdC5oZWxwZXInO1xuaW1wb3J0IHsgSnNkb2NFeGFtcGxlSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL2pzZG9jLWV4YW1wbGUuaGVscGVyJztcbmltcG9ydCB7IEpzZG9jUGFyYW1zVmFsaWRIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvanNkb2MtcGFyYW1zLXZhbGlkLmhlbHBlcic7XG5pbXBvcnQgeyBKc2RvY1BhcmFtc0hlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9qc2RvYy1wYXJhbXMuaGVscGVyJztcbmltcG9ydCB7IEpzZG9jUmV0dXJuc0NvbW1lbnRIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvanNkb2MtcmV0dXJucy1jb21tZW50LmhlbHBlcic7XG5pbXBvcnQgeyBMaW5rVHlwZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9saW5rLXR5cGUuaGVscGVyJztcbmltcG9ydCB7IE1vZGlmSWNvbkhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9tb2RpZi1pY29uLmhlbHBlcic7XG5pbXBvcnQgeyBNb2RpZktpbmRIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvbW9kaWYta2luZC1oZWxwZXInO1xuaW1wb3J0IHsgT2JqZWN0TGVuZ3RoSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL29iamVjdC1sZW5ndGguaGVscGVyJztcbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9vYmplY3QuaGVscGVyJztcbmltcG9ydCB7IE9uZVBhcmFtZXRlckhhc0hlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9vbmUtcGFyYW1ldGVyLWhhcy5oZWxwZXInO1xuaW1wb3J0IHsgT3JMZW5ndGhIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvb3ItbGVuZ3RoLmhlbHBlcic7XG5pbXBvcnQgeyBPckhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9vci5oZWxwZXInO1xuaW1wb3J0IHsgUGFyc2VEZXNjcmlwdGlvbkhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9wYXJzZS1kZXNjcmlwdGlvbi5oZWxwZXInO1xuaW1wb3J0IHsgUmVsYXRpdmVVUkxIZWxwZXIgfSBmcm9tICcuL2h0bWwtZW5naW5lLWhlbHBlcnMvcmVsYXRpdmUtdXJsLmhlbHBlcic7XG5pbXBvcnQgeyBTaG9ydFVSTEhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVycy9zaG9ydC11cmwuaGVscGVyJztcbmltcG9ydCB7IFN0cmlwVVJMSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXJzL3N0cmlwLXVybC5oZWxwZXInO1xuXG5leHBvcnQgY2xhc3MgSHRtbEVuZ2luZUhlbHBlcnMge1xuICAgIHB1YmxpYyByZWdpc3RlckhlbHBlcnMoYmFycyk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdjb21wYXJlJywgbmV3IENvbXBhcmVIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ29yJywgbmV3IE9ySGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdmdW5jdGlvblNpZ25hdHVyZScsIG5ldyBGdW5jdGlvblNpZ25hdHVyZUhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnaXNOb3RUb2dnbGUnLCBuZXcgSXNOb3RUb2dnbGVIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2lzSW5pdGlhbFRhYicsIG5ldyBJc0luaXRpYWxUYWJIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2lzVGFiRW5hYmxlZCcsIG5ldyBJc1RhYkVuYWJsZWRIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2lmU3RyaW5nJywgbmV3IElmU3RyaW5nSGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdvckxlbmd0aCcsIG5ldyBPckxlbmd0aEhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnZmlsdGVyQW5ndWxhcjJNb2R1bGVzJywgbmV3IEZpbHRlckFuZ3VsYXIyTW9kdWxlc0hlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnZGVidWcnLCBuZXcgRGVidWdIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2JyZWFrbGluZXMnLCBuZXcgQnJlYWtMaW5lc0hlbHBlcihiYXJzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2NsZWFuLXBhcmFncmFwaCcsIG5ldyBDbGVhblBhcmFncmFwaEhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnZXNjYXBlU2ltcGxlUXVvdGUnLCBuZXcgRXNjYXBlU2ltcGxlUXVvdGVIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2JyZWFrQ29tbWEnLCBuZXcgQnJlYWtDb21tYUhlbHBlcihiYXJzKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ21vZGlmS2luZCcsIG5ldyBNb2RpZktpbmRIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ21vZGlmSWNvbicsIG5ldyBNb2RpZkljb25IZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ3JlbGF0aXZlVVJMJywgbmV3IFJlbGF0aXZlVVJMSGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdqc2RvYy1yZXR1cm5zLWNvbW1lbnQnLCBuZXcgSnNkb2NSZXR1cm5zQ29tbWVudEhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnanNkb2MtY29kZS1leGFtcGxlJywgbmV3IEpzZG9jQ29kZUV4YW1wbGVIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2pzZG9jLWV4YW1wbGUnLCBuZXcgSnNkb2NFeGFtcGxlSGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdqc2RvYy1wYXJhbXMnLCBuZXcgSnNkb2NQYXJhbXNIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2pzZG9jLXBhcmFtcy12YWxpZCcsIG5ldyBKc2RvY1BhcmFtc1ZhbGlkSGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdqc2RvYy1kZWZhdWx0JywgbmV3IEpzZG9jRGVmYXVsdEhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnbGlua1R5cGUnLCBuZXcgTGlua1R5cGVIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ2luZGV4YWJsZVNpZ25hdHVyZScsIG5ldyBJbmRleGFibGVTaWduYXR1cmVIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ29iamVjdCcsIG5ldyBPYmplY3RIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ29iamVjdExlbmd0aCcsIG5ldyBPYmplY3RMZW5ndGhIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ3BhcnNlRGVzY3JpcHRpb24nLCBuZXcgUGFyc2VEZXNjcmlwdGlvbkhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnb25lLXBhcmFtZXRlci1oYXMnLCBuZXcgT25lUGFyYW1ldGVySGFzSGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdlbGVtZW50LWFsb25lJywgbmV3IEVsZW1lbnRBbG9uZUhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnaGFzT3duJywgbmV3IEhhc093bkhlbHBlcigpKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckhlbHBlcihiYXJzLCAnc2hvcnQtdXJsJywgbmV3IFNob3J0VVJMSGVscGVyKCkpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySGVscGVyKGJhcnMsICdzdHJpcC11cmwnLCBuZXcgU3RyaXBVUkxIZWxwZXIoKSk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJIZWxwZXIoYmFycywgJ3QnLCBuZXcgSTE4bkhlbHBlcigpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZ2lzdGVySGVscGVyKGJhcnMsIGtleTogc3RyaW5nLCBoZWxwZXI6IElIdG1sRW5naW5lSGVscGVyKSB7XG4gICAgICAgIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoa2V5LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnZhbGlkLXRoaXNcbiAgICAgICAgICAgIHJldHVybiBoZWxwZXIuaGVscGVyRnVuYy5hcHBseShoZWxwZXIsIFt0aGlzLCAuLi5fLnNsaWNlKGFyZ3VtZW50cyBhcyBhbnkpXSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==