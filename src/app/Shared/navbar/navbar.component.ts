import { Component, OnInit, Input } from '@angular/core';
import { MessagingService } from '../../Core/_services/messaging.service';
import { AuthService } from '../../Core/_services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  incomingMessages = 0;
  currUser: any;
  readCursors: Object;


  constructor(private msgService: MessagingService, private _auth: AuthService, private _messaging: MessagingService) {


    // SUBSCRIBE TO CURRENT USER … THEN GET READ CURSORS
    _auth.user$.subscribe(($user) => {

      this.currUser = $user;

      // GET ALL OF A USER’S READ CURSORS
      _messaging.getReadCursorsForUser($user.id)
        .toPromise()
        .then((cursors => {
          this.readCursors = cursors;
        }));
    });

    //  Get the current user's room

    // Get the router url

    // only display room notifications on primary navbar if the router URL is NOT rooms

    // iterate through rooms
      // if user read cursor does not equal the

    //

    // How many messages?

    // Room for each message?

     _auth.messages$.subscribe(() => {
      this.incomingMessages += 1;
      // console.log(this.incomingMessages);
    });

  }

  ngOnInit() {}

}
