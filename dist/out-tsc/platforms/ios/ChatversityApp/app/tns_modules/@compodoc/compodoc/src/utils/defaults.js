"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPODOC_DEFAULTS = {
    title: 'Application documentation',
    additionalEntryName: 'Additional documentation',
    additionalEntryPath: 'additional-documentation',
    folder: './documentation/',
    port: 8080,
    theme: 'gitbook',
    exportFormat: 'html',
    exportFormatsSupported: ['html', 'json'],
    base: '/',
    defaultCoverageThreshold: 70,
    defaultCoverageMinimumPerFile: 0,
    coverageTestThresholdFail: true,
    toggleMenuItems: ['all'],
    navTabConfig: [],
    disableSourceCode: false,
    disableDomTree: false,
    disableTemplateTab: false,
    disableStyleTab: false,
    disableGraph: false,
    disableMainGraph: false,
    disableCoverage: false,
    disablePrivate: false,
    disableProtected: false,
    disableInternal: false,
    disableLifeCycleHooks: false,
    disableRoutesGraph: false,
    PAGE_TYPES: {
        ROOT: 'root',
        INTERNAL: 'internal'
    },
    gaSite: 'auto',
    coverageTestShowOnlyFailed: false,
    language: 'en-US'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL0NoYXR2ZXJzaXR5QXBwL2FwcC90bnNfbW9kdWxlcy9AY29tcG9kb2MvY29tcG9kb2Mvc3JjL3V0aWxzL2RlZmF1bHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQWEsUUFBQSxpQkFBaUIsR0FBRztJQUM3QixLQUFLLEVBQUUsMkJBQTJCO0lBQ2xDLG1CQUFtQixFQUFFLDBCQUEwQjtJQUMvQyxtQkFBbUIsRUFBRSwwQkFBMEI7SUFDL0MsTUFBTSxFQUFFLGtCQUFrQjtJQUMxQixJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUssRUFBRSxTQUFTO0lBQ2hCLFlBQVksRUFBRSxNQUFNO0lBQ3BCLHNCQUFzQixFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztJQUN4QyxJQUFJLEVBQUUsR0FBRztJQUNULHdCQUF3QixFQUFFLEVBQUU7SUFDNUIsNkJBQTZCLEVBQUUsQ0FBQztJQUNoQyx5QkFBeUIsRUFBRSxJQUFJO0lBQy9CLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUN4QixZQUFZLEVBQUUsRUFBRTtJQUNoQixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLGNBQWMsRUFBRSxLQUFLO0lBQ3JCLGtCQUFrQixFQUFFLEtBQUs7SUFDekIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsWUFBWSxFQUFFLEtBQUs7SUFDbkIsZ0JBQWdCLEVBQUUsS0FBSztJQUN2QixlQUFlLEVBQUUsS0FBSztJQUN0QixjQUFjLEVBQUUsS0FBSztJQUNyQixnQkFBZ0IsRUFBRSxLQUFLO0lBQ3ZCLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLHFCQUFxQixFQUFFLEtBQUs7SUFDNUIsa0JBQWtCLEVBQUUsS0FBSztJQUN6QixVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxVQUFVO0tBQ3ZCO0lBQ0QsTUFBTSxFQUFFLE1BQU07SUFDZCwwQkFBMEIsRUFBRSxLQUFLO0lBQ2pDLFFBQVEsRUFBRSxPQUFPO0NBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgQ09NUE9ET0NfREVGQVVMVFMgPSB7XG4gICAgdGl0bGU6ICdBcHBsaWNhdGlvbiBkb2N1bWVudGF0aW9uJyxcbiAgICBhZGRpdGlvbmFsRW50cnlOYW1lOiAnQWRkaXRpb25hbCBkb2N1bWVudGF0aW9uJyxcbiAgICBhZGRpdGlvbmFsRW50cnlQYXRoOiAnYWRkaXRpb25hbC1kb2N1bWVudGF0aW9uJyxcbiAgICBmb2xkZXI6ICcuL2RvY3VtZW50YXRpb24vJyxcbiAgICBwb3J0OiA4MDgwLFxuICAgIHRoZW1lOiAnZ2l0Ym9vaycsXG4gICAgZXhwb3J0Rm9ybWF0OiAnaHRtbCcsXG4gICAgZXhwb3J0Rm9ybWF0c1N1cHBvcnRlZDogWydodG1sJywgJ2pzb24nXSxcbiAgICBiYXNlOiAnLycsXG4gICAgZGVmYXVsdENvdmVyYWdlVGhyZXNob2xkOiA3MCxcbiAgICBkZWZhdWx0Q292ZXJhZ2VNaW5pbXVtUGVyRmlsZTogMCxcbiAgICBjb3ZlcmFnZVRlc3RUaHJlc2hvbGRGYWlsOiB0cnVlLFxuICAgIHRvZ2dsZU1lbnVJdGVtczogWydhbGwnXSxcbiAgICBuYXZUYWJDb25maWc6IFtdLFxuICAgIGRpc2FibGVTb3VyY2VDb2RlOiBmYWxzZSxcbiAgICBkaXNhYmxlRG9tVHJlZTogZmFsc2UsXG4gICAgZGlzYWJsZVRlbXBsYXRlVGFiOiBmYWxzZSxcbiAgICBkaXNhYmxlU3R5bGVUYWI6IGZhbHNlLFxuICAgIGRpc2FibGVHcmFwaDogZmFsc2UsXG4gICAgZGlzYWJsZU1haW5HcmFwaDogZmFsc2UsXG4gICAgZGlzYWJsZUNvdmVyYWdlOiBmYWxzZSxcbiAgICBkaXNhYmxlUHJpdmF0ZTogZmFsc2UsXG4gICAgZGlzYWJsZVByb3RlY3RlZDogZmFsc2UsXG4gICAgZGlzYWJsZUludGVybmFsOiBmYWxzZSxcbiAgICBkaXNhYmxlTGlmZUN5Y2xlSG9va3M6IGZhbHNlLFxuICAgIGRpc2FibGVSb3V0ZXNHcmFwaDogZmFsc2UsXG4gICAgUEFHRV9UWVBFUzoge1xuICAgICAgICBST09UOiAncm9vdCcsXG4gICAgICAgIElOVEVSTkFMOiAnaW50ZXJuYWwnXG4gICAgfSxcbiAgICBnYVNpdGU6ICdhdXRvJyxcbiAgICBjb3ZlcmFnZVRlc3RTaG93T25seUZhaWxlZDogZmFsc2UsXG4gICAgbGFuZ3VhZ2U6ICdlbi1VUydcbn07XG4iXX0=