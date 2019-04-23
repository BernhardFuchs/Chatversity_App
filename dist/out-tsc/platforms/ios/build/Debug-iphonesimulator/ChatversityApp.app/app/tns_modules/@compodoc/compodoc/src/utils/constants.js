"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPODOC_CONSTANTS = {
    navTabDefinitions: [
        {
            id: 'info',
            href: '#info',
            'data-link': 'info',
            label: 'Info',
            depTypes: ['all']
        },
        {
            id: 'readme',
            href: '#readme',
            'data-link': 'readme',
            label: 'README',
            depTypes: ['all']
        },
        {
            id: 'source',
            href: '#source',
            'data-link': 'source',
            label: 'Source',
            depTypes: ['all']
        },
        {
            id: 'templateData',
            href: '#templateData',
            'data-link': 'template',
            label: 'Template',
            depTypes: ['component']
        },
        {
            id: 'styleData',
            href: '#styleData',
            'data-link': 'style',
            label: 'Styles',
            depTypes: ['component']
        },
        {
            id: 'tree',
            href: '#tree',
            'data-link': 'dom-tree',
            label: 'DOM Tree',
            depTypes: ['component']
        },
        {
            id: 'example',
            href: '#example',
            'data-link': 'example',
            label: 'Examples',
            depTypes: ['component', 'directive', 'injectable', 'pipe']
        }
    ]
};
/**
 * Max length for the string of a file during Lunr search engine indexing.
 * Prevent stack size exceeded
 */
exports.MAX_SIZE_FILE_SEARCH_INDEX = 50000;
/**
 * Max length for the string of a file during cheerio parsing.
 * Prevent stack size exceeded
 */
exports.MAX_SIZE_FILE_CHEERIO_PARSING = 400000000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVzaW11bGF0b3IvQ2hhdHZlcnNpdHlBcHAuYXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsa0JBQWtCLEdBQUc7SUFDOUIsaUJBQWlCLEVBQUU7UUFDZjtZQUNJLEVBQUUsRUFBRSxNQUFNO1lBQ1YsSUFBSSxFQUFFLE9BQU87WUFDYixXQUFXLEVBQUUsTUFBTTtZQUNuQixLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztTQUNwQjtRQUNEO1lBQ0ksRUFBRSxFQUFFLFFBQVE7WUFDWixJQUFJLEVBQUUsU0FBUztZQUNmLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ3BCO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsUUFBUTtZQUNaLElBQUksRUFBRSxTQUFTO1lBQ2YsV0FBVyxFQUFFLFFBQVE7WUFDckIsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDcEI7UUFDRDtZQUNJLEVBQUUsRUFBRSxjQUFjO1lBQ2xCLElBQUksRUFBRSxlQUFlO1lBQ3JCLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUMxQjtRQUNEO1lBQ0ksRUFBRSxFQUFFLFdBQVc7WUFDZixJQUFJLEVBQUUsWUFBWTtZQUNsQixXQUFXLEVBQUUsT0FBTztZQUNwQixLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUMxQjtRQUNEO1lBQ0ksRUFBRSxFQUFFLE1BQU07WUFDVixJQUFJLEVBQUUsT0FBTztZQUNiLFdBQVcsRUFBRSxVQUFVO1lBQ3ZCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFFBQVEsRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUMxQjtRQUNEO1lBQ0ksRUFBRSxFQUFFLFNBQVM7WUFDYixJQUFJLEVBQUUsVUFBVTtZQUNoQixXQUFXLEVBQUUsU0FBUztZQUN0QixLQUFLLEVBQUUsVUFBVTtZQUNqQixRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUM7U0FDN0Q7S0FDSjtDQUNKLENBQUM7QUFFRjs7O0dBR0c7QUFDVSxRQUFBLDBCQUEwQixHQUFHLEtBQUssQ0FBQztBQUVoRDs7O0dBR0c7QUFDVSxRQUFBLDZCQUE2QixHQUFHLFNBQVMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBDT01QT0RPQ19DT05TVEFOVFMgPSB7XG4gICAgbmF2VGFiRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdpbmZvJyxcbiAgICAgICAgICAgIGhyZWY6ICcjaW5mbycsXG4gICAgICAgICAgICAnZGF0YS1saW5rJzogJ2luZm8nLFxuICAgICAgICAgICAgbGFiZWw6ICdJbmZvJyxcbiAgICAgICAgICAgIGRlcFR5cGVzOiBbJ2FsbCddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAncmVhZG1lJyxcbiAgICAgICAgICAgIGhyZWY6ICcjcmVhZG1lJyxcbiAgICAgICAgICAgICdkYXRhLWxpbmsnOiAncmVhZG1lJyxcbiAgICAgICAgICAgIGxhYmVsOiAnUkVBRE1FJyxcbiAgICAgICAgICAgIGRlcFR5cGVzOiBbJ2FsbCddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnc291cmNlJyxcbiAgICAgICAgICAgIGhyZWY6ICcjc291cmNlJyxcbiAgICAgICAgICAgICdkYXRhLWxpbmsnOiAnc291cmNlJyxcbiAgICAgICAgICAgIGxhYmVsOiAnU291cmNlJyxcbiAgICAgICAgICAgIGRlcFR5cGVzOiBbJ2FsbCddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAndGVtcGxhdGVEYXRhJyxcbiAgICAgICAgICAgIGhyZWY6ICcjdGVtcGxhdGVEYXRhJyxcbiAgICAgICAgICAgICdkYXRhLWxpbmsnOiAndGVtcGxhdGUnLFxuICAgICAgICAgICAgbGFiZWw6ICdUZW1wbGF0ZScsXG4gICAgICAgICAgICBkZXBUeXBlczogWydjb21wb25lbnQnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3N0eWxlRGF0YScsXG4gICAgICAgICAgICBocmVmOiAnI3N0eWxlRGF0YScsXG4gICAgICAgICAgICAnZGF0YS1saW5rJzogJ3N0eWxlJyxcbiAgICAgICAgICAgIGxhYmVsOiAnU3R5bGVzJyxcbiAgICAgICAgICAgIGRlcFR5cGVzOiBbJ2NvbXBvbmVudCddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAndHJlZScsXG4gICAgICAgICAgICBocmVmOiAnI3RyZWUnLFxuICAgICAgICAgICAgJ2RhdGEtbGluayc6ICdkb20tdHJlZScsXG4gICAgICAgICAgICBsYWJlbDogJ0RPTSBUcmVlJyxcbiAgICAgICAgICAgIGRlcFR5cGVzOiBbJ2NvbXBvbmVudCddXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnZXhhbXBsZScsXG4gICAgICAgICAgICBocmVmOiAnI2V4YW1wbGUnLFxuICAgICAgICAgICAgJ2RhdGEtbGluayc6ICdleGFtcGxlJyxcbiAgICAgICAgICAgIGxhYmVsOiAnRXhhbXBsZXMnLFxuICAgICAgICAgICAgZGVwVHlwZXM6IFsnY29tcG9uZW50JywgJ2RpcmVjdGl2ZScsICdpbmplY3RhYmxlJywgJ3BpcGUnXVxuICAgICAgICB9XG4gICAgXVxufTtcblxuLyoqXG4gKiBNYXggbGVuZ3RoIGZvciB0aGUgc3RyaW5nIG9mIGEgZmlsZSBkdXJpbmcgTHVuciBzZWFyY2ggZW5naW5lIGluZGV4aW5nLlxuICogUHJldmVudCBzdGFjayBzaXplIGV4Y2VlZGVkXG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0laRV9GSUxFX1NFQVJDSF9JTkRFWCA9IDUwMDAwO1xuXG4vKipcbiAqIE1heCBsZW5ndGggZm9yIHRoZSBzdHJpbmcgb2YgYSBmaWxlIGR1cmluZyBjaGVlcmlvIHBhcnNpbmcuXG4gKiBQcmV2ZW50IHN0YWNrIHNpemUgZXhjZWVkZWRcbiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9TSVpFX0ZJTEVfQ0hFRVJJT19QQVJTSU5HID0gNDAwMDAwMDAwO1xuIl19