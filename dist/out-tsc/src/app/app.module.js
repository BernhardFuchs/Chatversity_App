"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Angular Component Imports
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var http_1 = require("@angular/common/http");
var auth_service_1 = require("./Core/_services/auth.service");
var user_service_1 = require("./Core/_services/user.service");
// Angular Bootstrap
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
// Component Import
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
// Dashboard Component Imports
var dashboard_component_1 = require("./dashboard/dashboard.component");
// Error Component Imports
var error_component_1 = require("./Error-Views/error/error.component");
var page_not_found_component_1 = require("./Error-Views/page-not-found/page-not-found.component");
// Home Component Imports
var view_latest_news_component_1 = require("./Home/view-latest-news/view-latest-news.component");
var view_navigation_home_component_1 = require("./Home/view-navigation-home/view-navigation-home.component");
var view_friends_home_component_1 = require("./Home/view-friends-home/view-friends-home.component");
// Messages Component Imports
var messages_component_1 = require("./messages/messages.component");
// Onboarding Component Imports
var login_component_1 = require("./Onboarding/login/login.component");
var signup_component_1 = require("./Onboarding/signup/signup.component");
var forgot_component_1 = require("./Onboarding/forgot/forgot.component");
var new_user_component_1 = require("./Onboarding/new-user/new-user.component");
// Profile Component Imports
var profile_component_1 = require("./Profile-Views/profile/profile.component");
var small_component_1 = require("./Profile-Views/small/small.component");
var settings_profile_component_1 = require("./Profile-Views/settings-profile/settings-profile.component");
// Settings Component Imports
var settings_component_1 = require("./Settings-Views/settings/settings.component");
// Shared Component Imports
var footer_component_1 = require("./Shared/footer/footer.component");
var navbar_component_1 = require("./Shared/navbar/navbar.component");
// Okta Guard and Service
var okta_angular_1 = require("@okta/okta-angular");
var app_service_1 = require("./app.service");
var callback_component_1 = require("./Core/callback/callback.component");
var protected_component_1 = require("./Core/protected/protected.component");
var okta_angular_2 = require("@okta/okta-angular");
var app_routes_1 = require("./app.routes");
var forms_1 = require("@angular/forms");
var service_worker_1 = require("@angular/service-worker");
var environment_1 = require("../environments/environment");
var rooms_component_1 = require("./rooms/rooms.component");
var scroll_to_top_directive_1 = require("./scroll-to-top.directive");
var privacy_settings_component_1 = require("./Settings-Views/privacy-settings/privacy-settings.component");
var security_settings_component_1 = require("./Settings-Views/security-settings/security-settings.component");
var connection_settings_component_1 = require("./Settings-Views/connection-settings/connection-settings.component");
var top_bar_component_1 = require("./Shared/top-bar/top-bar.component");
var messaging_service_1 = require("./Core/_services/messaging.service");
var config = {
    issuer: 'https://dev-117825.okta.com',
    redirectUri: 'http://localhost:4200/implicit/callback',
    clientId: '0oadacumlPWmV9j5a356'
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                error_component_1.ErrorComponent,
                login_component_1.LoginComponent,
                signup_component_1.SignupComponent,
                profile_component_1.ProfileComponent,
                settings_component_1.SettingsComponent,
                forgot_component_1.ForgotComponent,
                small_component_1.SmallComponent,
                callback_component_1.CallbackComponent,
                protected_component_1.ProtectedComponent,
                page_not_found_component_1.PageNotFoundComponent,
                dashboard_component_1.DashboardComponent,
                callback_component_1.CallbackComponent,
                footer_component_1.FooterComponent,
                navbar_component_1.NavbarComponent,
                messages_component_1.MessagesComponent,
                settings_profile_component_1.SettingsProfileComponent,
                new_user_component_1.NewUserComponent,
                view_latest_news_component_1.ViewLatestNewsComponent,
                view_navigation_home_component_1.ViewNavigationHomeComponent,
                view_friends_home_component_1.ViewFriendsHomeComponent,
                rooms_component_1.RoomsComponent,
                scroll_to_top_directive_1.ScrollToTopDirective,
                privacy_settings_component_1.PrivacySettingsComponent,
                security_settings_component_1.SecuritySettingsComponent,
                connection_settings_component_1.ConnectionSettingsComponent,
                top_bar_component_1.TopBarComponent
            ],
            imports: [
                router_1.RouterModule.forRoot(app_routes_1.routes),
                okta_angular_2.OktaAuthModule.initAuth(config),
                platform_browser_1.BrowserModule,
                http_1.HttpClientModule,
                app_routing_module_1.AppRoutingModule,
                router_1.RouterModule,
                ng_bootstrap_1.NgbModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment_1.environment.production })
            ],
            providers: [
                okta_angular_1.OktaAuthGuard,
                app_service_1.OktaAuthService,
                auth_service_1.AuthService,
                user_service_1.UserService,
                messaging_service_1.MessagingService
            ],
            bootstrap: [app_component_1.AppComponent],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUE0QjtBQUM1QixzQ0FBeUM7QUFDekMsOERBQTBEO0FBQzFELDBDQUF1RDtBQUN2RCw2Q0FBd0Q7QUFDeEQsOERBQTREO0FBQzVELDhEQUE0RDtBQUU1RCxvQkFBb0I7QUFDcEIsMkRBQXVEO0FBRXZELG1CQUFtQjtBQUNuQiwyREFBd0Q7QUFDeEQsaURBQStDO0FBRS9DLDhCQUE4QjtBQUM5Qix1RUFBcUU7QUFFckUsMEJBQTBCO0FBQzFCLHVFQUFxRTtBQUNyRSxrR0FBOEY7QUFFOUYseUJBQXlCO0FBQ3pCLGlHQUE2RjtBQUM3Riw2R0FBeUc7QUFDekcsb0dBQWdHO0FBRWhHLDZCQUE2QjtBQUM3QixvRUFBa0U7QUFFbEUsK0JBQStCO0FBQy9CLHNFQUFvRTtBQUNwRSx5RUFBdUU7QUFDdkUseUVBQXVFO0FBQ3ZFLCtFQUE0RTtBQUU1RSw0QkFBNEI7QUFDNUIsK0VBQTZFO0FBQzdFLHlFQUF1RTtBQUN2RSwwR0FBdUc7QUFFdkcsNkJBQTZCO0FBQzdCLG1GQUFpRjtBQUVqRiwyQkFBMkI7QUFDM0IscUVBQW1FO0FBQ25FLHFFQUFtRTtBQUVuRSx5QkFBeUI7QUFDekIsbURBQTBFO0FBQzFFLDZDQUFnRDtBQUNoRCx5RUFBdUU7QUFDdkUsNEVBQTBFO0FBQzFFLG1EQUFvRDtBQUNwRCwyQ0FBc0M7QUFDdEMsd0NBQWtFO0FBQ2xFLDBEQUE4RDtBQUM5RCwyREFBMEQ7QUFDMUQsMkRBQXlEO0FBQ3pELHFFQUFpRTtBQUNqRSwyR0FBd0c7QUFDeEcsOEdBQTJHO0FBQzNHLG9IQUFpSDtBQUNqSCx3RUFBcUU7QUFDckUsd0VBQXNFO0FBRXRFLElBQU0sTUFBTSxHQUFHO0lBQ2IsTUFBTSxFQUFFLDZCQUE2QjtJQUNyQyxXQUFXLEVBQUUseUNBQXlDO0lBQ3RELFFBQVEsRUFBRSxzQkFBc0I7Q0FDakMsQ0FBQztBQXVERjtJQUFBO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBcERyQixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUU7Z0JBQ1osNEJBQVk7Z0JBQ1osZ0NBQWM7Z0JBQ2QsZ0NBQWM7Z0JBQ2Qsa0NBQWU7Z0JBQ2Ysb0NBQWdCO2dCQUNoQixzQ0FBaUI7Z0JBQ2pCLGtDQUFlO2dCQUNmLGdDQUFjO2dCQUNkLHNDQUFpQjtnQkFDakIsd0NBQWtCO2dCQUNsQixnREFBcUI7Z0JBQ3JCLHdDQUFrQjtnQkFDbEIsc0NBQWlCO2dCQUNqQixrQ0FBZTtnQkFDZixrQ0FBZTtnQkFDZixzQ0FBaUI7Z0JBQ2pCLHFEQUF3QjtnQkFDeEIscUNBQWdCO2dCQUNoQixvREFBdUI7Z0JBQ3ZCLDREQUEyQjtnQkFDM0Isc0RBQXdCO2dCQUN4QixnQ0FBYztnQkFDZCw4Q0FBb0I7Z0JBQ3BCLHFEQUF3QjtnQkFDeEIsdURBQXlCO2dCQUN6QiwyREFBMkI7Z0JBQzNCLG1DQUFlO2FBQ2hCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLHFCQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFNLENBQUM7Z0JBQzVCLDZCQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsZ0NBQWE7Z0JBQ2IsdUJBQWdCO2dCQUNoQixxQ0FBZ0I7Z0JBQ2hCLHFCQUFZO2dCQUNaLHdCQUFTO2dCQUNULG1CQUFXO2dCQUNYLDJCQUFtQjtnQkFDbkIsb0NBQW1CLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsT0FBTyxFQUFFLHlCQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDcEY7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsNEJBQWE7Z0JBQ2IsNkJBQWU7Z0JBQ2YsMEJBQVc7Z0JBQ1gsMEJBQVc7Z0JBQ1gsb0NBQWdCO2FBQ2pCO1lBQ0QsU0FBUyxFQUFFLENBQUMsNEJBQVksQ0FBQztTQUMxQixDQUFDO09BRVcsU0FBUyxDQUFJO0lBQUQsZ0JBQUM7Q0FBQSxBQUExQixJQUEwQjtBQUFiLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQW5ndWxhciBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSwgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4vQ29yZS9fc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy91c2VyLnNlcnZpY2UnO1xuXG4vLyBBbmd1bGFyIEJvb3RzdHJhcFxuaW1wb3J0IHsgTmdiTW9kdWxlIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuXG4vLyBDb21wb25lbnQgSW1wb3J0XG5pbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSAnLi9hcHAtcm91dGluZy5tb2R1bGUnO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcblxuLy8gRGFzaGJvYXJkIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBEYXNoYm9hcmRDb21wb25lbnQgfSBmcm9tICcuL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50JztcblxuLy8gRXJyb3IgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi9FcnJvci1WaWV3cy9lcnJvci9lcnJvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgUGFnZU5vdEZvdW5kQ29tcG9uZW50IH0gZnJvbSAnLi9FcnJvci1WaWV3cy9wYWdlLW5vdC1mb3VuZC9wYWdlLW5vdC1mb3VuZC5jb21wb25lbnQnO1xuXG4vLyBIb21lIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBWaWV3TGF0ZXN0TmV3c0NvbXBvbmVudCB9IGZyb20gJy4vSG9tZS92aWV3LWxhdGVzdC1uZXdzL3ZpZXctbGF0ZXN0LW5ld3MuY29tcG9uZW50JztcbmltcG9ydCB7IFZpZXdOYXZpZ2F0aW9uSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vSG9tZS92aWV3LW5hdmlnYXRpb24taG9tZS92aWV3LW5hdmlnYXRpb24taG9tZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld0ZyaWVuZHNIb21lQ29tcG9uZW50IH0gZnJvbSAnLi9Ib21lL3ZpZXctZnJpZW5kcy1ob21lL3ZpZXctZnJpZW5kcy1ob21lLmNvbXBvbmVudCc7XG5cbi8vIE1lc3NhZ2VzIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBNZXNzYWdlc0NvbXBvbmVudCB9IGZyb20gJy4vbWVzc2FnZXMvbWVzc2FnZXMuY29tcG9uZW50JztcblxuLy8gT25ib2FyZGluZyBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgTG9naW5Db21wb25lbnQgfSBmcm9tICcuL09uYm9hcmRpbmcvbG9naW4vbG9naW4uY29tcG9uZW50JztcbmltcG9ydCB7IFNpZ251cENvbXBvbmVudCB9IGZyb20gJy4vT25ib2FyZGluZy9zaWdudXAvc2lnbnVwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGb3Jnb3RDb21wb25lbnQgfSBmcm9tICcuL09uYm9hcmRpbmcvZm9yZ290L2ZvcmdvdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmV3VXNlckNvbXBvbmVudCB9IGZyb20gJy4vT25ib2FyZGluZy9uZXctdXNlci9uZXctdXNlci5jb21wb25lbnQnO1xuXG4vLyBQcm9maWxlIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBQcm9maWxlQ29tcG9uZW50IH0gZnJvbSAnLi9Qcm9maWxlLVZpZXdzL3Byb2ZpbGUvcHJvZmlsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU21hbGxDb21wb25lbnQgfSBmcm9tICcuL1Byb2ZpbGUtVmlld3Mvc21hbGwvc21hbGwuY29tcG9uZW50JztcbmltcG9ydCB7IFNldHRpbmdzUHJvZmlsZUNvbXBvbmVudCB9IGZyb20gJy4vUHJvZmlsZS1WaWV3cy9zZXR0aW5ncy1wcm9maWxlL3NldHRpbmdzLXByb2ZpbGUuY29tcG9uZW50JztcblxuLy8gU2V0dGluZ3MgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IFNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9TZXR0aW5ncy1WaWV3cy9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnQnO1xuXG4vLyBTaGFyZWQgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IEZvb3RlckNvbXBvbmVudCB9IGZyb20gJy4vU2hhcmVkL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5hdmJhckNvbXBvbmVudCB9IGZyb20gJy4vU2hhcmVkL25hdmJhci9uYXZiYXIuY29tcG9uZW50JztcblxuLy8gT2t0YSBHdWFyZCBhbmQgU2VydmljZVxuaW1wb3J0IHsgT2t0YUNhbGxiYWNrQ29tcG9uZW50LCBPa3RhQXV0aEd1YXJkIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcbmltcG9ydCB7IE9rdGFBdXRoU2VydmljZSB9IGZyb20gJy4vYXBwLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FsbGJhY2tDb21wb25lbnQgfSBmcm9tICcuL0NvcmUvY2FsbGJhY2svY2FsbGJhY2suY29tcG9uZW50JztcbmltcG9ydCB7IFByb3RlY3RlZENvbXBvbmVudCB9IGZyb20gJy4vQ29yZS9wcm90ZWN0ZWQvcHJvdGVjdGVkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPa3RhQXV0aE1vZHVsZSB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tICcuL2FwcC5yb3V0ZXMnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTZXJ2aWNlV29ya2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvc2VydmljZS13b3JrZXInO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgUm9vbXNDb21wb25lbnQgfSBmcm9tICcuL3Jvb21zL3Jvb21zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTY3JvbGxUb1RvcERpcmVjdGl2ZSB9IGZyb20gJy4vc2Nyb2xsLXRvLXRvcC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUHJpdmFjeVNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9TZXR0aW5ncy1WaWV3cy9wcml2YWN5LXNldHRpbmdzL3ByaXZhY3ktc2V0dGluZ3MuY29tcG9uZW50JztcbmltcG9ydCB7IFNlY3VyaXR5U2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL1NldHRpbmdzLVZpZXdzL3NlY3VyaXR5LXNldHRpbmdzL3NlY3VyaXR5LXNldHRpbmdzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb25uZWN0aW9uU2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL1NldHRpbmdzLVZpZXdzL2Nvbm5lY3Rpb24tc2V0dGluZ3MvY29ubmVjdGlvbi1zZXR0aW5ncy5jb21wb25lbnQnO1xuaW1wb3J0IHsgVG9wQmFyQ29tcG9uZW50IH0gZnJvbSAnLi9TaGFyZWQvdG9wLWJhci90b3AtYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5cbmNvbnN0IGNvbmZpZyA9IHtcbiAgaXNzdWVyOiAnaHR0cHM6Ly9kZXYtMTE3ODI1Lm9rdGEuY29tJyxcbiAgcmVkaXJlY3RVcmk6ICdodHRwOi8vbG9jYWxob3N0OjQyMDAvaW1wbGljaXQvY2FsbGJhY2snLFxuICBjbGllbnRJZDogJzBvYWRhY3VtbFBXbVY5ajVhMzU2J1xufTtcblxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBDb21wb25lbnQsXG4gICAgRXJyb3JDb21wb25lbnQsXG4gICAgTG9naW5Db21wb25lbnQsXG4gICAgU2lnbnVwQ29tcG9uZW50LFxuICAgIFByb2ZpbGVDb21wb25lbnQsXG4gICAgU2V0dGluZ3NDb21wb25lbnQsXG4gICAgRm9yZ290Q29tcG9uZW50LFxuICAgIFNtYWxsQ29tcG9uZW50LFxuICAgIENhbGxiYWNrQ29tcG9uZW50LFxuICAgIFByb3RlY3RlZENvbXBvbmVudCxcbiAgICBQYWdlTm90Rm91bmRDb21wb25lbnQsXG4gICAgRGFzaGJvYXJkQ29tcG9uZW50LFxuICAgIENhbGxiYWNrQ29tcG9uZW50LFxuICAgIEZvb3RlckNvbXBvbmVudCxcbiAgICBOYXZiYXJDb21wb25lbnQsXG4gICAgTWVzc2FnZXNDb21wb25lbnQsXG4gICAgU2V0dGluZ3NQcm9maWxlQ29tcG9uZW50LFxuICAgIE5ld1VzZXJDb21wb25lbnQsXG4gICAgVmlld0xhdGVzdE5ld3NDb21wb25lbnQsXG4gICAgVmlld05hdmlnYXRpb25Ib21lQ29tcG9uZW50LFxuICAgIFZpZXdGcmllbmRzSG9tZUNvbXBvbmVudCxcbiAgICBSb29tc0NvbXBvbmVudCxcbiAgICBTY3JvbGxUb1RvcERpcmVjdGl2ZSxcbiAgICBQcml2YWN5U2V0dGluZ3NDb21wb25lbnQsXG4gICAgU2VjdXJpdHlTZXR0aW5nc0NvbXBvbmVudCxcbiAgICBDb25uZWN0aW9uU2V0dGluZ3NDb21wb25lbnQsXG4gICAgVG9wQmFyQ29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChyb3V0ZXMpLFxuICAgIE9rdGFBdXRoTW9kdWxlLmluaXRBdXRoKGNvbmZpZyksXG4gICAgQnJvd3Nlck1vZHVsZSxcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICAgIEFwcFJvdXRpbmdNb2R1bGUsXG4gICAgUm91dGVyTW9kdWxlLFxuICAgIE5nYk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIFNlcnZpY2VXb3JrZXJNb2R1bGUucmVnaXN0ZXIoJ25nc3ctd29ya2VyLmpzJywgeyBlbmFibGVkOiBlbnZpcm9ubWVudC5wcm9kdWN0aW9uIH0pXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIE9rdGFBdXRoR3VhcmQsXG4gICAgT2t0YUF1dGhTZXJ2aWNlLFxuICAgIEF1dGhTZXJ2aWNlLFxuICAgIFVzZXJTZXJ2aWNlLFxuICAgIE1lc3NhZ2luZ1NlcnZpY2VcbiAgXSxcbiAgYm9vdHN0cmFwOiBbQXBwQ29tcG9uZW50XSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9XG4iXX0=