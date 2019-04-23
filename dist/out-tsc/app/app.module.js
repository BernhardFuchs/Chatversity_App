"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Angular Component Imports
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var http_1 = require("@angular/common/http");
var auth_service_1 = require("./Core/_services/auth.service");
var user_service_1 = require("./Core/_services/user.service");
// import filepond module
var ngx_filepond_1 = require("ngx-filepond");
// import and register filepond file type validation plugin
var filepond_plugin_file_validate_type_1 = require("filepond-plugin-file-validate-type");
var filepond_plugin_file_rename_1 = require("filepond-plugin-file-rename");
ngx_filepond_1.registerPlugin(filepond_plugin_file_validate_type_1.default);
ngx_filepond_1.registerPlugin(filepond_plugin_file_rename_1.default);
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
var search_bar_component_1 = require("./Shared/search-bar/search-bar.component");
var search_component_1 = require("./search/search.component");
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
                top_bar_component_1.TopBarComponent,
                search_bar_component_1.SearchBarComponent,
                search_component_1.SearchComponent
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
                service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment_1.environment.production }),
                ngx_filepond_1.FilePondModule
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUE0QjtBQUM1QixzQ0FBd0M7QUFDeEMsOERBQXlEO0FBQ3pELDBDQUFzRDtBQUN0RCw2Q0FBdUQ7QUFDdkQsOERBQTJEO0FBQzNELDhEQUEyRDtBQUkzRCx5QkFBeUI7QUFDekIsNkNBQTZEO0FBRTdELDJEQUEyRDtBQUMzRCx5RkFBK0U7QUFDL0UsMkVBQWtFO0FBQ2xFLDZCQUFjLENBQUMsNENBQThCLENBQUMsQ0FBQTtBQUc5Qyw2QkFBYyxDQUFDLHFDQUF3QixDQUFDLENBQUE7QUFHeEMsb0JBQW9CO0FBQ3BCLDJEQUFzRDtBQUV0RCxtQkFBbUI7QUFDbkIsMkRBQXVEO0FBQ3ZELGlEQUE4QztBQUU5Qyw4QkFBOEI7QUFDOUIsdUVBQW9FO0FBRXBFLDBCQUEwQjtBQUMxQix1RUFBb0U7QUFDcEUsa0dBQTZGO0FBRTdGLHlCQUF5QjtBQUN6QixpR0FBNEY7QUFDNUYsNkdBQXdHO0FBQ3hHLG9HQUErRjtBQUUvRiw2QkFBNkI7QUFDN0Isb0VBQWlFO0FBRWpFLCtCQUErQjtBQUMvQixzRUFBbUU7QUFDbkUseUVBQXNFO0FBQ3RFLHlFQUFzRTtBQUN0RSwrRUFBMkU7QUFFM0UsNEJBQTRCO0FBQzVCLCtFQUE0RTtBQUM1RSx5RUFBc0U7QUFDdEUsMEdBQXNHO0FBRXRHLDZCQUE2QjtBQUM3QixtRkFBZ0Y7QUFFaEYsMkJBQTJCO0FBQzNCLHFFQUFrRTtBQUNsRSxxRUFBa0U7QUFFbEUseUJBQXlCO0FBQ3pCLG1EQUEwRTtBQUMxRSw2Q0FBZ0Q7QUFDaEQseUVBQXVFO0FBQ3ZFLDRFQUEwRTtBQUMxRSxtREFBb0Q7QUFDcEQsMkNBQXNDO0FBQ3RDLHdDQUFrRTtBQUNsRSwwREFBOEQ7QUFDOUQsMkRBQTBEO0FBQzFELDJEQUF5RDtBQUN6RCxxRUFBaUU7QUFDakUsMkdBQXdHO0FBQ3hHLDhHQUEyRztBQUMzRyxvSEFBaUg7QUFDakgsd0VBQXFFO0FBQ3JFLHdFQUFzRTtBQUN0RSxpRkFBOEU7QUFDOUUsOERBQTREO0FBRTVELElBQU0sTUFBTSxHQUFHO0lBQ2IsTUFBTSxFQUFFLDZCQUE2QjtJQUNyQyxXQUFXLEVBQUUseUNBQXlDO0lBQ3RELFFBQVEsRUFBRSxzQkFBc0I7Q0FDakMsQ0FBQTtBQTBERDtJQUFBO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBdkRyQixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUU7Z0JBQ1osNEJBQVk7Z0JBQ1osZ0NBQWM7Z0JBQ2QsZ0NBQWM7Z0JBQ2Qsa0NBQWU7Z0JBQ2Ysb0NBQWdCO2dCQUNoQixzQ0FBaUI7Z0JBQ2pCLGtDQUFlO2dCQUNmLGdDQUFjO2dCQUNkLHNDQUFpQjtnQkFDakIsd0NBQWtCO2dCQUNsQixnREFBcUI7Z0JBQ3JCLHdDQUFrQjtnQkFDbEIsc0NBQWlCO2dCQUNqQixrQ0FBZTtnQkFDZixrQ0FBZTtnQkFDZixzQ0FBaUI7Z0JBQ2pCLHFEQUF3QjtnQkFDeEIscUNBQWdCO2dCQUNoQixvREFBdUI7Z0JBQ3ZCLDREQUEyQjtnQkFDM0Isc0RBQXdCO2dCQUN4QixnQ0FBYztnQkFDZCw4Q0FBb0I7Z0JBQ3BCLHFEQUF3QjtnQkFDeEIsdURBQXlCO2dCQUN6QiwyREFBMkI7Z0JBQzNCLG1DQUFlO2dCQUNmLHlDQUFrQjtnQkFDbEIsa0NBQWU7YUFDaEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AscUJBQVksQ0FBQyxPQUFPLENBQUMsbUJBQU0sQ0FBQztnQkFDNUIsNkJBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMvQixnQ0FBYTtnQkFDYix1QkFBZ0I7Z0JBQ2hCLHFDQUFnQjtnQkFDaEIscUJBQVk7Z0JBQ1osd0JBQVM7Z0JBQ1QsbUJBQVc7Z0JBQ1gsMkJBQW1CO2dCQUNuQixvQ0FBbUIsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkYsNkJBQWM7YUFDZjtZQUNELFNBQVMsRUFBRTtnQkFDVCw0QkFBYTtnQkFDYiw2QkFBZTtnQkFDZiwwQkFBVztnQkFDWCwwQkFBVztnQkFDWCxvQ0FBZ0I7YUFDakI7WUFDRCxTQUFTLEVBQUUsQ0FBQyw0QkFBWSxDQUFDO1NBQzFCLENBQUM7T0FFVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBbmd1bGFyIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnXG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlcidcbmltcG9ydCB7IFJvdXRlck1vZHVsZSwgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJ1xuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJ1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL2F1dGguc2VydmljZSdcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy91c2VyLnNlcnZpY2UnXG5kZWNsYXJlIHZhciByZXF1aXJlOiBhbnk7XG5cblxuLy8gaW1wb3J0IGZpbGVwb25kIG1vZHVsZVxuaW1wb3J0IHsgRmlsZVBvbmRNb2R1bGUsIHJlZ2lzdGVyUGx1Z2luIH0gZnJvbSAnbmd4LWZpbGVwb25kJ1xuXG4vLyBpbXBvcnQgYW5kIHJlZ2lzdGVyIGZpbGVwb25kIGZpbGUgdHlwZSB2YWxpZGF0aW9uIHBsdWdpblxuaW1wb3J0IEZpbGVQb25kUGx1Z2luRmlsZVZhbGlkYXRlVHlwZSBmcm9tICdmaWxlcG9uZC1wbHVnaW4tZmlsZS12YWxpZGF0ZS10eXBlJ1xuaW1wb3J0IEZpbGVQb25kUGx1Z2luRmlsZVJlbmFtZSBmcm9tICdmaWxlcG9uZC1wbHVnaW4tZmlsZS1yZW5hbWUnXG5yZWdpc3RlclBsdWdpbihGaWxlUG9uZFBsdWdpbkZpbGVWYWxpZGF0ZVR5cGUpXG5cblxucmVnaXN0ZXJQbHVnaW4oRmlsZVBvbmRQbHVnaW5GaWxlUmVuYW1lKVxuXG5cbi8vIEFuZ3VsYXIgQm9vdHN0cmFwXG5pbXBvcnQgeyBOZ2JNb2R1bGUgfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCdcblxuLy8gQ29tcG9uZW50IEltcG9ydFxuaW1wb3J0IHsgQXBwUm91dGluZ01vZHVsZSB9IGZyb20gJy4vYXBwLXJvdXRpbmcubW9kdWxlJ1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50J1xuXG4vLyBEYXNoYm9hcmQgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IERhc2hib2FyZENvbXBvbmVudCB9IGZyb20gJy4vZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQnXG5cbi8vIEVycm9yIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBFcnJvckNvbXBvbmVudCB9IGZyb20gJy4vRXJyb3ItVmlld3MvZXJyb3IvZXJyb3IuY29tcG9uZW50J1xuaW1wb3J0IHsgUGFnZU5vdEZvdW5kQ29tcG9uZW50IH0gZnJvbSAnLi9FcnJvci1WaWV3cy9wYWdlLW5vdC1mb3VuZC9wYWdlLW5vdC1mb3VuZC5jb21wb25lbnQnXG5cbi8vIEhvbWUgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IFZpZXdMYXRlc3ROZXdzQ29tcG9uZW50IH0gZnJvbSAnLi9Ib21lL3ZpZXctbGF0ZXN0LW5ld3Mvdmlldy1sYXRlc3QtbmV3cy5jb21wb25lbnQnXG5pbXBvcnQgeyBWaWV3TmF2aWdhdGlvbkhvbWVDb21wb25lbnQgfSBmcm9tICcuL0hvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUvdmlldy1uYXZpZ2F0aW9uLWhvbWUuY29tcG9uZW50J1xuaW1wb3J0IHsgVmlld0ZyaWVuZHNIb21lQ29tcG9uZW50IH0gZnJvbSAnLi9Ib21lL3ZpZXctZnJpZW5kcy1ob21lL3ZpZXctZnJpZW5kcy1ob21lLmNvbXBvbmVudCdcblxuLy8gTWVzc2FnZXMgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IE1lc3NhZ2VzQ29tcG9uZW50IH0gZnJvbSAnLi9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnQnXG5cbi8vIE9uYm9hcmRpbmcgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IExvZ2luQ29tcG9uZW50IH0gZnJvbSAnLi9PbmJvYXJkaW5nL2xvZ2luL2xvZ2luLmNvbXBvbmVudCdcbmltcG9ydCB7IFNpZ251cENvbXBvbmVudCB9IGZyb20gJy4vT25ib2FyZGluZy9zaWdudXAvc2lnbnVwLmNvbXBvbmVudCdcbmltcG9ydCB7IEZvcmdvdENvbXBvbmVudCB9IGZyb20gJy4vT25ib2FyZGluZy9mb3Jnb3QvZm9yZ290LmNvbXBvbmVudCdcbmltcG9ydCB7IE5ld1VzZXJDb21wb25lbnQgfSBmcm9tICcuL09uYm9hcmRpbmcvbmV3LXVzZXIvbmV3LXVzZXIuY29tcG9uZW50J1xuXG4vLyBQcm9maWxlIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBQcm9maWxlQ29tcG9uZW50IH0gZnJvbSAnLi9Qcm9maWxlLVZpZXdzL3Byb2ZpbGUvcHJvZmlsZS5jb21wb25lbnQnXG5pbXBvcnQgeyBTbWFsbENvbXBvbmVudCB9IGZyb20gJy4vUHJvZmlsZS1WaWV3cy9zbWFsbC9zbWFsbC5jb21wb25lbnQnXG5pbXBvcnQgeyBTZXR0aW5nc1Byb2ZpbGVDb21wb25lbnQgfSBmcm9tICcuL1Byb2ZpbGUtVmlld3Mvc2V0dGluZ3MtcHJvZmlsZS9zZXR0aW5ncy1wcm9maWxlLmNvbXBvbmVudCdcblxuLy8gU2V0dGluZ3MgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IFNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9TZXR0aW5ncy1WaWV3cy9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnQnXG5cbi8vIFNoYXJlZCBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgRm9vdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9TaGFyZWQvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQnXG5pbXBvcnQgeyBOYXZiYXJDb21wb25lbnQgfSBmcm9tICcuL1NoYXJlZC9uYXZiYXIvbmF2YmFyLmNvbXBvbmVudCdcblxuLy8gT2t0YSBHdWFyZCBhbmQgU2VydmljZVxuaW1wb3J0IHsgT2t0YUNhbGxiYWNrQ29tcG9uZW50LCBPa3RhQXV0aEd1YXJkIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcbmltcG9ydCB7IE9rdGFBdXRoU2VydmljZSB9IGZyb20gJy4vYXBwLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FsbGJhY2tDb21wb25lbnQgfSBmcm9tICcuL0NvcmUvY2FsbGJhY2svY2FsbGJhY2suY29tcG9uZW50JztcbmltcG9ydCB7IFByb3RlY3RlZENvbXBvbmVudCB9IGZyb20gJy4vQ29yZS9wcm90ZWN0ZWQvcHJvdGVjdGVkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPa3RhQXV0aE1vZHVsZSB9IGZyb20gJ0Bva3RhL29rdGEtYW5ndWxhcic7XG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tICcuL2FwcC5yb3V0ZXMnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBTZXJ2aWNlV29ya2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvc2VydmljZS13b3JrZXInO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgUm9vbXNDb21wb25lbnQgfSBmcm9tICcuL3Jvb21zL3Jvb21zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTY3JvbGxUb1RvcERpcmVjdGl2ZSB9IGZyb20gJy4vc2Nyb2xsLXRvLXRvcC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUHJpdmFjeVNldHRpbmdzQ29tcG9uZW50IH0gZnJvbSAnLi9TZXR0aW5ncy1WaWV3cy9wcml2YWN5LXNldHRpbmdzL3ByaXZhY3ktc2V0dGluZ3MuY29tcG9uZW50JztcbmltcG9ydCB7IFNlY3VyaXR5U2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL1NldHRpbmdzLVZpZXdzL3NlY3VyaXR5LXNldHRpbmdzL3NlY3VyaXR5LXNldHRpbmdzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb25uZWN0aW9uU2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL1NldHRpbmdzLVZpZXdzL2Nvbm5lY3Rpb24tc2V0dGluZ3MvY29ubmVjdGlvbi1zZXR0aW5ncy5jb21wb25lbnQnO1xuaW1wb3J0IHsgVG9wQmFyQ29tcG9uZW50IH0gZnJvbSAnLi9TaGFyZWQvdG9wLWJhci90b3AtYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZXNzYWdpbmdTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy9tZXNzYWdpbmcuc2VydmljZSc7XG5pbXBvcnQgeyBTZWFyY2hCYXJDb21wb25lbnQgfSBmcm9tICcuL1NoYXJlZC9zZWFyY2gtYmFyL3NlYXJjaC1iYXIuY29tcG9uZW50JztcbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoL3NlYXJjaC5jb21wb25lbnQnO1xuXG5jb25zdCBjb25maWcgPSB7XG4gIGlzc3VlcjogJ2h0dHBzOi8vZGV2LTExNzgyNS5va3RhLmNvbScsXG4gIHJlZGlyZWN0VXJpOiAnaHR0cDovL2xvY2FsaG9zdDo0MjAwL2ltcGxpY2l0L2NhbGxiYWNrJyxcbiAgY2xpZW50SWQ6ICcwb2FkYWN1bWxQV21WOWo1YTM1Nidcbn1cblxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBDb21wb25lbnQsXG4gICAgRXJyb3JDb21wb25lbnQsXG4gICAgTG9naW5Db21wb25lbnQsXG4gICAgU2lnbnVwQ29tcG9uZW50LFxuICAgIFByb2ZpbGVDb21wb25lbnQsXG4gICAgU2V0dGluZ3NDb21wb25lbnQsXG4gICAgRm9yZ290Q29tcG9uZW50LFxuICAgIFNtYWxsQ29tcG9uZW50LFxuICAgIENhbGxiYWNrQ29tcG9uZW50LFxuICAgIFByb3RlY3RlZENvbXBvbmVudCxcbiAgICBQYWdlTm90Rm91bmRDb21wb25lbnQsXG4gICAgRGFzaGJvYXJkQ29tcG9uZW50LFxuICAgIENhbGxiYWNrQ29tcG9uZW50LFxuICAgIEZvb3RlckNvbXBvbmVudCxcbiAgICBOYXZiYXJDb21wb25lbnQsXG4gICAgTWVzc2FnZXNDb21wb25lbnQsXG4gICAgU2V0dGluZ3NQcm9maWxlQ29tcG9uZW50LFxuICAgIE5ld1VzZXJDb21wb25lbnQsXG4gICAgVmlld0xhdGVzdE5ld3NDb21wb25lbnQsXG4gICAgVmlld05hdmlnYXRpb25Ib21lQ29tcG9uZW50LFxuICAgIFZpZXdGcmllbmRzSG9tZUNvbXBvbmVudCxcbiAgICBSb29tc0NvbXBvbmVudCxcbiAgICBTY3JvbGxUb1RvcERpcmVjdGl2ZSxcbiAgICBQcml2YWN5U2V0dGluZ3NDb21wb25lbnQsXG4gICAgU2VjdXJpdHlTZXR0aW5nc0NvbXBvbmVudCxcbiAgICBDb25uZWN0aW9uU2V0dGluZ3NDb21wb25lbnQsXG4gICAgVG9wQmFyQ29tcG9uZW50LFxuICAgIFNlYXJjaEJhckNvbXBvbmVudCxcbiAgICBTZWFyY2hDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIFJvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyksXG4gICAgT2t0YUF1dGhNb2R1bGUuaW5pdEF1dGgoY29uZmlnKSxcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICBSb3V0ZXJNb2R1bGUsXG4gICAgTmdiTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3Rlcignbmdzdy13b3JrZXIuanMnLCB7IGVuYWJsZWQ6IGVudmlyb25tZW50LnByb2R1Y3Rpb24gfSksXG4gICAgRmlsZVBvbmRNb2R1bGVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT2t0YUF1dGhHdWFyZCxcbiAgICBPa3RhQXV0aFNlcnZpY2UsXG4gICAgQXV0aFNlcnZpY2UsXG4gICAgVXNlclNlcnZpY2UsXG4gICAgTWVzc2FnaW5nU2VydmljZVxuICBdLFxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdLFxufSlcblxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiJdfQ==