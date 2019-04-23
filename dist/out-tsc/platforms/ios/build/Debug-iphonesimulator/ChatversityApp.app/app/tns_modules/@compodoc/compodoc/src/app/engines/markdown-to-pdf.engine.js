"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MarkdownToPDFEngine = /** @class */ (function () {
    function MarkdownToPDFEngine() {
        // console.log('MarkdownToPDFEngine');
        this.markedInstance = require('marked');
        this.renderer = new this.markedInstance.Renderer();
        this.renderer.strong = function (text) {
            console.log('MarkdownToPDFEngine strong: ', text);
            return { text: text, bold: true };
        };
        this.renderer.paragraph = function (text) {
            console.log('MarkdownToPDFEngine paragraph: ', text);
            return text;
        };
        // TODO Add custom parser... -> https://github.com/markedjs/marked/issues/504
        this.markedInstance.setOptions({
            gfm: false,
            breaks: false
        });
    }
    MarkdownToPDFEngine.getInstance = function () {
        if (!MarkdownToPDFEngine.instance) {
            MarkdownToPDFEngine.instance = new MarkdownToPDFEngine();
        }
        return MarkdownToPDFEngine.instance;
    };
    MarkdownToPDFEngine.prototype.convert = function (data) {
        // console.log('MarkdownToPDFEngine convert');
        /*const tokens = this.markedInstance.lexer('**This is bold text**');
        console.log(tokens);
        const html = this.markedInstance.parser(tokens);
        console.log(html);*/
        return this.markedInstance(data); // '**This is bold text**', { renderer: this.renderer });
    };
    return MarkdownToPDFEngine;
}());
exports.MarkdownToPDFEngine = MarkdownToPDFEngine;
exports.default = MarkdownToPDFEngine.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tdG8tcGRmLmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy9hcHAvZW5naW5lcy9tYXJrZG93bi10by1wZGYuZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFJSTtRQUNJLHNDQUFzQztRQUhsQyxtQkFBYyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUt2QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxVQUFBLElBQUk7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRCxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDdEMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsVUFBUyxJQUFJO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckQsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRUYsNkVBQTZFO1FBRTdFLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO1lBQzNCLEdBQUcsRUFBRSxLQUFLO1lBQ1YsTUFBTSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNhLCtCQUFXLEdBQXpCO1FBQ0ksSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRTtZQUMvQixtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1NBQzVEO1FBQ0QsT0FBTyxtQkFBbUIsQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVNLHFDQUFPLEdBQWQsVUFBZSxJQUFJO1FBQ2YsOENBQThDO1FBQzlDOzs7NEJBR29CO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHlEQUF5RDtJQUMvRixDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBekNELElBeUNDO0FBekNZLGtEQUFtQjtBQTJDaEMsa0JBQWUsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBjbGFzcyBNYXJrZG93blRvUERGRW5naW5lIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTWFya2Rvd25Ub1BERkVuZ2luZTtcbiAgICBwcml2YXRlIG1hcmtlZEluc3RhbmNlID0gcmVxdWlyZSgnbWFya2VkJyk7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnTWFya2Rvd25Ub1BERkVuZ2luZScpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgdGhpcy5tYXJrZWRJbnN0YW5jZS5SZW5kZXJlcigpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc3Ryb25nID0gdGV4dCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTWFya2Rvd25Ub1BERkVuZ2luZSBzdHJvbmc6ICcsIHRleHQpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdGV4dDogdGV4dCwgYm9sZDogdHJ1ZSB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIucGFyYWdyYXBoID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01hcmtkb3duVG9QREZFbmdpbmUgcGFyYWdyYXBoOiAnLCB0ZXh0KTtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRPRE8gQWRkIGN1c3RvbSBwYXJzZXIuLi4gLT4gaHR0cHM6Ly9naXRodWIuY29tL21hcmtlZGpzL21hcmtlZC9pc3N1ZXMvNTA0XG5cbiAgICAgICAgdGhpcy5tYXJrZWRJbnN0YW5jZS5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgIGdmbTogZmFsc2UsXG4gICAgICAgICAgICBicmVha3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICBpZiAoIU1hcmtkb3duVG9QREZFbmdpbmUuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIE1hcmtkb3duVG9QREZFbmdpbmUuaW5zdGFuY2UgPSBuZXcgTWFya2Rvd25Ub1BERkVuZ2luZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXJrZG93blRvUERGRW5naW5lLmluc3RhbmNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb252ZXJ0KGRhdGEpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ01hcmtkb3duVG9QREZFbmdpbmUgY29udmVydCcpO1xuICAgICAgICAvKmNvbnN0IHRva2VucyA9IHRoaXMubWFya2VkSW5zdGFuY2UubGV4ZXIoJyoqVGhpcyBpcyBib2xkIHRleHQqKicpO1xuICAgICAgICBjb25zb2xlLmxvZyh0b2tlbnMpO1xuICAgICAgICBjb25zdCBodG1sID0gdGhpcy5tYXJrZWRJbnN0YW5jZS5wYXJzZXIodG9rZW5zKTtcbiAgICAgICAgY29uc29sZS5sb2coaHRtbCk7Ki9cbiAgICAgICAgcmV0dXJuIHRoaXMubWFya2VkSW5zdGFuY2UoZGF0YSk7IC8vICcqKlRoaXMgaXMgYm9sZCB0ZXh0KionLCB7IHJlbmRlcmVyOiB0aGlzLnJlbmRlcmVyIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2Rvd25Ub1BERkVuZ2luZS5nZXRJbnN0YW5jZSgpO1xuIl19