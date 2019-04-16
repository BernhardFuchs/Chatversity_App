import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { ErrorComponent } from './Errors/error/error.component';
import { LoginComponent } from './Onboarding/login/login.component';
import { SignupComponent } from './Onboarding/signup/signup.component';
import { ProfileComponent } from '~/app/Profile/profile/profile.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { ForgotComponent } from './Onboarding/forgot/forgot.component';
import { SmallComponent } from '~/app/Profile/small/small.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { PageNotFoundComponent } from './Errors/page-not-found/page-not-found.component';
import { CallbackComponent } from './Core/callback/callback.component';
import { ProtectedComponent } from './Core/protected/protected.component';
import { NavbarComponent } from './Shared/navbar/navbar.component';
import { MessagesComponent } from './Messages/messages.component';
import { SettingsProfileComponent } from '~/app/Profile/settings-profile/settings-profile.component';
import { ViewLatestNewsComponent } from './Home/view-latest-news/view-latest-news.component';
import { ViewNavigationHomeComponent } from './Home/view-navigation-home/view-navigation-home.component';
import { ViewFriendsHomeComponent } from './Home/view-friends-home/view-friends-home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { PrivacySettingsComponent } from './Settings-Views/privacy-settings/privacy-settings.component';
import { SecuritySettingsComponent } from './Settings-Views/security-settings/security-settings.component';
import { ConnectionSettingsComponent } from './Settings-Views/connection-settings/connection-settings.component';
import { TopBarComponent } from './Shared/top-bar/top-bar.component';


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ErrorComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    SettingsComponent,
    ForgotComponent,
    SmallComponent,
    FooterComponent,
    PageNotFoundComponent,
    CallbackComponent,
    ProtectedComponent,
    NavbarComponent,
    MessagesComponent,
    SettingsProfileComponent,
    ViewLatestNewsComponent,
    ViewNavigationHomeComponent,
    ViewFriendsHomeComponent,
    RoomsComponent,
    PrivacySettingsComponent,
    SecuritySettingsComponent,
    ConnectionSettingsComponent,
    TopBarComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})

export class AppModule { }
