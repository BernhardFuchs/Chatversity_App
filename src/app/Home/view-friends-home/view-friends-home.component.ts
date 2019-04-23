import { Component, OnInit } from '@angular/core'
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment.prod'
import { UserService } from '../../Core/_services/user.service'
import { MessagingService } from '../../Core/_services/messaging.service'
import { AppComponent } from '../../app.component'
import { AuthService } from '../../Core/_services/auth.service'
import { View } from '../../Core/_models/view'

@Component({
  selector: 'app-view-friends-home',
  templateUrl: './view-friends-home.component.html',
  styleUrls: ['./view-friends-home.component.css']
})
export class ViewFriendsHomeComponent implements OnInit {

  connections: any

  // Field for connection
  connectionToAdd = new FormControl('')
  subscription: any
  rooms: any

  currentUser: any
  onlineUsers: any

  AllView: View = { id: 1, name: 'All', current: false }
  OnlineView: View = { id: 2, name: 'Online', current: false }
  PendingView: View = { id: 3, name: 'Pending', current: false }
  SearchView: View = { id: 4, name: 'Search', current: false }

  views: View[] = [this.AllView, this.OnlineView, this.PendingView, this.SearchView]

  //
  // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
  //

    constructor(private http: HttpClient,
      private formBuilder: FormBuilder,
      private _userService: UserService,
      private _msgService: MessagingService,
      private app: AppComponent,
      private authService: AuthService) { }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── ADD CONNECTION ─────────────────────────────────────────────────────────────
  //

    addConnection() {
      const userId = '00udacjrnsj15ezNA356'
      this._userService.inviteConnection(userId).toPromise().then((user) => {
        console.log(user)
      })

      // console.log(this.connectionToAdd.value)
      // // Get okta user by login (email)
      // this.http.get(`${environment.apiUrl}/okta/GetUserByLogin/${this.connectionToAdd.value}` )
      // .toPromise()
      // .then((oktaUser) => {
      //   console.log(oktaUser)
      //   // Get the user from Chatkit by matching the IDs
      //   this.http.get(`${environment.apiUrl}/chatkit/GetUserById/${oktaUser['id']}`)
      //   .toPromise()
      //   .then((currentUser) => {
      //     // Found user => add 'connection request marker' to custom data field
      //     // TODO: Check if users are already connected

      //   })
      //   .catch((error) => {
      //     console.log('Chatkit user not found!')
      //   })
      // })
      // .catch((error) => {
      //   console.log('Okta user not found!')
      // })
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
  //

  getUser(_id: number): any {
    return this.connections.find(c => c.id === _id)
  }
  // ────────────────────────────────────────────────────────────────────────────────


  //
  // ─── SORT CONNECTIONS LIST ──────────────────────────────────────────────────────
  //

  sortList(users: any) {
    return  users.sort((a, b) => ((a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase())
    > (b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase()) ? 1 : -1))
  }
  // ────────────────────────────────────────────────────────────────────────────────


  //
  // ─── CHECK IF USERS ARE FRIENDS ─────────────────────────────────────────────────
  //

  isConnected(_id: number) {
    // Get current user data

    // Check if this user is on the other user's connections list

    // Toggle isConnection variable

    return
  }
  // ─────────────────────────────────────────────────────────────────

  //
  // ─── SET ALL VIEW CURRENT ATTRIBUTE TO FALSE ─────────────────────────────────────────────────
  //

  setViewsToFalse() {
    this.views.forEach(function(view) {
      view.current = false
    })
  }
  // ─────────────────────────────────────────────────────────────────

  //
  // ─── SET CLICKED VIEW TO TRUE ─────────────────────────────────────────────────
  //

  setView(_view: View) {
    this.setViewsToFalse()
    _view.current = true
  }
  // ─────────────────────────────────────────────────────────────────

  ngOnInit() {
    this.AllView.current = true

    this._msgService.getOnlineUsers().subscribe((userAndState) => {
      console.log(userAndState)
    })

    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user

      this._userService.getConnections(user.id)
      .toPromise()
      .then((connections) => {
        this.connections = connections
        console.log(connections)
      })
    })
  }
}
