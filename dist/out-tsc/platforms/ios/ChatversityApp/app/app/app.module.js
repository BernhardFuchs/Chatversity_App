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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvQ2hhdHZlcnNpdHlBcHAvYXBwL2FwcC9hcHAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTRCO0FBQzVCLHNDQUF5QztBQUN6Qyw4REFBMEQ7QUFDMUQsMENBQXVEO0FBQ3ZELDZDQUF3RDtBQUN4RCw4REFBNEQ7QUFDNUQsOERBQTREO0FBRTVELG9CQUFvQjtBQUNwQiwyREFBdUQ7QUFFdkQsbUJBQW1CO0FBQ25CLDJEQUF3RDtBQUN4RCxpREFBK0M7QUFFL0MsOEJBQThCO0FBQzlCLHVFQUFxRTtBQUVyRSwwQkFBMEI7QUFDMUIsdUVBQXFFO0FBQ3JFLGtHQUE4RjtBQUU5Rix5QkFBeUI7QUFDekIsaUdBQTZGO0FBQzdGLDZHQUF5RztBQUN6RyxvR0FBZ0c7QUFFaEcsNkJBQTZCO0FBQzdCLG9FQUFrRTtBQUVsRSwrQkFBK0I7QUFDL0Isc0VBQW9FO0FBQ3BFLHlFQUF1RTtBQUN2RSx5RUFBdUU7QUFDdkUsK0VBQTRFO0FBRTVFLDRCQUE0QjtBQUM1QiwrRUFBNkU7QUFDN0UseUVBQXVFO0FBQ3ZFLDBHQUF1RztBQUV2Ryw2QkFBNkI7QUFDN0IsbUZBQWlGO0FBRWpGLDJCQUEyQjtBQUMzQixxRUFBbUU7QUFDbkUscUVBQW1FO0FBRW5FLHlCQUF5QjtBQUN6QixtREFBMEU7QUFDMUUsNkNBQWdEO0FBQ2hELHlFQUF1RTtBQUN2RSw0RUFBMEU7QUFDMUUsbURBQW9EO0FBQ3BELDJDQUFzQztBQUN0Qyx3Q0FBa0U7QUFDbEUsMERBQThEO0FBQzlELDJEQUEwRDtBQUMxRCwyREFBeUQ7QUFDekQscUVBQWlFO0FBQ2pFLDJHQUF3RztBQUN4Ryw4R0FBMkc7QUFDM0csb0hBQWlIO0FBQ2pILHdFQUFxRTtBQUNyRSx3RUFBc0U7QUFFdEUsSUFBTSxNQUFNLEdBQUc7SUFDYixNQUFNLEVBQUUsNkJBQTZCO0lBQ3JDLFdBQVcsRUFBRSx5Q0FBeUM7SUFDdEQsUUFBUSxFQUFFLHNCQUFzQjtDQUNqQyxDQUFDO0FBdURGO0lBQUE7SUFBeUIsQ0FBQztJQUFiLFNBQVM7UUFwRHJCLGVBQVEsQ0FBQztZQUNSLFlBQVksRUFBRTtnQkFDWiw0QkFBWTtnQkFDWixnQ0FBYztnQkFDZCxnQ0FBYztnQkFDZCxrQ0FBZTtnQkFDZixvQ0FBZ0I7Z0JBQ2hCLHNDQUFpQjtnQkFDakIsa0NBQWU7Z0JBQ2YsZ0NBQWM7Z0JBQ2Qsc0NBQWlCO2dCQUNqQix3Q0FBa0I7Z0JBQ2xCLGdEQUFxQjtnQkFDckIsd0NBQWtCO2dCQUNsQixzQ0FBaUI7Z0JBQ2pCLGtDQUFlO2dCQUNmLGtDQUFlO2dCQUNmLHNDQUFpQjtnQkFDakIscURBQXdCO2dCQUN4QixxQ0FBZ0I7Z0JBQ2hCLG9EQUF1QjtnQkFDdkIsNERBQTJCO2dCQUMzQixzREFBd0I7Z0JBQ3hCLGdDQUFjO2dCQUNkLDhDQUFvQjtnQkFDcEIscURBQXdCO2dCQUN4Qix1REFBeUI7Z0JBQ3pCLDJEQUEyQjtnQkFDM0IsbUNBQWU7YUFDaEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AscUJBQVksQ0FBQyxPQUFPLENBQUMsbUJBQU0sQ0FBQztnQkFDNUIsNkJBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUMvQixnQ0FBYTtnQkFDYix1QkFBZ0I7Z0JBQ2hCLHFDQUFnQjtnQkFDaEIscUJBQVk7Z0JBQ1osd0JBQVM7Z0JBQ1QsbUJBQVc7Z0JBQ1gsMkJBQW1CO2dCQUNuQixvQ0FBbUIsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNwRjtZQUNELFNBQVMsRUFBRTtnQkFDVCw0QkFBYTtnQkFDYiw2QkFBZTtnQkFDZiwwQkFBVztnQkFDWCwwQkFBVztnQkFDWCxvQ0FBZ0I7YUFDakI7WUFDRCxTQUFTLEVBQUUsQ0FBQyw0QkFBWSxDQUFDO1NBQzFCLENBQUM7T0FFVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBbmd1bGFyIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlLCBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9Db3JlL19zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5cbi8vIEFuZ3VsYXIgQm9vdHN0cmFwXG5pbXBvcnQgeyBOZ2JNb2R1bGUgfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5cbi8vIENvbXBvbmVudCBJbXBvcnRcbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tICcuL2FwcC1yb3V0aW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuXG4vLyBEYXNoYm9hcmQgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IERhc2hib2FyZENvbXBvbmVudCB9IGZyb20gJy4vZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQnO1xuXG4vLyBFcnJvciBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgRXJyb3JDb21wb25lbnQgfSBmcm9tICcuL0Vycm9yLVZpZXdzL2Vycm9yL2Vycm9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQYWdlTm90Rm91bmRDb21wb25lbnQgfSBmcm9tICcuL0Vycm9yLVZpZXdzL3BhZ2Utbm90LWZvdW5kL3BhZ2Utbm90LWZvdW5kLmNvbXBvbmVudCc7XG5cbi8vIEhvbWUgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IFZpZXdMYXRlc3ROZXdzQ29tcG9uZW50IH0gZnJvbSAnLi9Ib21lL3ZpZXctbGF0ZXN0LW5ld3Mvdmlldy1sYXRlc3QtbmV3cy5jb21wb25lbnQnO1xuaW1wb3J0IHsgVmlld05hdmlnYXRpb25Ib21lQ29tcG9uZW50IH0gZnJvbSAnLi9Ib21lL3ZpZXctbmF2aWdhdGlvbi1ob21lL3ZpZXctbmF2aWdhdGlvbi1ob21lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBWaWV3RnJpZW5kc0hvbWVDb21wb25lbnQgfSBmcm9tICcuL0hvbWUvdmlldy1mcmllbmRzLWhvbWUvdmlldy1mcmllbmRzLWhvbWUuY29tcG9uZW50JztcblxuLy8gTWVzc2FnZXMgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IE1lc3NhZ2VzQ29tcG9uZW50IH0gZnJvbSAnLi9tZXNzYWdlcy9tZXNzYWdlcy5jb21wb25lbnQnO1xuXG4vLyBPbmJvYXJkaW5nIENvbXBvbmVudCBJbXBvcnRzXG5pbXBvcnQgeyBMb2dpbkNvbXBvbmVudCB9IGZyb20gJy4vT25ib2FyZGluZy9sb2dpbi9sb2dpbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2lnbnVwQ29tcG9uZW50IH0gZnJvbSAnLi9PbmJvYXJkaW5nL3NpZ251cC9zaWdudXAuY29tcG9uZW50JztcbmltcG9ydCB7IEZvcmdvdENvbXBvbmVudCB9IGZyb20gJy4vT25ib2FyZGluZy9mb3Jnb3QvZm9yZ290LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZXdVc2VyQ29tcG9uZW50IH0gZnJvbSAnLi9PbmJvYXJkaW5nL25ldy11c2VyL25ldy11c2VyLmNvbXBvbmVudCc7XG5cbi8vIFByb2ZpbGUgQ29tcG9uZW50IEltcG9ydHNcbmltcG9ydCB7IFByb2ZpbGVDb21wb25lbnQgfSBmcm9tICcuL1Byb2ZpbGUtVmlld3MvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTbWFsbENvbXBvbmVudCB9IGZyb20gJy4vUHJvZmlsZS1WaWV3cy9zbWFsbC9zbWFsbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2V0dGluZ3NQcm9maWxlQ29tcG9uZW50IH0gZnJvbSAnLi9Qcm9maWxlLVZpZXdzL3NldHRpbmdzLXByb2ZpbGUvc2V0dGluZ3MtcHJvZmlsZS5jb21wb25lbnQnO1xuXG4vLyBTZXR0aW5ncyBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgU2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL1NldHRpbmdzLVZpZXdzL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudCc7XG5cbi8vIFNoYXJlZCBDb21wb25lbnQgSW1wb3J0c1xuaW1wb3J0IHsgRm9vdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9TaGFyZWQvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmF2YmFyQ29tcG9uZW50IH0gZnJvbSAnLi9TaGFyZWQvbmF2YmFyL25hdmJhci5jb21wb25lbnQnO1xuXG4vLyBPa3RhIEd1YXJkIGFuZCBTZXJ2aWNlXG5pbXBvcnQgeyBPa3RhQ2FsbGJhY2tDb21wb25lbnQsIE9rdGFBdXRoR3VhcmQgfSBmcm9tICdAb2t0YS9va3RhLWFuZ3VsYXInO1xuaW1wb3J0IHsgT2t0YUF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hcHAuc2VydmljZSc7XG5pbXBvcnQgeyBDYWxsYmFja0NvbXBvbmVudCB9IGZyb20gJy4vQ29yZS9jYWxsYmFjay9jYWxsYmFjay5jb21wb25lbnQnO1xuaW1wb3J0IHsgUHJvdGVjdGVkQ29tcG9uZW50IH0gZnJvbSAnLi9Db3JlL3Byb3RlY3RlZC9wcm90ZWN0ZWQuY29tcG9uZW50JztcbmltcG9ydCB7IE9rdGFBdXRoTW9kdWxlIH0gZnJvbSAnQG9rdGEvb2t0YS1hbmd1bGFyJztcbmltcG9ydCB7IHJvdXRlcyB9IGZyb20gJy4vYXBwLnJvdXRlcyc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFNlcnZpY2VXb3JrZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9zZXJ2aWNlLXdvcmtlcic7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBSb29tc0NvbXBvbmVudCB9IGZyb20gJy4vcm9vbXMvcm9vbXMuY29tcG9uZW50JztcbmltcG9ydCB7IFNjcm9sbFRvVG9wRGlyZWN0aXZlIH0gZnJvbSAnLi9zY3JvbGwtdG8tdG9wLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQcml2YWN5U2V0dGluZ3NDb21wb25lbnQgfSBmcm9tICcuL1NldHRpbmdzLVZpZXdzL3ByaXZhY3ktc2V0dGluZ3MvcHJpdmFjeS1zZXR0aW5ncy5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2VjdXJpdHlTZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gJy4vU2V0dGluZ3MtVmlld3Mvc2VjdXJpdHktc2V0dGluZ3Mvc2VjdXJpdHktc2V0dGluZ3MuY29tcG9uZW50JztcbmltcG9ydCB7IENvbm5lY3Rpb25TZXR0aW5nc0NvbXBvbmVudCB9IGZyb20gJy4vU2V0dGluZ3MtVmlld3MvY29ubmVjdGlvbi1zZXR0aW5ncy9jb25uZWN0aW9uLXNldHRpbmdzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUb3BCYXJDb21wb25lbnQgfSBmcm9tICcuL1NoYXJlZC90b3AtYmFyL3RvcC1iYXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1lc3NhZ2luZ1NlcnZpY2UgfSBmcm9tICcuL0NvcmUvX3NlcnZpY2VzL21lc3NhZ2luZy5zZXJ2aWNlJztcblxuY29uc3QgY29uZmlnID0ge1xuICBpc3N1ZXI6ICdodHRwczovL2Rldi0xMTc4MjUub2t0YS5jb20nLFxuICByZWRpcmVjdFVyaTogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9pbXBsaWNpdC9jYWxsYmFjaycsXG4gIGNsaWVudElkOiAnMG9hZGFjdW1sUFdtVjlqNWEzNTYnXG59O1xuXG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFwcENvbXBvbmVudCxcbiAgICBFcnJvckNvbXBvbmVudCxcbiAgICBMb2dpbkNvbXBvbmVudCxcbiAgICBTaWdudXBDb21wb25lbnQsXG4gICAgUHJvZmlsZUNvbXBvbmVudCxcbiAgICBTZXR0aW5nc0NvbXBvbmVudCxcbiAgICBGb3Jnb3RDb21wb25lbnQsXG4gICAgU21hbGxDb21wb25lbnQsXG4gICAgQ2FsbGJhY2tDb21wb25lbnQsXG4gICAgUHJvdGVjdGVkQ29tcG9uZW50LFxuICAgIFBhZ2VOb3RGb3VuZENvbXBvbmVudCxcbiAgICBEYXNoYm9hcmRDb21wb25lbnQsXG4gICAgQ2FsbGJhY2tDb21wb25lbnQsXG4gICAgRm9vdGVyQ29tcG9uZW50LFxuICAgIE5hdmJhckNvbXBvbmVudCxcbiAgICBNZXNzYWdlc0NvbXBvbmVudCxcbiAgICBTZXR0aW5nc1Byb2ZpbGVDb21wb25lbnQsXG4gICAgTmV3VXNlckNvbXBvbmVudCxcbiAgICBWaWV3TGF0ZXN0TmV3c0NvbXBvbmVudCxcbiAgICBWaWV3TmF2aWdhdGlvbkhvbWVDb21wb25lbnQsXG4gICAgVmlld0ZyaWVuZHNIb21lQ29tcG9uZW50LFxuICAgIFJvb21zQ29tcG9uZW50LFxuICAgIFNjcm9sbFRvVG9wRGlyZWN0aXZlLFxuICAgIFByaXZhY3lTZXR0aW5nc0NvbXBvbmVudCxcbiAgICBTZWN1cml0eVNldHRpbmdzQ29tcG9uZW50LFxuICAgIENvbm5lY3Rpb25TZXR0aW5nc0NvbXBvbmVudCxcbiAgICBUb3BCYXJDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIFJvdXRlck1vZHVsZS5mb3JSb290KHJvdXRlcyksXG4gICAgT2t0YUF1dGhNb2R1bGUuaW5pdEF1dGgoY29uZmlnKSxcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICBSb3V0ZXJNb2R1bGUsXG4gICAgTmdiTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3Rlcignbmdzdy13b3JrZXIuanMnLCB7IGVuYWJsZWQ6IGVudmlyb25tZW50LnByb2R1Y3Rpb24gfSlcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT2t0YUF1dGhHdWFyZCxcbiAgICBPa3RhQXV0aFNlcnZpY2UsXG4gICAgQXV0aFNlcnZpY2UsXG4gICAgVXNlclNlcnZpY2UsXG4gICAgTWVzc2FnaW5nU2VydmljZVxuICBdLFxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdLFxufSlcblxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiJdfQ==