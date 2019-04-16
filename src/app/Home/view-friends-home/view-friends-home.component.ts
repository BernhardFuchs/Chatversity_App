import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../Core/_models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { UserService } from '../../Core/_services/user.service';
import { MessagingService } from '../../Core/_services/messaging.service';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../Core/_services/auth.service';

@Component({
  selector: 'app-view-friends-home',
  templateUrl: './view-friends-home.component.html',
  styleUrls: ['./view-friends-home.component.css']
})
export class ViewFriendsHomeComponent implements OnInit {

  searchForm: FormGroup;
  loading = false;
  submitted = false;
  connections: any;
  connection: User;
  isConnection = false;
  currUser: any;
  appUser: any;
  results: User[];
  // Field for connection
  connectionToAdd = new FormControl('');
  subscription: any;
  chatkitUser: any;
  rooms: any;


  //
  // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
  //

    constructor(private http: HttpClient,
      private formBuilder: FormBuilder,
      private _userService: UserService,
      private _msgService: MessagingService,
      private app: AppComponent,
      private _auth: AuthService) {
        this.subscription = this._auth.chatkitUser$.subscribe(
          (user) => {
            this.chatkitUser = user;
            console.log(this.chatkitUser);
            this.rooms = user.rooms;
            console.log(this.rooms);
          }
        );

        // this.incomingMessages = this._auth.messages$.subscribe(
        //   (incomingMessage) => {
        //     this.room_messages.push(incomingMessage);
        //   }
        // );

        // this.current_room = this._auth.currentRoom$.subscribe(
        //   (currentRoom) => {
        //     this.current_room = currentRoom;
        //     console.log(currentRoom);
        //   }
        // );
      }
  // ────────────────────────────────────────────────────────────────────────────────



  //
  // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
  //

    get f() { return this.searchForm.controls; }
  // ────────────────────────────────────────────────────────────────────────────────



  //
  // ─── ADD CONNECTION ─────────────────────────────────────────────────────────────
  //

    addConnection() {
      console.log(this.connectionToAdd.value);
      // Get okta user by login (email)
      this.http.get(`${environment.apiUrl}/okta/GetUserByLogin/${this.connectionToAdd.value}` )
      .toPromise()
      .then((oktaUser) => {
        console.log(oktaUser);
        // Get the user from Chatkit by matching the IDs
        this.http.get(`${environment.apiUrl}/chatkit/GetUserById/${oktaUser['id']}`)
        .toPromise()
        .then((chatkitUser) => {
          // Found user => add 'connection request marker' to custom data field
          // TODO: Check if users are already connected

        })
        .catch((error) => {
          console.log('Chatkit user not found!');
        });
      })
      .catch((error) => {
        console.log('Okta user not found!');
      });
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
  //

    getUser(_id: number): User {
      return this.connections.find(c => c.id === _id);
    }
  // ────────────────────────────────────────────────────────────────────────────────


  //
  // ─── SORT CONNECTIONS LIST ──────────────────────────────────────────────────────
  //

    sortList(users: User[]) {
      return  users.sort((a, b) => ((a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase())
      > (b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase()) ? 1 : -1));
    }
  // ────────────────────────────────────────────────────────────────────────────────



  //
  // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
  //

    getUsersByName(_name: string) {
      _name = _name.toLowerCase();
      this.results = this.connections.filter(c =>
        (c.firstName.toLowerCase() + ' ' + c.lastName.toLowerCase()).includes(_name)).slice(0, 5);
    }
  // ────────────────────────────────────────────────────────────────────────────────



  //
  // ─── CHECK IF USERS ARE FRIENDS ─────────────────────────────────────────────────
  //

    isConnected(_id: number) {
      // Get current user data

      // Check if this user is on the other user's connections list

      // Toggle isConnection variable

      return;
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── HANDLE CLICK USER BUTTON ───────────────────────────────────────────────────
  //

    setUser(_id: number) {
      this.connection = this.getUser(_id);
      this.isConnected(_id);
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── HANDLE SIGN UP ─────────────────────────────────────────────────────────────
  //

    onSearch() {
      this.submitted = true;
      this.loading = true;

      if (this.searchForm.invalid) {
        this.submitted = false;
        this.loading = false;
        return;
      }

      const query: string = this.searchForm.get('search').value;

      this.getUsersByName(query);

      this.loading = false;
    }
  // ────────────────────────────────────────────────────────────────────────────────



  ngOnInit() {

    //
    // ─── LOAD USER CONNECTIONS ───────────────────────────────────────
    //

      this._userService.getConnections(this.chatkitUser.id)
      .toPromise()
      .then((connections) => {
        this.connections = connections;
        console.log(connections);
      });
    // ────────────────────────────────────────────────────────────────────────────────



    //
    // ─── SETUP SEARCH BOX ────────────────────────────────────────────
    //

      this.searchForm = this.formBuilder.group({
        search: ['', Validators.required]
      });
    // ─────────────────────────────────────────────────────────────────

  }
}
