import { Component, OnInit } from '@angular/core'
import { AuthService } from './Core/_services/auth.service'
import { User } from './Core/_models/user'
import { Router } from '@angular/router'
import { SwUpdate } from '@angular/service-worker'
import { MessagingService } from './Core/_services/messaging.service'


@Component({
  selector: 'app-root',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  currentUserLoggedIn: any
  title = 'Chatversity'
  update = false
  currUser: any
  currentUser: any
  // chatkitUser: any;

  constructor(
      private router: Router,
      private authService: AuthService,
      private updates: SwUpdate,
      private messageService: MessagingService) {}

  //
  // ─── LOGOUT USER ────────────────────────────────────────────────────────────────
  //

    logout() {
      this.authService.logout()
    }
  // ────────────────────────────────────────────────────────────────────────────────



  // !
  // ! ─── FOR TESTING ONLY - USE THIS FUNCTION TO REMOVE THE NAVBAR ON PAGES THAT DO NOT NEED IT
  // !

    RemoveNavbarForTesting() {
      if (this.router.url === '/login'
      || this.router.url === '/signup'
      || this.router.url === '/forgot'
      || this.router.url === '/new-user'
      || this.router.url === '/404') {
        return false
      }

      return true
    }
  // ! ────────────────────────────────────────────────────────────────────────────────



  ngOnInit() {
    console.log('%cWelcome to Chatversity!', 'font-size: 20px; color: #186fa0;')
    console.log('Initializing app')

    this.authService.getCurrentUser().subscribe((user) => {

      this.currentUser = user
      // if (user) { this.currentUser = user; return } else {
      //   this.messageService.initChatkit(this.authService.getUserId())
      // }

      console.log(user)
    })

  //   this.messageService.initChatkit(this.authService.getUserId())
  //   .then(chatkitUser => {
  //     console.log('got chatkit user');
  //     console.log(chatkitUser);
  //     this.authService.currentUser = chatkitUser;
  //     this.currentUser = chatkitUser;
  //     console.log(this.authService.currentUser);

  // });
    console.log('User Logged In: ' + this.authService.userLoggedIn())
  }
}
