import { Injectable, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { BehaviorSubject, Subject, ReplaySubject, Observable, } from 'rxjs'
import { MessagingService } from './messaging.service'
import {parse, stringify} from 'flatted'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable()
export class AuthService {
    private _currentUser: ReplaySubject<any>

    constructor(private http: HttpClient, private messageService: MessagingService, private router: Router ) {
        this._currentUser = new ReplaySubject<any>(1)
        this.initializeApp()
        console.log('Auth service constructed')
    }

    get currentUser() {
        return this._currentUser.asObservable()
    }

    set currentUser(user: any) {
        console.log('setting current user')
        this._currentUser.next(user)
    }

    getCurrentUser(): Observable<any> {
        return this._currentUser.asObservable()
    }


    getUserId() {
        return localStorage.getItem('chatkitUserId')
    }



    initializeApp() {
        if (!localStorage.getItem('chatkitUserId')) { return }
        this.messageService.initChatkit(localStorage.getItem('chatkitUserId'))
        .then(chatkitUser => {
            console.log('setting chatkit user')
            localStorage.setItem('chatkitUser', chatkitUser)
            this._currentUser.next(chatkitUser)
        })
    }

    userLoggedIn() {
        return localStorage.getItem('chatkitUserId') != null
    }



    //
    // ─── SEND SIGN UP REQUEST TO SERVER ─────────────────────────────────────────────
    //

        signup(fname: string, lname: string, university: string, username: string, password: string) {
            // Create Okta User
            return this.http.post<any>(`${environment.apiUrl}/okta/signup`, { fname, lname, username, password })
            .toPromise()
            .then(user => {
                // console.log(user);
                // Create chatkit user from Okta User ID
                return this.http.post(`${environment.apiUrl}/chatkit/createuser`, {
                    id: user.id,
                    name: user.profile.firstName + ' ' + user.profile.lastName,
                    custom_data: {
                        connections: [],
                        connectionRequests: [],
                        bio: '',
                        university: university,
                        graduationYear: '',
                        interests: '',
                        clubs: '',
                        major: '',
                        privateAccount: false,
                        showActivityStatus: true,
                    }
            })
            .toPromise()
            .then((chatkitUser) => {
                    // Created Chatkit user
                    console.log('Created Chatkit user!')
                    console.log(chatkitUser)

                    return this.login(username, password).then(loggedinUser => {
                        return loggedinUser
                    })
                })
            })
        }
    // ─────────────────────────────────────────────────────────────────



    //
    // ─── VALIDATE LOGIN THROUGH OKTA ────────────────────────────────────────────────
    //

        login(username: string, password: string) {
            return this.http.post<any>(`${environment.apiUrl}/okta/login`, { username, password })
            .toPromise()
            .then((user) => {

                console.log('LOGGED IN OKTA USER: ', user)

                localStorage.setItem('OktaUser', JSON.stringify(user))

                return this.messageService.initChatkit(user._embedded.user.id)
                .then(chatkitUser => {

                  this.currentUser = chatkitUser

                  return chatkitUser
              })
            })
        }
    // ─────────────────────────────────────────────────────────────────



    //
    // ─── HANDLE LOGOUT ──────────────────────────────────────────────────────────────
    //

        logout() {
            this.messageService.disconnect()
            localStorage.clear()
            this.router.navigate(['/login'])
            console.clear()
        }
    // ─────────────────────────────────────────────────────────────────

}
