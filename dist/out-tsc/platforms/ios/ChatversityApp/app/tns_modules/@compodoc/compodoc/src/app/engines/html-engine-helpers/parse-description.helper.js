"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var link_parser_1 = require("../../../utils/link-parser");
var dependencies_engine_1 = require("../dependencies.engine");
var ParseDescriptionHelper = /** @class */ (function () {
    function ParseDescriptionHelper() {
    }
    ParseDescriptionHelper.prototype.helperFunc = function (context, description, depth) {
        var tagRegExpLight = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i');
        var tagRegExpFull = new RegExp('\\{@link\\s+((?:.|\n)+?)\\}', 'i');
        var tagRegExp;
        var matches;
        var previousString;
        var tagInfo = [];
        tagRegExp = description.indexOf(']{') !== -1 ? tagRegExpFull : tagRegExpLight;
        var processTheLink = function (originalDescription, matchedTag, leadingText) {
            var leading = link_parser_1.extractLeadingText(originalDescription, matchedTag.completeTag);
            var split;
            var resultInCompodoc;
            var newLink;
            var rootPath;
            var stringtoReplace;
            var anchor = '';
            var label;
            var pageName;
            split = link_parser_1.splitLinkText(matchedTag.text);
            if (typeof split.linkText !== 'undefined') {
                resultInCompodoc = dependencies_engine_1.default.findInCompodoc(split.target);
            }
            else {
                var info = matchedTag.text;
                if (matchedTag.text.indexOf('#') !== -1) {
                    anchor = matchedTag.text.substr(matchedTag.text.indexOf('#'), matchedTag.text.length);
                    info = matchedTag.text.substr(0, matchedTag.text.indexOf('#'));
                }
                resultInCompodoc = dependencies_engine_1.default.findInCompodoc(info);
            }
            if (resultInCompodoc) {
                label = resultInCompodoc.name;
                pageName = resultInCompodoc.name;
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                if (resultInCompodoc.type === 'class') {
                    resultInCompodoc.type = 'classe';
                }
                else if (resultInCompodoc.type === 'miscellaneous' ||
                    (resultInCompodoc.ctype && resultInCompodoc.ctype === 'miscellaneous')) {
                    resultInCompodoc.type = 'miscellaneou'; // Not a typo, it is for matching other single types : component, module etc
                    label = resultInCompodoc.name;
                    anchor = '#' + resultInCompodoc.name;
                    if (resultInCompodoc.subtype === 'enum') {
                        pageName = 'enumerations';
                    }
                    else if (resultInCompodoc.subtype === 'function') {
                        pageName = 'functions';
                    }
                    else if (resultInCompodoc.subtype === 'typealias') {
                        pageName = 'typealiases';
                    }
                    else if (resultInCompodoc.subtype === 'variable') {
                        pageName = 'variables';
                    }
                }
                rootPath = '';
                switch (depth) {
                    case 0:
                        rootPath = './';
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        rootPath = '../'.repeat(depth);
                        break;
                }
                if (leading.leadingText !== undefined) {
                    label = leading.leadingText;
                }
                if (typeof split.linkText !== 'undefined') {
                    label = split.linkText;
                }
                newLink = "<a href=\"" + rootPath + resultInCompodoc.type + "s/" + pageName + ".html" + anchor + "\">" + label + "</a>";
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else if (!resultInCompodoc && typeof split.linkText !== 'undefined') {
                newLink = "<a href=\"" + split.target + "\">" + split.linkText + "</a>";
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else if (!resultInCompodoc && leading && typeof leading.leadingText !== 'undefined') {
                newLink = "<a href=\"" + split.target + "\">" + leading.leadingText + "</a>";
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else if (typeof split.linkText !== 'undefined') {
                    stringtoReplace = matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else if (!resultInCompodoc && typeof split.linkText === 'undefined') {
                newLink = "<a href=\"" + split.target + "\">" + split.target + "</a>";
                if (leadingText) {
                    stringtoReplace = '[' + leadingText + ']' + matchedTag.completeTag;
                }
                else if (leading.leadingText !== undefined) {
                    stringtoReplace = '[' + leading.leadingText + ']' + matchedTag.completeTag;
                }
                else {
                    stringtoReplace = matchedTag.completeTag;
                }
                return originalDescription.replace(stringtoReplace, newLink);
            }
            else {
                return originalDescription;
            }
        };
        function replaceMatch(replacer, tag, match, text, linkText) {
            var matchedTag = {
                completeTag: match,
                tag: tag,
                text: text
            };
            tagInfo.push(matchedTag);
            if (linkText) {
                return replacer(description, matchedTag, linkText);
            }
            else {
                return replacer(description, matchedTag);
            }
        }
        // Clean description for marked a tag parsed too early
        if (description.indexOf('href=') !== -1) {
            var insideMarkedATagResults = description.match(/<a [^>]+>([^<]+)<\/a>/g);
            if (insideMarkedATagResults && insideMarkedATagResults.length > 0) {
                for (var i = 0; i < insideMarkedATagResults.length; i++) {
                    var markedATagRegExp = new RegExp('<a [^>]+>([^<]+)</a>', 'gm');
                    var parsedATag = markedATagRegExp.exec(description);
                    if (parsedATag && parsedATag.length === 2) {
                        var insideMarkedATag = parsedATag[1];
                        description = description.replace("{@link <a href=\"" + encodeURI(insideMarkedATag) + "\">" + insideMarkedATag + "</a>", "{@link " + insideMarkedATag);
                    }
                }
            }
        }
        do {
            matches = tagRegExp.exec(description);
            // Did we have {@link ?
            if (matches) {
                previousString = description;
                if (matches.length === 2) {
                    description = replaceMatch(processTheLink, 'link', matches[0], matches[1]);
                }
                if (matches.length === 3) {
                    description = replaceMatch(processTheLink, 'link', matches[0], matches[2], matches[1]);
                }
            }
        } while (matches && previousString !== description);
        return description;
    };
    return ParseDescriptionHelper;
}());
exports.ParseDescriptionHelper = ParseDescriptionHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtZGVzY3JpcHRpb24uaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9odG1sLWVuZ2luZS1oZWxwZXJzL3BhcnNlLWRlc2NyaXB0aW9uLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDBEQUErRTtBQUMvRSw4REFBd0Q7QUFFeEQ7SUFDSTtJQUFlLENBQUM7SUFFVCwyQ0FBVSxHQUFqQixVQUFrQixPQUFZLEVBQUUsV0FBbUIsRUFBRSxLQUFhO1FBQzlELElBQUksY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BFLElBQUksYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxDQUFDO1FBQ2QsSUFBSSxPQUFPLENBQUM7UUFDWixJQUFJLGNBQWMsQ0FBQztRQUNuQixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFFakIsU0FBUyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBRTlFLElBQU0sY0FBYyxHQUFHLFVBQUMsbUJBQW1CLEVBQUUsVUFBVSxFQUFFLFdBQVc7WUFDaEUsSUFBSSxPQUFPLEdBQUcsZ0NBQWtCLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlFLElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBSSxnQkFBZ0IsQ0FBQztZQUNyQixJQUFJLE9BQU8sQ0FBQztZQUNaLElBQUksUUFBUSxDQUFDO1lB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QUMsQ0FBQyxDQUFDLEVBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUNiLENBQUM7aUJBQ0w7YUFDSjtTQUNKLFFBQVEsT0FBTyxJQUFJLGNBQWMsS0FBSyxXQUFXLEVBQUU7UUFFcEQsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLDZCQUFDO0FBQUQsQ0FBQyxBQXhNRCxJQXdNQztBQXhNWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSHRtbEVuZ2luZUhlbHBlciB9IGZyb20gJy4vaHRtbC1lbmdpbmUtaGVscGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBleHRyYWN0TGVhZGluZ1RleHQsIHNwbGl0TGlua1RleHQgfSBmcm9tICcuLi8uLi8uLi91dGlscy9saW5rLXBhcnNlcic7XG5pbXBvcnQgRGVwZW5kZW5jaWVzRW5naW5lIGZyb20gJy4uL2RlcGVuZGVuY2llcy5lbmdpbmUnO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VEZXNjcmlwdGlvbkhlbHBlciBpbXBsZW1lbnRzIElIdG1sRW5naW5lSGVscGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBwdWJsaWMgaGVscGVyRnVuYyhjb250ZXh0OiBhbnksIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGRlcHRoOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHRhZ1JlZ0V4cExpZ2h0ID0gbmV3IFJlZ0V4cCgnXFxcXHtAbGlua1xcXFxzKygoPzoufFxcbikrPylcXFxcfScsICdpJyk7XG4gICAgICAgIGxldCB0YWdSZWdFeHBGdWxsID0gbmV3IFJlZ0V4cCgnXFxcXHtAbGlua1xcXFxzKygoPzoufFxcbikrPylcXFxcfScsICdpJyk7XG4gICAgICAgIGxldCB0YWdSZWdFeHA7XG4gICAgICAgIGxldCBtYXRjaGVzO1xuICAgICAgICBsZXQgcHJldmlvdXNTdHJpbmc7XG4gICAgICAgIGxldCB0YWdJbmZvID0gW107XG5cbiAgICAgICAgdGFnUmVnRXhwID0gZGVzY3JpcHRpb24uaW5kZXhPZignXXsnKSAhPT0gLTEgPyB0YWdSZWdFeHBGdWxsIDogdGFnUmVnRXhwTGlnaHQ7XG5cbiAgICAgICAgY29uc3QgcHJvY2Vzc1RoZUxpbmsgPSAob3JpZ2luYWxEZXNjcmlwdGlvbiwgbWF0Y2hlZFRhZywgbGVhZGluZ1RleHQpID0+IHtcbiAgICAgICAgICAgIGxldCBsZWFkaW5nID0gZXh0cmFjdExlYWRpbmdUZXh0KG9yaWdpbmFsRGVzY3JpcHRpb24sIG1hdGNoZWRUYWcuY29tcGxldGVUYWcpO1xuICAgICAgICAgICAgbGV0IHNwbGl0O1xuICAgICAgICAgICAgbGV0IHJlc3VsdEluQ29tcG9kb2M7XG4gICAgICAgICAgICBsZXQgbmV3TGluaztcbiAgICAgICAgICAgIGxldCByb290UGF0aDtcbiAgICAgICAgICAgIGxldCBzdHJpbmd0b1JlcGxhY2U7XG4gICAgICAgICAgICBsZXQgYW5jaG9yID0gJyc7XG4gICAgICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgICAgICBsZXQgcGFnZU5hbWU7XG5cbiAgICAgICAgICAgIHNwbGl0ID0gc3BsaXRMaW5rVGV4dChtYXRjaGVkVGFnLnRleHQpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwbGl0LmxpbmtUZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJlc3VsdEluQ29tcG9kb2MgPSBEZXBlbmRlbmNpZXNFbmdpbmUuZmluZEluQ29tcG9kb2Moc3BsaXQudGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZm8gPSBtYXRjaGVkVGFnLnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZWRUYWcudGV4dC5pbmRleE9mKCcjJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvciA9IG1hdGNoZWRUYWcudGV4dC5zdWJzdHIoXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkVGFnLnRleHQuaW5kZXhPZignIycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFRhZy50ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpbmZvID0gbWF0Y2hlZFRhZy50ZXh0LnN1YnN0cigwLCBtYXRjaGVkVGFnLnRleHQuaW5kZXhPZignIycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0SW5Db21wb2RvYyA9IERlcGVuZGVuY2llc0VuZ2luZS5maW5kSW5Db21wb2RvYyhpbmZvKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc3VsdEluQ29tcG9kb2MpIHtcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHJlc3VsdEluQ29tcG9kb2MubmFtZTtcbiAgICAgICAgICAgICAgICBwYWdlTmFtZSA9IHJlc3VsdEluQ29tcG9kb2MubmFtZTtcblxuICAgICAgICAgICAgICAgIGlmIChsZWFkaW5nVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSAnWycgKyBsZWFkaW5nVGV4dCArICddJyArIG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsZWFkaW5nLmxlYWRpbmdUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gJ1snICsgbGVhZGluZy5sZWFkaW5nVGV4dCArICddJyArIG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BsaXQubGlua1RleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9IG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0SW5Db21wb2RvYy50eXBlID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEluQ29tcG9kb2MudHlwZSA9ICdjbGFzc2UnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEluQ29tcG9kb2MudHlwZSA9PT0gJ21pc2NlbGxhbmVvdXMnIHx8XG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHRJbkNvbXBvZG9jLmN0eXBlICYmIHJlc3VsdEluQ29tcG9kb2MuY3R5cGUgPT09ICdtaXNjZWxsYW5lb3VzJylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW5Db21wb2RvYy50eXBlID0gJ21pc2NlbGxhbmVvdSc7IC8vIE5vdCBhIHR5cG8sIGl0IGlzIGZvciBtYXRjaGluZyBvdGhlciBzaW5nbGUgdHlwZXMgOiBjb21wb25lbnQsIG1vZHVsZSBldGNcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSByZXN1bHRJbkNvbXBvZG9jLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvciA9ICcjJyArIHJlc3VsdEluQ29tcG9kb2MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdEluQ29tcG9kb2Muc3VidHlwZSA9PT0gJ2VudW0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlTmFtZSA9ICdlbnVtZXJhdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdEluQ29tcG9kb2Muc3VidHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZU5hbWUgPSAnZnVuY3Rpb25zJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHRJbkNvbXBvZG9jLnN1YnR5cGUgPT09ICd0eXBlYWxpYXMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlTmFtZSA9ICd0eXBlYWxpYXNlcyc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0SW5Db21wb2RvYy5zdWJ0eXBlID09PSAndmFyaWFibGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlTmFtZSA9ICd2YXJpYWJsZXMnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm9vdFBhdGggPSAnJztcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFBhdGggPSAnLi8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFBhdGggPSAnLi4vJy5yZXBlYXQoZGVwdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxlYWRpbmcubGVhZGluZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IGxlYWRpbmcubGVhZGluZ1RleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BsaXQubGlua1RleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gc3BsaXQubGlua1RleHQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV3TGluayA9IGA8YSBocmVmPVwiJHtyb290UGF0aH0ke1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRJbkNvbXBvZG9jLnR5cGVcbiAgICAgICAgICAgICAgICB9cy8ke3BhZ2VOYW1lfS5odG1sJHthbmNob3J9XCI+JHtsYWJlbH08L2E+YDtcblxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbERlc2NyaXB0aW9uLnJlcGxhY2Uoc3RyaW5ndG9SZXBsYWNlLCBuZXdMaW5rKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlc3VsdEluQ29tcG9kb2MgJiYgdHlwZW9mIHNwbGl0LmxpbmtUZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG5ld0xpbmsgPSBgPGEgaHJlZj1cIiR7c3BsaXQudGFyZ2V0fVwiPiR7c3BsaXQubGlua1RleHR9PC9hPmA7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWRpbmdUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9ICdbJyArIGxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxlYWRpbmcubGVhZGluZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSAnWycgKyBsZWFkaW5nLmxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGxpdC5saW5rVGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxEZXNjcmlwdGlvbi5yZXBsYWNlKHN0cmluZ3RvUmVwbGFjZSwgbmV3TGluayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFyZXN1bHRJbkNvbXBvZG9jICYmIGxlYWRpbmcgJiYgdHlwZW9mIGxlYWRpbmcubGVhZGluZ1RleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbmV3TGluayA9IGA8YSBocmVmPVwiJHtzcGxpdC50YXJnZXR9XCI+JHtsZWFkaW5nLmxlYWRpbmdUZXh0fTwvYT5gO1xuICAgICAgICAgICAgICAgIGlmIChsZWFkaW5nVGV4dCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSAnWycgKyBsZWFkaW5nVGV4dCArICddJyArIG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsZWFkaW5nLmxlYWRpbmdUZXh0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gJ1snICsgbGVhZGluZy5sZWFkaW5nVGV4dCArICddJyArIG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BsaXQubGlua1RleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9IG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRGVzY3JpcHRpb24ucmVwbGFjZShzdHJpbmd0b1JlcGxhY2UsIG5ld0xpbmspO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghcmVzdWx0SW5Db21wb2RvYyAmJiB0eXBlb2Ygc3BsaXQubGlua1RleHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbmV3TGluayA9IGA8YSBocmVmPVwiJHtzcGxpdC50YXJnZXR9XCI+JHtzcGxpdC50YXJnZXR9PC9hPmA7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWRpbmdUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9ICdbJyArIGxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxlYWRpbmcubGVhZGluZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSAnWycgKyBsZWFkaW5nLmxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxEZXNjcmlwdGlvbi5yZXBsYWNlKHN0cmluZ3RvUmVwbGFjZSwgbmV3TGluayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbERlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VNYXRjaChyZXBsYWNlciwgdGFnLCBtYXRjaCwgdGV4dCwgbGlua1RleHQ/KSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlZFRhZyA9IHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZVRhZzogbWF0Y2gsXG4gICAgICAgICAgICAgICAgdGFnOiB0YWcsXG4gICAgICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRhZ0luZm8ucHVzaChtYXRjaGVkVGFnKTtcblxuICAgICAgICAgICAgaWYgKGxpbmtUZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VyKGRlc2NyaXB0aW9uLCBtYXRjaGVkVGFnLCBsaW5rVGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBsYWNlcihkZXNjcmlwdGlvbiwgbWF0Y2hlZFRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhbiBkZXNjcmlwdGlvbiBmb3IgbWFya2VkIGEgdGFnIHBhcnNlZCB0b28gZWFybHlcblxuICAgICAgICBpZiAoZGVzY3JpcHRpb24uaW5kZXhPZignaHJlZj0nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGxldCBpbnNpZGVNYXJrZWRBVGFnUmVzdWx0cyA9IGRlc2NyaXB0aW9uLm1hdGNoKC88YSBbXj5dKz4oW148XSspPFxcL2E+L2cpO1xuXG4gICAgICAgICAgICBpZiAoaW5zaWRlTWFya2VkQVRhZ1Jlc3VsdHMgJiYgaW5zaWRlTWFya2VkQVRhZ1Jlc3VsdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zaWRlTWFya2VkQVRhZ1Jlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcmtlZEFUYWdSZWdFeHAgPSBuZXcgUmVnRXhwKCc8YSBbXj5dKz4oW148XSspPC9hPicsICdnbScpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkQVRhZyA9IG1hcmtlZEFUYWdSZWdFeHAuZXhlYyhkZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZWRBVGFnICYmIHBhcnNlZEFUYWcubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5zaWRlTWFya2VkQVRhZyA9IHBhcnNlZEFUYWdbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYHtAbGluayA8YSBocmVmPVwiJHtlbmNvZGVVUkkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2lkZU1hcmtlZEFUYWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVwiPiR7aW5zaWRlTWFya2VkQVRhZ308L2E+YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBge0BsaW5rICR7aW5zaWRlTWFya2VkQVRhZ31gXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgbWF0Y2hlcyA9IHRhZ1JlZ0V4cC5leGVjKGRlc2NyaXB0aW9uKTtcblxuICAgICAgICAgICAgLy8gRGlkIHdlIGhhdmUge0BsaW5rID9cbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTdHJpbmcgPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSByZXBsYWNlTWF0Y2gocHJvY2Vzc1RoZUxpbmssICdsaW5rJywgbWF0Y2hlc1swXSwgbWF0Y2hlc1sxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IHJlcGxhY2VNYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NUaGVMaW5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2xpbmsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXNbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzWzFdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChtYXRjaGVzICYmIHByZXZpb3VzU3RyaW5nICE9PSBkZXNjcmlwdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICAgIH1cbn1cbiJdfQ==