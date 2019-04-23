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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tdG8tcGRmLmVuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL3Ruc19tb2R1bGVzL0Bjb21wb2RvYy9jb21wb2RvYy9zcmMvYXBwL2VuZ2luZXMvbWFya2Rvd24tdG8tcGRmLmVuZ2luZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBSUk7UUFDSSxzQ0FBc0M7UUFIbEMsbUJBQWMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFLdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsVUFBQSxJQUFJO1lBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEQsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3RDLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLFVBQVMsSUFBSTtZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3JELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVGLDZFQUE2RTtRQUU3RSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztZQUMzQixHQUFHLEVBQUUsS0FBSztZQUNWLE1BQU0sRUFBRSxLQUFLO1NBQ2hCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDYSwrQkFBVyxHQUF6QjtRQUNJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUU7WUFDL0IsbUJBQW1CLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztTQUM1RDtRQUNELE9BQU8sbUJBQW1CLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFFTSxxQ0FBTyxHQUFkLFVBQWUsSUFBSTtRQUNmLDhDQUE4QztRQUM5Qzs7OzRCQUdvQjtRQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyx5REFBeUQ7SUFDL0YsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FBQyxBQXpDRCxJQXlDQztBQXpDWSxrREFBbUI7QUEyQ2hDLGtCQUFlLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgY2xhc3MgTWFya2Rvd25Ub1BERkVuZ2luZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IE1hcmtkb3duVG9QREZFbmdpbmU7XG4gICAgcHJpdmF0ZSBtYXJrZWRJbnN0YW5jZSA9IHJlcXVpcmUoJ21hcmtlZCcpO1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ01hcmtkb3duVG9QREZFbmdpbmUnKTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IHRoaXMubWFya2VkSW5zdGFuY2UuUmVuZGVyZXIoKTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLnN0cm9uZyA9IHRleHQgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01hcmtkb3duVG9QREZFbmdpbmUgc3Ryb25nOiAnLCB0ZXh0KTtcbiAgICAgICAgICAgIHJldHVybiB7IHRleHQ6IHRleHQsIGJvbGQ6IHRydWUgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYXJrZG93blRvUERGRW5naW5lIHBhcmFncmFwaDogJywgdGV4dCk7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUT0RPIEFkZCBjdXN0b20gcGFyc2VyLi4uIC0+IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZWRqcy9tYXJrZWQvaXNzdWVzLzUwNFxuXG4gICAgICAgIHRoaXMubWFya2VkSW5zdGFuY2Uuc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICBnZm06IGZhbHNlLFxuICAgICAgICAgICAgYnJlYWtzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCFNYXJrZG93blRvUERGRW5naW5lLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBNYXJrZG93blRvUERGRW5naW5lLmluc3RhbmNlID0gbmV3IE1hcmtkb3duVG9QREZFbmdpbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWFya2Rvd25Ub1BERkVuZ2luZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29udmVydChkYXRhKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdNYXJrZG93blRvUERGRW5naW5lIGNvbnZlcnQnKTtcbiAgICAgICAgLypjb25zdCB0b2tlbnMgPSB0aGlzLm1hcmtlZEluc3RhbmNlLmxleGVyKCcqKlRoaXMgaXMgYm9sZCB0ZXh0KionKTtcbiAgICAgICAgY29uc29sZS5sb2codG9rZW5zKTtcbiAgICAgICAgY29uc3QgaHRtbCA9IHRoaXMubWFya2VkSW5zdGFuY2UucGFyc2VyKHRva2Vucyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGh0bWwpOyovXG4gICAgICAgIHJldHVybiB0aGlzLm1hcmtlZEluc3RhbmNlKGRhdGEpOyAvLyAnKipUaGlzIGlzIGJvbGQgdGV4dCoqJywgeyByZW5kZXJlcjogdGhpcy5yZW5kZXJlciB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hcmtkb3duVG9QREZFbmdpbmUuZ2V0SW5zdGFuY2UoKTtcbiJdfQ==