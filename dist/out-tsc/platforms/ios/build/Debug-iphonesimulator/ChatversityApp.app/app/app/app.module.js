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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lc2ltdWxhdG9yL0NoYXR2ZXJzaXR5QXBwLmFwcC9hcHAvYXBwL2FwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBNEI7QUFDNUIsc0NBQXlDO0FBQ3pDLDhEQUEwRDtBQUMxRCwwQ0FBdUQ7QUFDdkQsNkNBQXdEO0FBQ3hELDhEQUE0RDtBQUM1RCw4REFBNEQ7QUFFNUQsb0JBQW9CO0FBQ3BCLDJEQUF1RDtBQUV2RCxtQkFBbUI7QUFDbkIsMkRBQXdEO0FBQ3hELGlEQUErQztBQUUvQyw4QkFBOEI7QUFDOUIsdUVBQXFFO0FBRXJFLDBCQUEwQjtBQUMxQix1RUFBcUU7QUFDckUsa0dBQThGO0FBRTlGLHlCQUF5QjtBQUN6QixpR0FBNkY7QUFDN0YsNkdBQXlHO0FBQ3pHLG9HQUFnRztBQUVoRyw2QkFBNkI7QUFDN0Isb0VBQWtFO0FBRWxFLCtCQUErQjtBQUMvQixzRUFBb0U7QUFDcEUseUVBQXVFO0FBQ3ZFLHlFQUF1RTtBQUN2RSwrRUFBNEU7QUFFNUUsNEJBQTRCO0FBQzVCLCtFQUE2RTtBQUM3RSx5RUFBdUU7QUFDdkUsMEdBQXVHO0FBRXZHLDZCQUE2QjtBQUM3QixtRkFBaUY7QUFFakYsMkJBQTJCO0FBQzNCLHFFQUFtRTtBQUNuRSxxRUFBbUU7QUFFbkUseUJBQXlCO0FBQ3pCLG1EQUEwRTtBQUMxRSw2Q0FBZ0Q7QUFDaEQseUVBQXVFO0FBQ3ZFLDRFQUEwRTtBQUMxRSxtREFBb0Q7QUFDcEQsMkNBQXNDO0FBQ3RDLHdDQUFrRTtBQUNsRSwwREFBOEQ7QUFDOUQsMkRBQTBEO0FBQzFELDJEQUF5RDtBQUN6RCxxRUFBaUU7QUFDakUsMkdBQXdHO0FBQ3hHLDhHQUEyRztBQUMzRyxvSEFBaUg7QUFDakgsd0VBQXFFO0FBQ3JFLHdFQUFzRTtBQUV0RSxJQUFNLE1BQU0sR0FBRztJQUNiLE1BQU0sRUFBRSw2QkFBNkI7SUFDckMsV0FBVyxFQUFFLHlDQUF5QztJQUN0RCxRQUFRLEVBQUUsc0JBQXNCO0NBQ2pDLENBQUM7QUF1REY7SUFBQTtJQUF5QixDQUFDO0lBQWIsU0FBUztRQXBEckIsZUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFO2dCQUNaLDRCQUFZO2dCQUNaLGdDQUFjO2dCQUNkLGdDQUFjO2dCQUNkLGtDQUFlO2dCQUNmLG9DQUFnQjtnQkFDaEIsc0NBQWlCO2dCQUNqQixrQ0FBZTtnQkFDZixnQ0FBYztnQkFDZCxzQ0FBaUI7Z0JBQ2pCLHdDQUFrQjtnQkFDbEIsZ0RBQXFCO2dCQUNyQix3Q0FBa0I7Z0JBQ2xCLHNDQUFpQjtnQkFDakIsa0NBQWU7Z0JBQ2Ysa0NBQWU7Z0JBQ2Ysc0NBQWlCO2dCQUNqQixxREFBd0I7Z0JBQ3hCLHFDQUFnQjtnQkFDaEIsb0RBQXVCO2dCQUN2Qiw0REFBMkI7Z0JBQzNCLHNEQUF3QjtnQkFDeEIsZ0NBQWM7Z0JBQ2QsOENBQW9CO2dCQUNwQixxREFBd0I7Z0JBQ3hCLHVEQUF5QjtnQkFDekIsMkRBQTJCO2dCQUMzQixtQ0FBZTthQUNoQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxxQkFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBTSxDQUFDO2dCQUM1Qiw2QkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQy9CLGdDQUFhO2dCQUNiLHVCQUFnQjtnQkFDaEIscUNBQWdCO2dCQUNoQixxQkFBWTtnQkFDWix3QkFBUztnQkFDVCxtQkFBVztnQkFDWCwyQkFBbUI7Z0JBQ25CLG9DQUFtQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sRUFBRSx5QkFBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ3BGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULDRCQUFhO2dCQUNiLDZCQUFlO2dCQUNmLDBCQUFXO2dCQUNYLDBCQUFXO2dCQUNYLG9DQUFnQjthQUNqQjtZQUNELFNBQVMsRUFBRSxDQUFDLDRCQUFZLENBQUM7U0FDMUIsQ0FBQztPQUVXLFNBQVMsQ0FBSTtJQUFELGdCQUFDO0NBQUEsQUFBMUIsSUFBMEI7QUFBYiw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFuZ3VsYXIgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUsIFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4vQ29yZS9fc2VydmljZXMvdXNlci5zZXJ2aWNlJztcblxuLy8gQW5ndWxhciBCb290c3RyYXBcbmltcG9ydCB7IE5nYk1vZHVsZSB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcblxuLy8gQ29tcG9uZW50IEltcG9ydFxuaW1wb3J0IHsgQXBwUm91dGluZ01vZHVsZSB9IGZyb20gJy4vYXBwLXJvdXRpbmcubW9kdWxlJztcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XG5cbi8vIERhc2hib2FyZCBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgRGFzaGJvYXJkQ29tcG9uZW50IH0gZnJvbSAnLi9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudCc7XG5cbi8vIEVycm9yIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBFcnJvckNvbXBvbmVudCB9IGZyb20gJy4vRXJyb3ItVmlld3MvZXJyb3IvZXJyb3IuY29tcG9uZW50JztcbmltcG9ydCB7IFBhZ2VOb3RGb3VuZENvbXBvbmVudCB9IGZyb20gJy4vRXJyb3ItVmlld3MvcGFnZS1ub3QtZm91bmQvcGFnZS1ub3QtZm91bmQuY29tcG9uZW50JztcblxuLy8gSG9tZSBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgVmlld0xhdGVzdE5ld3NDb21wb25lbnQgfSBmcm9tICcuL0hvbWUvdmlldy1sYXRlc3QtbmV3cy92aWV3LWxhdGVzdC1uZXdzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBWaWV3TmF2aWdhdGlvbkhvbWVDb21wb25lbnQgfSBmcm9tICcuL0hvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50JztcbmltcG9ydCB7IFZpZXdGcmllbmRzSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vSG9tZS92aWV3LWZyaWVuZHMtaG9tZS92aWV3LWZyaWVuZHMtaG9tZS5jb21wb25lbnQnO1xuXG4vLyBNZXNzYWdlcyBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgTWVzc2FnZXNDb21wb25lbnQgfSBmcm9tICcuL21lc3NhZ2VzL21lc3NhZ2VzLmNvbXBvbmVudCc7XG5cbi8vIE9uYm9hcmRpbmcgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IExvZ2luQ29tcG9uZW50IH0gZnJvbSAnLi9PbmJvYXJkaW5nL2xvZ2luL2xvZ2luLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTaWdudXBDb21wb25lbnQgfSBmcm9tICcuL09uYm9hcmRpbmcvc2lnbnVwL3NpZ251cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRm9yZ290Q29tcG9uZW50IH0gZnJvbSAnLi9PbmJvYXJkaW5nL2ZvcmdvdC9mb3Jnb3QuY29tcG9uZW50JztcbmltcG9ydCB7IE5ld1VzZXJDb21wb25lbnQgfSBmcm9tICcuL09uYm9hcmRpbmcvbmV3LXVzZXIvbmV3LXVzZXIuY29tcG9uZW50JztcblxuLy8gUHJvZmlsZSBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgUHJvZmlsZUNvbXBvbmVudCB9IGZyb20gJy4vUHJvZmlsZS1WaWV3cy9wcm9maWxlL3Byb2ZpbGUuY29tcG9uZW50JztcbmltcG9ydCB7IFNtYWxsQ29tcG9uZW50IH0gZnJvbSAnLi9Qcm9maWxlLVZpZXdzL3NtYWxsL3NtYWxsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZXR0aW5nc1Byb2ZpbGVDb21wb25lbnQgfSBmcm9tICcuL1Byb2ZpbGUtVmlld3Mvc2V0dGluZ3MtcHJvZmlsZS9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudCc7XG5cbi8vIFNldHRpbmdzIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gJy4vU2V0dGluZ3MtVmlld3Mvc2V0dGluZ3Mvc2V0dGluZ3MuY29tcG9uZW50JztcblxuLy8gU2hhcmVkIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICcuL1NoYXJlZC9mb290ZXIvZm9vdGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOYXZiYXJDb21wb25lbnQgfSBmcm9tICcuL1NoYXJlZC9uYXZiYXIvbmF2YmFyLmNvbXBvbmVudCc7XG5cbi8vIE9rdGEgR3VhcmQgYW5kIFNlcnZpY2VcbmltcG9ydCB7IE9rdGFDYWxsYmFja0NvbXBvbmVudCwgT2t0YUF1dGhHdWFyZCB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5pbXBvcnQgeyBPa3RhQXV0aFNlcnZpY2UgfSBmcm9tICcuL2FwcC5zZXJ2aWNlJztcbmltcG9ydCB7IENhbGxiYWNrQ29tcG9uZW50IH0gZnJvbSAnLi9Db3JlL2NhbGxiYWNrL2NhbGxiYWNrLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQcm90ZWN0ZWRDb21wb25lbnQgfSBmcm9tICcuL0NvcmUvcHJvdGVjdGVkL3Byb3RlY3RlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT2t0YUF1dGhNb2R1bGUgfSBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9hcHAucm91dGVzJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU2VydmljZVdvcmtlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3NlcnZpY2Utd29ya2VyJztcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IFJvb21zQ29tcG9uZW50IH0gZnJvbSAnLi9yb29tcy9yb29tcy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2Nyb2xsVG9Ub3BEaXJlY3RpdmUgfSBmcm9tICcuL3Njcm9sbC10by10b3AuZGlyZWN0aXZlJztcbmltcG9ydCB7IFByaXZhY3lTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gJy4vU2V0dGluZ3MtVmlld3MvcHJpdmFjeS1zZXR0aW5ncy9wcml2YWN5LXNldHRpbmdzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTZWN1cml0eVNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9TZXR0aW5ncy1WaWV3cy9zZWN1cml0eS1zZXR0aW5ncy9zZWN1cml0eS1zZXR0aW5ncy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29ubmVjdGlvblNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9TZXR0aW5ncy1WaWV3cy9jb25uZWN0aW9uLXNldHRpbmdzL2Nvbm5lY3Rpb24tc2V0dGluZ3MuY29tcG9uZW50JztcbmltcG9ydCB7IFRvcEJhckNvbXBvbmVudCB9IGZyb20gJy4vU2hhcmVkL3RvcC1iYXIvdG9wLWJhci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWVzc2FnaW5nU2VydmljZSB9IGZyb20gJy4vQ29yZS9fc2VydmljZXMvbWVzc2FnaW5nLnNlcnZpY2UnO1xuXG5jb25zdCBjb25maWcgPSB7XG4gIGlzc3VlcjogJ2h0dHBzOi8vZGV2LTExNzgyNS5va3RhLmNvbScsXG4gIHJlZGlyZWN0VXJpOiAnaHR0cDovL2xvY2FsaG9zdDo0MjAwL2ltcGxpY2l0L2NhbGxiYWNrJyxcbiAgY2xpZW50SWQ6ICcwb2FkYWN1bWxQV21WOWo1YTM1Nidcbn07XG5cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQXBwQ29tcG9uZW50LFxuICAgIEVycm9yQ29tcG9uZW50LFxuICAgIExvZ2luQ29tcG9uZW50LFxuICAgIFNpZ251cENvbXBvbmVudCxcbiAgICBQcm9maWxlQ29tcG9uZW50LFxuICAgIFNldHRpbmdzQ29tcG9uZW50LFxuICAgIEZvcmdvdENvbXBvbmVudCxcbiAgICBTbWFsbENvbXBvbmVudCxcbiAgICBDYWxsYmFja0NvbXBvbmVudCxcbiAgICBQcm90ZWN0ZWRDb21wb25lbnQsXG4gICAgUGFnZU5vdEZvdW5kQ29tcG9uZW50LFxuICAgIERhc2hib2FyZENvbXBvbmVudCxcbiAgICBDYWxsYmFja0NvbXBvbmVudCxcbiAgICBGb290ZXJDb21wb25lbnQsXG4gICAgTmF2YmFyQ29tcG9uZW50LFxuICAgIE1lc3NhZ2VzQ29tcG9uZW50LFxuICAgIFNldHRpbmdzUHJvZmlsZUNvbXBvbmVudCxcbiAgICBOZXdVc2VyQ29tcG9uZW50LFxuICAgIFZpZXdMYXRlc3ROZXdzQ29tcG9uZW50LFxuICAgIFZpZXdOYXZpZ2F0aW9uSG9tZUNvbXBvbmVudCxcbiAgICBWaWV3RnJpZW5kc0hvbWVDb21wb25lbnQsXG4gICAgUm9vbXNDb21wb25lbnQsXG4gICAgU2Nyb2xsVG9Ub3BEaXJlY3RpdmUsXG4gICAgUHJpdmFjeVNldHRpbmdzQ29tcG9uZW50LFxuICAgIFNlY3VyaXR5U2V0dGluZ3NDb21wb25lbnQsXG4gICAgQ29ubmVjdGlvblNldHRpbmdzQ29tcG9uZW50LFxuICAgIFRvcEJhckNvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgUm91dGVyTW9kdWxlLmZvclJvb3Qocm91dGVzKSxcbiAgICBPa3RhQXV0aE1vZHVsZS5pbml0QXV0aChjb25maWcpLFxuICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgSHR0cENsaWVudE1vZHVsZSxcbiAgICBBcHBSb3V0aW5nTW9kdWxlLFxuICAgIFJvdXRlck1vZHVsZSxcbiAgICBOZ2JNb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKCduZ3N3LXdvcmtlci5qcycsIHsgZW5hYmxlZDogZW52aXJvbm1lbnQucHJvZHVjdGlvbiB9KVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBPa3RhQXV0aEd1YXJkLFxuICAgIE9rdGFBdXRoU2VydmljZSxcbiAgICBBdXRoU2VydmljZSxcbiAgICBVc2VyU2VydmljZSxcbiAgICBNZXNzYWdpbmdTZXJ2aWNlXG4gIF0sXG4gIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF0sXG59KVxuXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuIl19