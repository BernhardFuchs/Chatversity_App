import { Component, OnInit, Input } from '@angular/core'
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { UserService } from '../../Core/_services/user.service'
import { MessagingService } from '../../Core/_services/messaging.service'
import { AuthService } from '../../Core/_services/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() userType: boolean
  @Input() roomType: boolean

  currUser: any

  searchForm: FormGroup
  loading = false
  submitted = false

  userResults: any
  roomResults: any

  users: any
  selectedUser: any
  rooms: any
  selectedRoom: any

  constructor(private formBuilder: FormBuilder, private _userService: UserService, private _msgService: MessagingService,
    private authService: AuthService, private router: Router) { }

  //
  // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
  //

  get f() { return this.searchForm.controls }

  //
  // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
  //

  getUser(_id: number): any {
    return this.users.find(c => c.id === _id)
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── RETURN USER FROM FRIEND LIST ───────────────────────────────────────────────
  //

  getRoom(_id: number): any {
    return this.rooms.find(r => r.id === _id)
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
  // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
  //

  getUsersByName(_name: string) {
    this.userResults = this.search(_name, this.users)
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── FILTER LIST OF USERS BY NAME ───────────────────────────────────────────────
  //

  getRoomsByName(_name: string) {
     this.roomResults = this.search(_name, this.rooms)
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── HELPER SEARCH METHOD ─────────────────────────────────────────────────────────────
  //

  search(_query: string, _data: any) {
    const _length = _query.length
    _query = _query.toLowerCase()

    return _data.filter(d =>
      d.name.toLowerCase().substring(0, _length).includes(_query)).splice(0, 5)
  }

  //
  // ─── HANDLE SEARCH ─────────────────────────────────────────────────────────────
  //

  onSearch() {
    this.submitted = true
    this.loading = true

    if (this.searchForm.invalid) {
      this.submitted = false
      this.loading = false
      return
    }

    const query: string = this.searchForm.get('search').value

    if (this.userType) {
      this.getUsersByName(query)
    }

    if (this.roomType) {
      this.getRoomsByName(query)
    }

    this.loading = false
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── HANDLE CLICK USER BUTTON ───────────────────────────────────────────────────
  //

  setUser(_user: any) {
    this.selectedUser = _user
  }
  // ─────────────────────────────────────────────────────────────────

  //
  // ─── HANDLE CLICK ROOM BUTTON ───────────────────────────────────────────────────
  //

  setRoom(_room: any) {
    this.selectedRoom = _room
  }
  // ─────────────────────────────────────────────────────────────────

  //
  // ─── HANDLE CLICK ROOM BUTTON ───────────────────────────────────────────────────
  //

  getUserActivityStatus(_id: any) {
    return (this.currUser.presenceStore[_id] === 'online') ? true : false
  }
  // ─────────────────────────────────────────────────────────────────

  ngOnInit() {
    // Get current user
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.currUser = user
        console.log('CHATKIT USER:', this.currUser)

        // Get all users
        if (this.userType) {
          this._userService.getAll()
          .toPromise()
          .then((data) => {
            console.log('RESPONSE USER:', data)
            this.users = data
          })
          .catch((error) => {
            console.log(error)
          })
        }

        // Get all rooms
        if (this.roomType) {
          this._msgService.getAllRooms()
          .toPromise()
          .then((data) => {
            console.log('RESPONSE ROOM:', data)
            this.rooms = data
          })
          .catch((error) => {
            console.log(error)
          })
        }
     })

    // Setup search box
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required]
    })
  }

}
