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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvdG5zX21vZHVsZXMvQGNvbXBvZG9jL2NvbXBvZG9jL3NyYy91dGlscy9jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLGtCQUFrQixHQUFHO0lBQzlCLGlCQUFpQixFQUFFO1FBQ2Y7WUFDSSxFQUFFLEVBQUUsTUFBTTtZQUNWLElBQUksRUFBRSxPQUFPO1lBQ2IsV0FBVyxFQUFFLE1BQU07WUFDbkIsS0FBSyxFQUFFLE1BQU07WUFDYixRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDcEI7UUFDRDtZQUNJLEVBQUUsRUFBRSxRQUFRO1lBQ1osSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsUUFBUTtZQUNyQixLQUFLLEVBQUUsUUFBUTtZQUNmLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztTQUNwQjtRQUNEO1lBQ0ksRUFBRSxFQUFFLFFBQVE7WUFDWixJQUFJLEVBQUUsU0FBUztZQUNmLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ3BCO1FBQ0Q7WUFDSSxFQUFFLEVBQUUsY0FBYztZQUNsQixJQUFJLEVBQUUsZUFBZTtZQUNyQixXQUFXLEVBQUUsVUFBVTtZQUN2QixLQUFLLEVBQUUsVUFBVTtZQUNqQixRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDMUI7UUFDRDtZQUNJLEVBQUUsRUFBRSxXQUFXO1lBQ2YsSUFBSSxFQUFFLFlBQVk7WUFDbEIsV0FBVyxFQUFFLE9BQU87WUFDcEIsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDMUI7UUFDRDtZQUNJLEVBQUUsRUFBRSxNQUFNO1lBQ1YsSUFBSSxFQUFFLE9BQU87WUFDYixXQUFXLEVBQUUsVUFBVTtZQUN2QixLQUFLLEVBQUUsVUFBVTtZQUNqQixRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDMUI7UUFDRDtZQUNJLEVBQUUsRUFBRSxTQUFTO1lBQ2IsSUFBSSxFQUFFLFVBQVU7WUFDaEIsV0FBVyxFQUFFLFNBQVM7WUFDdEIsS0FBSyxFQUFFLFVBQVU7WUFDakIsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDO1NBQzdEO0tBQ0o7Q0FDSixDQUFDO0FBRUY7OztHQUdHO0FBQ1UsUUFBQSwwQkFBMEIsR0FBRyxLQUFLLENBQUM7QUFFaEQ7OztHQUdHO0FBQ1UsUUFBQSw2QkFBNkIsR0FBRyxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgQ09NUE9ET0NfQ09OU1RBTlRTID0ge1xuICAgIG5hdlRhYkRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAnaW5mbycsXG4gICAgICAgICAgICBocmVmOiAnI2luZm8nLFxuICAgICAgICAgICAgJ2RhdGEtbGluayc6ICdpbmZvJyxcbiAgICAgICAgICAgIGxhYmVsOiAnSW5mbycsXG4gICAgICAgICAgICBkZXBUeXBlczogWydhbGwnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3JlYWRtZScsXG4gICAgICAgICAgICBocmVmOiAnI3JlYWRtZScsXG4gICAgICAgICAgICAnZGF0YS1saW5rJzogJ3JlYWRtZScsXG4gICAgICAgICAgICBsYWJlbDogJ1JFQURNRScsXG4gICAgICAgICAgICBkZXBUeXBlczogWydhbGwnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3NvdXJjZScsXG4gICAgICAgICAgICBocmVmOiAnI3NvdXJjZScsXG4gICAgICAgICAgICAnZGF0YS1saW5rJzogJ3NvdXJjZScsXG4gICAgICAgICAgICBsYWJlbDogJ1NvdXJjZScsXG4gICAgICAgICAgICBkZXBUeXBlczogWydhbGwnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3RlbXBsYXRlRGF0YScsXG4gICAgICAgICAgICBocmVmOiAnI3RlbXBsYXRlRGF0YScsXG4gICAgICAgICAgICAnZGF0YS1saW5rJzogJ3RlbXBsYXRlJyxcbiAgICAgICAgICAgIGxhYmVsOiAnVGVtcGxhdGUnLFxuICAgICAgICAgICAgZGVwVHlwZXM6IFsnY29tcG9uZW50J11cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdzdHlsZURhdGEnLFxuICAgICAgICAgICAgaHJlZjogJyNzdHlsZURhdGEnLFxuICAgICAgICAgICAgJ2RhdGEtbGluayc6ICdzdHlsZScsXG4gICAgICAgICAgICBsYWJlbDogJ1N0eWxlcycsXG4gICAgICAgICAgICBkZXBUeXBlczogWydjb21wb25lbnQnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ3RyZWUnLFxuICAgICAgICAgICAgaHJlZjogJyN0cmVlJyxcbiAgICAgICAgICAgICdkYXRhLWxpbmsnOiAnZG9tLXRyZWUnLFxuICAgICAgICAgICAgbGFiZWw6ICdET00gVHJlZScsXG4gICAgICAgICAgICBkZXBUeXBlczogWydjb21wb25lbnQnXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogJ2V4YW1wbGUnLFxuICAgICAgICAgICAgaHJlZjogJyNleGFtcGxlJyxcbiAgICAgICAgICAgICdkYXRhLWxpbmsnOiAnZXhhbXBsZScsXG4gICAgICAgICAgICBsYWJlbDogJ0V4YW1wbGVzJyxcbiAgICAgICAgICAgIGRlcFR5cGVzOiBbJ2NvbXBvbmVudCcsICdkaXJlY3RpdmUnLCAnaW5qZWN0YWJsZScsICdwaXBlJ11cbiAgICAgICAgfVxuICAgIF1cbn07XG5cbi8qKlxuICogTWF4IGxlbmd0aCBmb3IgdGhlIHN0cmluZyBvZiBhIGZpbGUgZHVyaW5nIEx1bnIgc2VhcmNoIGVuZ2luZSBpbmRleGluZy5cbiAqIFByZXZlbnQgc3RhY2sgc2l6ZSBleGNlZWRlZFxuICovXG5leHBvcnQgY29uc3QgTUFYX1NJWkVfRklMRV9TRUFSQ0hfSU5ERVggPSA1MDAwMDtcblxuLyoqXG4gKiBNYXggbGVuZ3RoIGZvciB0aGUgc3RyaW5nIG9mIGEgZmlsZSBkdXJpbmcgY2hlZXJpbyBwYXJzaW5nLlxuICogUHJldmVudCBzdGFjayBzaXplIGV4Y2VlZGVkXG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfU0laRV9GSUxFX0NIRUVSSU9fUEFSU0lORyA9IDQwMDAwMDAwMDtcbiJdfQ==