import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { BehaviorSubject, Subject, ReplaySubject, } from 'rxjs';
import { MessagingService } from './messaging.service';
import {parse, stringify} from 'flatted';

@Injectable()
export class AuthService implements OnInit {

    private currentRoom: any = new Subject();
    public currentRoom$ = this.currentRoom.asObservable();

    private messages: any = new Subject();
    public messages$ = this.messages.asObservable();

    private currentUserSubject: any = new Subject();
    public currentUser = this.currentUserSubject.asObservable();
    chatManager: any;

    private user: any = new Subject();
    public user$ = this.user.asObservable();

    private chatkitUser: any = new Subject();
    public chatkitUser$ = this.chatkitUser.asObservable();

    constructor(private http: HttpClient, private _msgService: MessagingService ) {

        this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        // console.log('auth service constructed');

        this.user = new BehaviorSubject(localStorage.getItem('chatkitUserId'));
        this.user$ = this.user.asObservable();


        // this.chatkitUser = new BehaviorSubject(localStorage.getItem('chatkitUser'));
        this.chatkitUser = new ReplaySubject<Object>(1);
        this.chatkitUser$ = this.chatkitUser.asObservable();

        this.messages = new ReplaySubject<Object>(1);
        this.messages$ = this.messages.asObservable();

        // Only called on login
        this.user$.subscribe((x) => {
            // console.log(x);
            if (!x) { return; }

            this.initChatkit(x);
        });
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }


    public get userValue() {
        return this.user;
    }

    public set setUser(user) { this.user.next(user); }

    // public get chatkitUserValue() {
    //     return this.chatUserSubject.value;
    // }


    //
    // ─── SEND SIGN UP REQUEST TO SERVER ─────────────────────────────────────────────
    //

        signup(fname: string, lname: string, university: string, username: string, password: string) {
            // Create Okta User
            return this.http.post<any>(`${environment.apiUrl}/okta/signup`, { fname, lname, username, password })
            .toPromise()
            .then((user) => {
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
                    // console.log('Created Chatkit user!');
                    console.log(chatkitUser);

                    return this.login(username, password).then(loggedinUser => {
                        return loggedinUser;
                    });
                });
            });
        }
    // ─────────────────────────────────────────────────────────────────



    //
    // ─── VALIDATE LOGIN THROUGH OKTA ────────────────────────────────────────────────
    //

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/okta/login`, { username, password })
        .toPromise()
        .then((user) => {

            this.currentUser = user;
            console.log('LOGGED IN USER: ', user);

            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            localStorage.setItem('chatkitUserId', user._embedded.user.id);
            this.user.next(user._embedded.user.id);

            return user;
        });
    }
    // ─────────────────────────────────────────────────────────────────



    initChatkit(userId) {
        // console.log(userId);
        this.chatManager = new ChatManager({
            instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
            userId: userId,
            tokenProvider: new TokenProvider({
              url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
            })
          });

          return this.chatManager.connect().then(user => {
            this.chatkitUser.next(user);
            localStorage.setItem('chatkitUser', stringify(user));
            console.log(`Connected as ${user.name}`);

            // If user has no rooms then return
            if (!user.rooms.length) { return user; }

            user.joinRoom({ roomId: user.rooms[0].id })
            .then(room => {
                this.currentRoom.next(room);
                console.log(`Joined room with ID: ${room.id}`);
            })
            .catch((err, room) => {
              console.log(`Error joining room ${room.id}: ${err}`);
            });

            user.rooms.forEach(room => {
                user.subscribeToRoomMultipart({
                    roomId: room.id,
                    hooks: {
                        onMessage: message => {
                            this.messages.next(message);
                            // console.log('Received message:', message);
                        }
                    }
                });
            });

            return user;
          });
    }



    //
    // ─── HANDLE LOGOUT ──────────────────────────────────────────────────────────────
    //

    logout() {
        // TODO: Add logout function to authentication API - this is fine for now
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
    // ─────────────────────────────────────────────────────────────────

    ngOnInit() {
        console.log(this.currentUserSubject.value);
        localStorage.setItem('chatkitUserId', null);
    }
}
