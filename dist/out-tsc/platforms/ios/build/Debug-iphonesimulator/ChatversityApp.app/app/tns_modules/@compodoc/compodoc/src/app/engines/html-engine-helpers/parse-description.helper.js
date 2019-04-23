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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtZGVzY3JpcHRpb24uaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL2FwcC9lbmdpbmVzL2h0bWwtZW5naW5lLWhlbHBlcnMvcGFyc2UtZGVzY3JpcHRpb24uaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMERBQStFO0FBQy9FLDhEQUF3RDtBQUV4RDtJQUNJO0lBQWUsQ0FBQztJQUVULDJDQUFVLEdBQWpCLFVBQWtCLE9BQVksRUFBRSxXQUFtQixFQUFFLEtBQWE7UUFDOUQsSUFBSSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEUsSUFBSSxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxTQUFTLENBQUM7UUFDZCxJQUFJLE9BQU8sQ0FBQztRQUNaLElBQUksY0FBYyxDQUFDO1FBQ25CLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVqQixTQUFTLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFFOUUsSUFBTSxjQUFjLEdBQUcsVUFBQyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsV0FBVztZQUNoRSxJQUFJLE9BQU8sR0FBRyxnQ0FBa0IsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUUsSUFBSSxLQUFLLENBQUM7WUFDVixJQUFJLGdCQUFnQixDQUFDO1lBQ3JC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LEVBQ04sT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUNWLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFDVixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQ2IsQ0FBQztpQkFDTDthQUNKO1NBQ0osUUFBUSxPQUFPLElBQUksY0FBYyxLQUFLLFdBQVcsRUFBRTtRQUVwRCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBQ0wsNkJBQUM7QUFBRCxDQUFDLEFBeE1ELElBd01DO0FBeE1ZLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElIdG1sRW5naW5lSGVscGVyIH0gZnJvbSAnLi9odG1sLWVuZ2luZS1oZWxwZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IGV4dHJhY3RMZWFkaW5nVGV4dCwgc3BsaXRMaW5rVGV4dCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2xpbmstcGFyc2VyJztcbmltcG9ydCBEZXBlbmRlbmNpZXNFbmdpbmUgZnJvbSAnLi4vZGVwZW5kZW5jaWVzLmVuZ2luZSc7XG5cbmV4cG9ydCBjbGFzcyBQYXJzZURlc2NyaXB0aW9uSGVscGVyIGltcGxlbWVudHMgSUh0bWxFbmdpbmVIZWxwZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIHB1YmxpYyBoZWxwZXJGdW5jKGNvbnRleHQ6IGFueSwgZGVzY3JpcHRpb246IHN0cmluZywgZGVwdGg6IG51bWJlcikge1xuICAgICAgICBsZXQgdGFnUmVnRXhwTGlnaHQgPSBuZXcgUmVnRXhwKCdcXFxce0BsaW5rXFxcXHMrKCg/Oi58XFxuKSs/KVxcXFx9JywgJ2knKTtcbiAgICAgICAgbGV0IHRhZ1JlZ0V4cEZ1bGwgPSBuZXcgUmVnRXhwKCdcXFxce0BsaW5rXFxcXHMrKCg/Oi58XFxuKSs/KVxcXFx9JywgJ2knKTtcbiAgICAgICAgbGV0IHRhZ1JlZ0V4cDtcbiAgICAgICAgbGV0IG1hdGNoZXM7XG4gICAgICAgIGxldCBwcmV2aW91c1N0cmluZztcbiAgICAgICAgbGV0IHRhZ0luZm8gPSBbXTtcblxuICAgICAgICB0YWdSZWdFeHAgPSBkZXNjcmlwdGlvbi5pbmRleE9mKCddeycpICE9PSAtMSA/IHRhZ1JlZ0V4cEZ1bGwgOiB0YWdSZWdFeHBMaWdodDtcblxuICAgICAgICBjb25zdCBwcm9jZXNzVGhlTGluayA9IChvcmlnaW5hbERlc2NyaXB0aW9uLCBtYXRjaGVkVGFnLCBsZWFkaW5nVGV4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IGxlYWRpbmcgPSBleHRyYWN0TGVhZGluZ1RleHQob3JpZ2luYWxEZXNjcmlwdGlvbiwgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZyk7XG4gICAgICAgICAgICBsZXQgc3BsaXQ7XG4gICAgICAgICAgICBsZXQgcmVzdWx0SW5Db21wb2RvYztcbiAgICAgICAgICAgIGxldCBuZXdMaW5rO1xuICAgICAgICAgICAgbGV0IHJvb3RQYXRoO1xuICAgICAgICAgICAgbGV0IHN0cmluZ3RvUmVwbGFjZTtcbiAgICAgICAgICAgIGxldCBhbmNob3IgPSAnJztcbiAgICAgICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgICAgIGxldCBwYWdlTmFtZTtcblxuICAgICAgICAgICAgc3BsaXQgPSBzcGxpdExpbmtUZXh0KG1hdGNoZWRUYWcudGV4dCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BsaXQubGlua1RleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0SW5Db21wb2RvYyA9IERlcGVuZGVuY2llc0VuZ2luZS5maW5kSW5Db21wb2RvYyhzcGxpdC50YXJnZXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5mbyA9IG1hdGNoZWRUYWcudGV4dDtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlZFRhZy50ZXh0LmluZGV4T2YoJyMnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yID0gbWF0Y2hlZFRhZy50ZXh0LnN1YnN0cihcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZWRUYWcudGV4dC5pbmRleE9mKCcjJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkVGFnLnRleHQubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGluZm8gPSBtYXRjaGVkVGFnLnRleHQuc3Vic3RyKDAsIG1hdGNoZWRUYWcudGV4dC5pbmRleE9mKCcjJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRJbkNvbXBvZG9jID0gRGVwZW5kZW5jaWVzRW5naW5lLmZpbmRJbkNvbXBvZG9jKGluZm8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzdWx0SW5Db21wb2RvYykge1xuICAgICAgICAgICAgICAgIGxhYmVsID0gcmVzdWx0SW5Db21wb2RvYy5uYW1lO1xuICAgICAgICAgICAgICAgIHBhZ2VOYW1lID0gcmVzdWx0SW5Db21wb2RvYy5uYW1lO1xuXG4gICAgICAgICAgICAgICAgaWYgKGxlYWRpbmdUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9ICdbJyArIGxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxlYWRpbmcubGVhZGluZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSAnWycgKyBsZWFkaW5nLmxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGxpdC5saW5rVGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRJbkNvbXBvZG9jLnR5cGUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW5Db21wb2RvYy50eXBlID0gJ2NsYXNzZSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0SW5Db21wb2RvYy50eXBlID09PSAnbWlzY2VsbGFuZW91cycgfHxcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdEluQ29tcG9kb2MuY3R5cGUgJiYgcmVzdWx0SW5Db21wb2RvYy5jdHlwZSA9PT0gJ21pc2NlbGxhbmVvdXMnKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRJbkNvbXBvZG9jLnR5cGUgPSAnbWlzY2VsbGFuZW91JzsgLy8gTm90IGEgdHlwbywgaXQgaXMgZm9yIG1hdGNoaW5nIG90aGVyIHNpbmdsZSB0eXBlcyA6IGNvbXBvbmVudCwgbW9kdWxlIGV0Y1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IHJlc3VsdEluQ29tcG9kb2MubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yID0gJyMnICsgcmVzdWx0SW5Db21wb2RvYy5uYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0SW5Db21wb2RvYy5zdWJ0eXBlID09PSAnZW51bScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VOYW1lID0gJ2VudW1lcmF0aW9ucyc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0SW5Db21wb2RvYy5zdWJ0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlTmFtZSA9ICdmdW5jdGlvbnMnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdEluQ29tcG9kb2Muc3VidHlwZSA9PT0gJ3R5cGVhbGlhcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VOYW1lID0gJ3R5cGVhbGlhc2VzJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHRJbkNvbXBvZG9jLnN1YnR5cGUgPT09ICd2YXJpYWJsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VOYW1lID0gJ3ZhcmlhYmxlcyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb290UGF0aCA9ICcnO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChkZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UGF0aCA9ICcuLyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICByb290UGF0aCA9ICcuLi8nLnJlcGVhdChkZXB0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGVhZGluZy5sZWFkaW5nVGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsID0gbGVhZGluZy5sZWFkaW5nVGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGxpdC5saW5rVGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgPSBzcGxpdC5saW5rVGV4dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXdMaW5rID0gYDxhIGhyZWY9XCIke3Jvb3RQYXRofSR7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdEluQ29tcG9kb2MudHlwZVxuICAgICAgICAgICAgICAgIH1zLyR7cGFnZU5hbWV9Lmh0bWwke2FuY2hvcn1cIj4ke2xhYmVsfTwvYT5gO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRGVzY3JpcHRpb24ucmVwbGFjZShzdHJpbmd0b1JlcGxhY2UsIG5ld0xpbmspO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghcmVzdWx0SW5Db21wb2RvYyAmJiB0eXBlb2Ygc3BsaXQubGlua1RleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbmV3TGluayA9IGA8YSBocmVmPVwiJHtzcGxpdC50YXJnZXR9XCI+JHtzcGxpdC5saW5rVGV4dH08L2E+YDtcbiAgICAgICAgICAgICAgICBpZiAobGVhZGluZ1RleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gJ1snICsgbGVhZGluZ1RleHQgKyAnXScgKyBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGVhZGluZy5sZWFkaW5nVGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9ICdbJyArIGxlYWRpbmcubGVhZGluZ1RleHQgKyAnXScgKyBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwbGl0LmxpbmtUZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9IG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbERlc2NyaXB0aW9uLnJlcGxhY2Uoc3RyaW5ndG9SZXBsYWNlLCBuZXdMaW5rKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXJlc3VsdEluQ29tcG9kb2MgJiYgbGVhZGluZyAmJiB0eXBlb2YgbGVhZGluZy5sZWFkaW5nVGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBuZXdMaW5rID0gYDxhIGhyZWY9XCIke3NwbGl0LnRhcmdldH1cIj4ke2xlYWRpbmcubGVhZGluZ1RleHR9PC9hPmA7XG4gICAgICAgICAgICAgICAgaWYgKGxlYWRpbmdUZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9ICdbJyArIGxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxlYWRpbmcubGVhZGluZ1RleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSAnWycgKyBsZWFkaW5nLmxlYWRpbmdUZXh0ICsgJ10nICsgbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGxpdC5saW5rVGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gbWF0Y2hlZFRhZy5jb21wbGV0ZVRhZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmd0b1JlcGxhY2UgPSBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxEZXNjcmlwdGlvbi5yZXBsYWNlKHN0cmluZ3RvUmVwbGFjZSwgbmV3TGluayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFyZXN1bHRJbkNvbXBvZG9jICYmIHR5cGVvZiBzcGxpdC5saW5rVGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBuZXdMaW5rID0gYDxhIGhyZWY9XCIke3NwbGl0LnRhcmdldH1cIj4ke3NwbGl0LnRhcmdldH08L2E+YDtcbiAgICAgICAgICAgICAgICBpZiAobGVhZGluZ1RleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5ndG9SZXBsYWNlID0gJ1snICsgbGVhZGluZ1RleHQgKyAnXScgKyBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGVhZGluZy5sZWFkaW5nVGV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9ICdbJyArIGxlYWRpbmcubGVhZGluZ1RleHQgKyAnXScgKyBtYXRjaGVkVGFnLmNvbXBsZXRlVGFnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZ3RvUmVwbGFjZSA9IG1hdGNoZWRUYWcuY29tcGxldGVUYWc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbERlc2NyaXB0aW9uLnJlcGxhY2Uoc3RyaW5ndG9SZXBsYWNlLCBuZXdMaW5rKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRGVzY3JpcHRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZU1hdGNoKHJlcGxhY2VyLCB0YWcsIG1hdGNoLCB0ZXh0LCBsaW5rVGV4dD8pIHtcbiAgICAgICAgICAgIGxldCBtYXRjaGVkVGFnID0ge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlVGFnOiBtYXRjaCxcbiAgICAgICAgICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGFnSW5mby5wdXNoKG1hdGNoZWRUYWcpO1xuXG4gICAgICAgICAgICBpZiAobGlua1RleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwbGFjZXIoZGVzY3JpcHRpb24sIG1hdGNoZWRUYWcsIGxpbmtUZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VyKGRlc2NyaXB0aW9uLCBtYXRjaGVkVGFnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsZWFuIGRlc2NyaXB0aW9uIGZvciBtYXJrZWQgYSB0YWcgcGFyc2VkIHRvbyBlYXJseVxuXG4gICAgICAgIGlmIChkZXNjcmlwdGlvbi5pbmRleE9mKCdocmVmPScpICE9PSAtMSkge1xuICAgICAgICAgICAgbGV0IGluc2lkZU1hcmtlZEFUYWdSZXN1bHRzID0gZGVzY3JpcHRpb24ubWF0Y2goLzxhIFtePl0rPihbXjxdKyk8XFwvYT4vZyk7XG5cbiAgICAgICAgICAgIGlmIChpbnNpZGVNYXJrZWRBVGFnUmVzdWx0cyAmJiBpbnNpZGVNYXJrZWRBVGFnUmVzdWx0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnNpZGVNYXJrZWRBVGFnUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWFya2VkQVRhZ1JlZ0V4cCA9IG5ldyBSZWdFeHAoJzxhIFtePl0rPihbXjxdKyk8L2E+JywgJ2dtJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZWRBVGFnID0gbWFya2VkQVRhZ1JlZ0V4cC5leGVjKGRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlZEFUYWcgJiYgcGFyc2VkQVRhZy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnNpZGVNYXJrZWRBVGFnID0gcGFyc2VkQVRhZ1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24ucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBge0BsaW5rIDxhIGhyZWY9XCIke2VuY29kZVVSSShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zaWRlTWFya2VkQVRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XCI+JHtpbnNpZGVNYXJrZWRBVGFnfTwvYT5gLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB7QGxpbmsgJHtpbnNpZGVNYXJrZWRBVGFnfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBtYXRjaGVzID0gdGFnUmVnRXhwLmV4ZWMoZGVzY3JpcHRpb24pO1xuXG4gICAgICAgICAgICAvLyBEaWQgd2UgaGF2ZSB7QGxpbmsgP1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1N0cmluZyA9IGRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IHJlcGxhY2VNYXRjaChwcm9jZXNzVGhlTGluaywgJ2xpbmsnLCBtYXRjaGVzWzBdLCBtYXRjaGVzWzFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gcmVwbGFjZU1hdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc1RoZUxpbmssXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGluaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlc1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKG1hdGNoZXMgJiYgcHJldmlvdXNTdHJpbmcgIT09IGRlc2NyaXB0aW9uKTtcblxuICAgICAgICByZXR1cm4gZGVzY3JpcHRpb247XG4gICAgfVxufVxuIl19