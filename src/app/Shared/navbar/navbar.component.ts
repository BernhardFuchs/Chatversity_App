import { Component, OnInit, Input } from '@angular/core';
import { MessagingService } from '../../Core/_services/messaging.service';
import { AuthService } from '../../Core/_services/auth.service';
import { Observable } from 'rxjs';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser: any;
  rooms: Array<any>;
  roomsWithNewMessages: Array<any> = [];

  constructor(private _auth: AuthService, private _messaging: MessagingService) {

    this._auth.chatkitUser$.subscribe(
      (user) => {

        this.currentUser = (user != null) ? user : null;

        if ((user != null) && (user.id)) {
          this.setNotifications(user);
        }
      }
    );
  }

  setNotifications(user) {

    const rooms = user.rooms;
    let i = 0;

    // foreach room -> compare latest message to user cursor
    rooms.forEach(room => {

      // get latest message
      user.fetchMultipartMessages({
        roomId: room.id,
        direction: 'older',
        limit: 1,
      })
        .then(messages => {

          // compare dates -> determine if new
          if (messages[0].id > user.readCursor({
            roomId: room.id
          }).position) {

            console.log(`New message in ${messages[0].room.name}`);
            this.roomsWithNewMessages.push(room);

          }
        })
        .catch(err => {
          console.log(`Error fetching messages: ${err}`);
        });

        i++;

    });
  }

  ngOnInit() {}
}
