import { Routes } from '@angular/router'
import { LoginComponent } from './Onboarding/login/login.component'
import { ForgotComponent } from './Onboarding/forgot/forgot.component'
import { SignupComponent } from './Onboarding/signup/signup.component'
import { PageNotFoundComponent } from './Error-Views/page-not-found/page-not-found.component'
import { OktaCallbackComponent } from '@okta/okta-angular'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthGuard } from './Core/_guards/auth.guard'
import { RouteGuard } from './Core/_guards/route.guard'
import { SettingsComponent } from './Settings-Views/settings/settings.component'
import { MessagesComponent } from './messages/messages.component'
import { SettingsProfileComponent } from './Profile-Views/settings-profile/settings-profile.component'
import { NewUserComponent } from './Onboarding/new-user/new-user.component'
import { ViewNavigationHomeComponent } from './Home/view-navigation-home/view-navigation-home.component'
import { RoomsComponent } from './rooms/rooms.component'
import { SearchComponent } from './search/search.component'

export const routes: Routes = [
    /* Must be logged out to access these components */
    { path: 'forgot',  component: ForgotComponent, canActivate: [RouteGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [RouteGuard] },
    { path: 'login',  component: LoginComponent, canActivate: [RouteGuard] },

    /* Must be logged in to access these components */
    { path: '', component: ViewNavigationHomeComponent, canActivate: [AuthGuard] },
    { path: 'settings',  component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'rooms',  component: RoomsComponent, canActivate: [AuthGuard] },
    { path: 'messages',  component: MessagesComponent, canActivate: [AuthGuard] },
    { path: 'settings-profile', component: SettingsProfileComponent, canActivate: [AuthGuard] },
    { path: 'home', component: ViewNavigationHomeComponent, canActivate: [AuthGuard] },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'new-user', component: NewUserComponent, canActivate: [AuthGuard] },

    /* Can be logged in or logged out to access these components */
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' },
    { path: 'implicit/callback', component: OktaCallbackComponent },
]
