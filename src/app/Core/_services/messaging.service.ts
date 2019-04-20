import { Injectable, OnInit } from '@angular/core'
import {AuthService} from './auth.service'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import { User } from '../_models/user'
import { BehaviorSubject, Subscription } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environments/environment.prod'


@Injectable({
  providedIn: 'root'
})
export class MessagingService {



  chatManager: any
  currentUser: any
  latestRoom: any
  latestReadCursor: any
  messages: Array<any> = []
  roomsAndMessages: any;
  rooms: any;
  constructor(private http: HttpClient) { console.log('Messaging service constructed') }



  //
  // ─── SET READ CURSOR ────────────────────────────────────────────────────────────
  //

    setLatestReadCursor(user, roomId) {

      // get position (ID) of latest room message
      this.fetchRoomMessages(user, roomId, '', 1).then((messages) => {
        console.log(messages)

        // set position of cursor to match
        user.setReadCursor({
            roomId: roomId,
            position: messages[0].id
          })
          .then(() => {
            user.rooms.forEach(room => {
              if (room.id === messages[0].roomId) {
                this.latestRoom = room
              }
            })
            console.log(`Set read cursor in room ${roomId} with position ${messages[0].id}`)
          })
          .catch(err => {
            console.log(`Error setting cursor: ${err}`)
          })
      })
    }
  // ────────────────────────────────────────────────────────────────────────────────



  //
  // ─── SET READ CURSOR ────────────────────────────────────────────────────────────
  //

    setReadCursor(user, roomId, position) {

      user.setReadCursor({
          roomId: roomId,
          position: position
        })
        .then(() => {
          console.log(`Set read cursor in room ${roomId}`)
        })
        .catch(err => {
          console.log(`Error setting cursor: ${err}`)
        })
    }
  // ────────────────────────────────────────────────────────────────────────────────



  //
  // ─── GET LATEST ROOM ────────────────────────────────────────────────────────────
  //

    getLatestRoom(user) {
      console.log('getting latest room')
      if (this.latestRoom) { return this.latestRoom }

      let latestRoom
      const latestReadCursor = this.getLatestReadCursor(user)
      console.log(latestReadCursor)


      user.rooms.forEach(room => {
        console.log(room.id)
        console.log(latestReadCursor.roomId)

        if (room.id === latestReadCursor.roomId) { latestRoom = room }

      })

      return latestRoom

      // return user.rooms.forEach(room => {
      //   console.log(room.id);
      //   console.log(latestReadCursor.roomId);

      //   while (room.id)

      //   if (room.id === latestReadCursor.roomId) { return room; }

      //   // if (latestRoom) { console.log('Got latest room'); return latestRoom; }/

      // });
    }
  // ─────────────────────────────────────────────────────────────────



  //
  // ─── GET LATEST CURSOR ──────────────────────────────────────────────────────────
  //

    getLatestReadCursor(user) {

      if (this.latestReadCursor) { return this.latestReadCursor }

      const cursors = []

      // first, get user cursor from each room
      user.rooms.forEach(room => {
        cursors.push(user.readCursor({ roomId: room.id }))
      })

      console.log(cursors)

      // then sort to find lowest
      const sorted = cursors.sort()
      console.log(sorted)

      const latestCursor = sorted[0]

      this.latestReadCursor = latestCursor
      return latestCursor
    }
  // ─────────────────────────────────────────────────────────────────



  roomHasMessages(user, roomId) {

    this.rooms.forEach(room => {
      if (room.id === roomId) { return true}
    })
    return false
  }



  fetchRoomMessages(user, roomId, direction = 'older', limit = 0) {

    if (this.roomHasMessages(user, roomId)) { return this.rooms }

    return user.fetchMultipartMessages({
      roomId: roomId,
      direction: direction,
      limit: limit,
    })
      .then(messages => {

        const roomWithMessages = new Array(roomId, messages)

        this.rooms.push(roomWithMessages)
        return messages
      })
      .catch(err => {
        console.log(`Error fetching messages: ${err}`)
      })
  }




  //
  // ─── JOIN ROOM ───────────────────────────────────────────────────
  //

    joinRoom(user: any, roomId: any) {

    return user.joinRoom({roomId: roomId})
        .then(room => {
          this.setLatestReadCursor(user, roomId)
          return room
        })
        .catch(err => {
          console.log(`Error joining room ${roomId}: ${err}`)
        })
    }
  // ─────────────────────────────────────────────────────────────────




  subscribeToAllRooms() {

    const currentUser = this.currentUser

    if (! currentUser.rooms.length) { return }

    currentUser.rooms.forEach(room => {
      currentUser.subscribeToRoomMultipart({
          roomId: room.id,
          hooks: {
              onMessage: message => {
                // console.log('Received message', message);
                this.messages.push(message)
              }
          },
          messageLimit: 10
      })
    })
  }



  initChatkit(userId) {

    this.chatManager = new ChatManager({
      instanceLocator: 'v1:us1:a54bdf12-93d6-46f9-be3b-bfa837917fb5',
      userId: userId,
      tokenProvider: new TokenProvider({
        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a54bdf12-93d6-46f9-be3b-bfa837917fb5/token'
      })
    })

    return this.chatManager.connect({
      onAddedToRoom: room => {
        console.log(`Added to room ${room.name}`)
      },
      onRemovedFromRoom: room => {
        console.log(`Removed from room ${room.name}`)
      },
      onRoomUpdated: room => {
        console.log(`Updated room ${room.name}`)
      },
      onRoomDeleted: room => {
        console.log(`Deleted room ${room.name}`)
      }
    })
      .then(user => {

        console.log(`Connected as ${user.name}. \n Setting up rooms...`)

        this.currentUser = user

        localStorage.setItem('chatkitUserId', user.id)

        // If user has no rooms then return
        if (!user.rooms.length) { return }

        // Subscribe to all user rooms to be notified of new messages
        this.subscribeToAllRooms()

        // Join the latest room

          console.log(user)

        const latestRoom = this.getLatestRoom(user)
        console.log(latestRoom)
        
        this.joinRoom(user, latestRoom.id)
        // this.getLatestRoom(user).then((room) => {
        //   this.joinRoom(user, room.id);
        // });


        return user
      })
  }
}
