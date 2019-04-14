import { Injectable, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private notifications = new BehaviorSubject(0);
  notificationCount = this.notifications.asObservable();

  currentUser: any;
  chatManager: any;
  chatkitUser: any;
  messages = [];

  _message = '';
  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this._message = value;
  }

  constructor( private authenticationService: AuthService) {

    this.currentUser = authenticationService.currentUserValue;

    this.chatManager = new ChatManager({
      instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
      userId: this.currentUser._embedded.user.id,
      tokenProvider: new TokenProvider({
        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
      })
    });




    // TODO: Add this to an addUser function - only call when necessary
    // this.chatManager
    // .connect()
    // .then(currentUser => {
    //   console.log('Connected as user ', currentUser);
    //   this.chatkitUser = currentUser;
    // })
    // .catch(error => {
    //   console.error('error:', error);
    // });
  }

  setRoomsWithNotifications(count) {
    // Get current notification count
    const currNotificationCount = this.notifications.value;
    // Update the globabl total
    this.notifications.next(count);
  }


  // Send a message
  sendMessage(room, message) {
    this.chatkitUser.sendSimpleMessage({
      roomId: room.id,
      text: 'Hi there!',
    })
    .then(messageId => {
      // console.log(`Added message to ${myRoom.name}`);
      console.log(`Added message to ${room.name}`);
    })
    .catch(err => {
      // console.log(`Error adding message to ${myRoom.name}: ${err}`);
      console.log(`Error adding message to ${room.name}: ${err}`);
    });
  }

  // Join a room
  // joinRoom(roomID) {
  //   return this.chatkitUser.joinRoom( { roomId: roomID } )
  //   .then(room => {
  //     console.log(`Joined room with ID: ${room.id}`);
  //     // Subscribe to room to receive notifications
  //     return room;
  //   })
  //   .catch(err => {
  //     console.log(`Error joining room ${roomID}: ${err}`);
  //   });
  // }

  // Subscribe to room
  subscribeToRoom(roomID) {
    return this.chatkitUser.subscribeToRoomMultipart({
      roomId: roomID,
      hooks: {
        onMessage: message => {
          console.log('received message', message);
          return message;
        }
      },
      messageLimit: 10
    });
  }

  // Fetch messages from room
  fetchMessages(roomID) {
    return this.chatkitUser
    .fetchMultipartMessages(
    {
      roomId: roomID,
      direction: 'older',
      limit: 10,
    })
    .then(messages => messages )
    .catch(err => {
      console.log(`Error fetching messages: ${err}`);
    });
  }
}
