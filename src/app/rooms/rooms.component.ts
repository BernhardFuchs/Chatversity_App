import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ViewChildren, QueryList, ViewContainerRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessagingService } from '../Core/_services/messaging.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { AuthService } from '../Core/_services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit {

  @ViewChildren('chatReel') chatReel: QueryList<ViewContainerRef>;
  currUser: any;
  subscription: any;
  incomingMessages: any;
  chatkitUser: any;
  fileToUpload: File;
  imagePath: any;
  notificationCount: any;
  selectedFile: File = null;
  fd = new FormData();
  rooms: Array<any> = [];
  currentUser: any;
  user_id: any;
  room_messages: Array<any> = [];
  current_room: any;
  chatUser: any;
  roomCreated: boolean;
  roomNotifications: Array<any> = [];
  url: string;

  // TODO: Can probably remove these props
  _roomPrivate = '';
  selectedRoomMember: any;
  get roomPrivate(): string {
    return this._roomPrivate;
  }
  set roomPrivate(value: string) {
    this._roomPrivate = value;
  }

  _message = '';
  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this._message = value;
  }

  formImport = new FormGroup({
    userAvatarFileGroup: new FormGroup({
      avatar: new FormControl(''),
    }),
    roomNameGroup: new FormGroup({
      roomName: new FormControl('', [
        Validators.required,
        Validators.maxLength(60)
      ])
    }),
    privateRoomGroup: new FormGroup({
      privateRoom: new FormControl('')
    })
  });

  //
  // ─── CONSTRUCTOR ────────────────────────────────────────────────────────────────
  //
    constructor(private http: HttpClient, private msgService: MessagingService, private _auth: AuthService) {

      this.subscription = this._auth.chatkitUser$.subscribe(
        (user) => {
          if (user) {
            this.chatkitUser = user;
            // console.log(this.chatkitUser);
            this.rooms = user.rooms;
            // console.log(this.rooms);
          }
        }
      );

      this.incomingMessages = this._auth.messages$.subscribe(
        (incomingMessage) => {
          this.room_messages.push(incomingMessage);
        }
      );

      this.current_room = this._auth.currentRoom$.subscribe(
        (currentRoom) => {
          this.current_room = currentRoom;
          // console.log(currentRoom);
        }
      );
    }
  // ────────────────────────────────────────────────────────────────────────────────

  onFileChange(event) {

    if (!(event.target.files && event.target.files[0])) { return; }

    this.selectedFile = <File>event.target.files[0];
    this.fd.append('avatar', this.selectedFile, this.selectedFile.name);
    // this.fileToUpload = file;
    // const reader = new FileReader();
    // reader.readAsDataURL(file); // read file as data url
    // reader.onload = (_event) => {
    //   console.log(reader.result); // log base64 string
    //   this.imagePath = reader.result;
    // };
  }

  //
  // ─── VIEW A USER IN THE ROOM ────────────────────────────────────────────────────
  //

  setSelectedRoomMember(user: any) {
    this.selectedRoomMember = user;
  }
  // ────────────────────────────────────────────────────────────────────────────────


  //
  // ─── SEND A MESSAGE ─────────────────────────────────────────────────────────────
  //
    sendMessage() {
      const { message, currentUser } = this;
      this.chatkitUser.sendMessage({
        text: message,
        roomId: this.current_room.id,
      }).then(res => {
        console.log(res);
      });
      this.message = '';
    }
  // ─────────────────────────────────────────────────────────────────

  // Join a room
  joinRoom(roomID) {
    this.chatkitUser.joinRoom({roomId: roomID}).then(room => {
      this.current_room = room;
      console.log(this.current_room);

      // After joining room, fetch messages
      this.chatkitUser.fetchMultipartMessages({roomId: roomID}).then(messages => {

        // Check if messages
        if (messages === undefined || messages.length === 0) { return; }

        // Set read cursor
        this.chatkitUser.setReadCursor({
          roomId: this.current_room.id,
          position: messages[messages.length - 1].id
        })
        .then(() => {
          this.roomNotifications[room.id] = false;
        }); // Remove marker from notifications array
        // .then(() => {
        //     console.log('Set cursor');
        //   })
        //   .catch(err => {
        //     console.log(`Error setting cursor: ${err}`);
        //   });
        messages.forEach(message => {
          // console.log(message.parts[0].payload.content);
          // console.log(message);
        });
        this.room_messages = messages;
      });
    });
  }
  // end Join room

  // Function => check if user has unread messages in a room
  hasUnread(roomID) {

    let hasUnread = false; // Track return status

    // First, check if cursor exists
    const cursor = this.chatkitUser.readCursor({
      roomId: roomID
    });

    // if read cursor ID !== latest message ID...
    this.chatkitUser.fetchMultipartMessages({ // Get latest message
      roomId: roomID,
      limit: 1,
    })
    .then(messages => {
      if (cursor) { // Has cursor so check cursor pos vs latest message id
        hasUnread = (cursor.position !== messages[0].initialId) ? true : false;
      } else {
        // No cursor => set
      }
    })
    .catch(err => {
      console.log(`Error fetching messages: ${err}`);
    });

    return hasUnread;
  }



  //
  // ─── GET CHATKIT USER ───────────────────────────────────────────────────────────
  //

    getUser(user_id) {
      return this.http.post<any>(`${environment.apiUrl}/chatkit/getuser`, {user_id})
      .toPromise()
      .then(res => {
        return res;
        console.log(res);
      })
      .catch(error => console.log(error));
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── GET CHATKIT USERS ROOMS ────────────────────────────────────────────────────
  //

    getUserRooms(user_id) {
      return this.http.post<any>(`${environment.apiUrl}/chatkit/getuserrooms`, {user_id})
      .toPromise()
      .then(res => {
        // this.rooms = res;
        console.log(res);
        return res;
      })
      .catch(error => console.log(error));
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── SUBSCRIBE TO ROOM ──────────────────────────────────────────────────────────
  //

    subscribeToRoom(roomID) {
      this.chatkitUser.subscribeToRoomMultipart({
        roomId: roomID,
        hooks: {
          onMessage: message => {
            // When a message is received...

            // Push to messages array and update view
            this.room_messages.push(message);
            // Scroll chat window to reveal latest message
            // document.getElementById('chatReel').scrollTop = 0;
            // alert(document.getElementById('chatReel'));

            // Get the users last cursor position from the room
            const cursor = this.chatkitUser.readCursor({
              roomId: message.roomId
            });

            if ((cursor.position !== message.id) && (message.roomId !== this.current_room.id)) {
              // If the current user has not seen the message, AND the message was received in a different room,
              // add marker to notification array
              this.roomNotifications[message.room.id] = true;
            } else {
              // Otherwise, message was sent in current room, so all we must do is update the
              // read cursor for the current user's room
              this.chatkitUser.setReadCursor({
                roomId: message.roomId,
                position: message.id,
              });
            }

            // Count rooms with unread notifucations
            let roomsWithNotifications = 0;
            this.roomNotifications.forEach(room => {
              roomsWithNotifications += room === true ? 1 : 0;
            });
            // Add to global notification counter
            this.msgService.setRoomsWithNotifications(roomsWithNotifications);
          },
          onAddedToRoom: room => {
            console.log(`Added to room ${room.name}`);
          }
        },
        messageLimit: 1
      });
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── CREATE ROOM ────────────────────────────────────────────────────────────────
  //

    createRoom() { // TODO: Add to message service

      const roomName = this.formImport.value.roomNameGroup.roomName;
      let roomAvatar = '';

      // TODO: Add this to upload service
      // Upload image
      this.http.post(`${environment.apiUrl}/rooms/avatar`, this.fd)
      .toPromise()
      .then( avatar => {
        roomAvatar = avatar['filename']; // Store path
        console.log(roomAvatar);
        // Create the room
        this.chatkitUser.createRoom({ // Create the room
          name: roomName,
          private: false,
          customData: { roomAvatar: roomAvatar }, // Add room avatar to custom room data
        }).then( room => { // Succes
            this.rooms.push(room); // Add the new room to the list
            this.roomCreated = true;
            console.log(room);
            console.log(`Created room called ${room.name}`);
          })
          .catch(err => { // Failed room creation
            console.log(`Error creating room ${err}`);
          });
      });
    }
  // ────────────────────────────────────────────────────────────────────────────────


  ngOnInit() {
    // Subscribe to new notifications
    this.msgService.notificationCount
    .subscribe(notification => this.notificationCount = notification);

    // Get user id from local storage
    const user_id = JSON.parse(localStorage.getItem('currentUser'))._embedded.user.id;
  }

  ngAfterViewInit() {
    // setInterval(this.logtheheight, 3000);
    // console.log(this.chatReel);
    this.chatReel.changes.subscribe(c => { c.toArray().forEach(item => {
      // console.log(item);
      // console.log(item.nativeElement);
      // console.log(item.nativeElement.scrollHeight);

      // console.log('Scroll Height: ' + item.nativeElement.offsetParent.scrollHeight);
      // console.log('Scroll Top: ' + item.nativeElement.offsetParent.scrollTop);

      item.nativeElement.offsetParent.scrollTop = item.nativeElement.offsetParent.scrollHeight;
      // item.nativeElement.scrollTop = item.nativeElement.offsetTop;
      // item.nativeElement.animate({ scrollTop: 0 }, 'fast');
      // item.nativeElement.scrollTop = 0;
    });
  });
    // console.log(elem.nativeElement);
  }
}
