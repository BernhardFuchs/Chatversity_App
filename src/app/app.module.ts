// Angular Component Imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './Core/_services/auth.service';

// Angular Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Component Import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Dashboard Component Imports
import { DashboardComponent } from './dashboard/dashboard.component';

// Error Component Imports
import { ErrorComponent } from './Error-Views/error/error.component';
import { PageNotFoundComponent } from './Error-Views/page-not-found/page-not-found.component';

// Home Component Imports
import { ViewLatestNewsComponent } from './Home/view-latest-news/view-latest-news.component';
import { ViewNavigationHomeComponent } from './Home/view-navigation-home/view-navigation-home.component';
import { ViewFriendsHomeComponent } from './Home/view-friends-home/view-friends-home.component';

// Messages Component Imports
import { MessagesComponent } from './messages/messages.component';

// Onboarding Component Imports
import { LoginComponent } from './Onboarding/login/login.component';
import { SignupComponent } from './Onboarding/signup/signup.component';
import { ForgotComponent } from './Onboarding/forgot/forgot.component';
import { NewUserComponent } from './Onboarding/new-user/new-user.component';

// Profile Component Imports
import { ProfileComponent } from './Profile-Views/profile/profile.component';
import { SmallComponent } from './Profile-Views/small/small.component';
import { SettingsProfileComponent } from './Profile-Views/settings-profile/settings-profile.component';

// Settings Component Imports
import { SettingsComponent } from './Settings-Views/settings/settings.component';

// Shared Component Imports
import { FooterComponent } from './Shared/footer/footer.component';
import { NavbarComponent } from './Shared/navbar/navbar.component';

// Okta Guard and Service
import { OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import { OktaAuthService } from './app.service';
import { CallbackComponent } from './Core/callback/callback.component';
import { ProtectedComponent } from './Core/protected/protected.component';
import { OktaAuthModule } from '@okta/okta-angular';
import { routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RoomsComponent } from './rooms/rooms.component';
import { TopBarComponent } from './Shared/top-bar/top-bar.component';

const config = {
  issuer: 'https://dev-117825.okta.com',
  redirectUri: 'http://localhost:4200/implicit/callback',
  clientId: '0oadacumlPWmV9j5a356'
};


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    SettingsComponent,
    ForgotComponent,
    SmallComponent,
    CallbackComponent,
    ProtectedComponent,
    PageNotFoundComponent,
    DashboardComponent,
    CallbackComponent,
    FooterComponent,
    NavbarComponent,
    MessagesComponent,
    SettingsProfileComponent,
    NewUserComponent,
    ViewLatestNewsComponent,
    ViewNavigationHomeComponent,
    ViewFriendsHomeComponent,
    RoomsComponent,
    TopBarComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    OktaAuthModule.initAuth(config),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    OktaAuthGuard,
    OktaAuthService,
    AuthService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
