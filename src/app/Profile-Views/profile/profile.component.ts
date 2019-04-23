import { Component, OnInit } from '@angular/core'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NgForm, FormGroup, FormBuilder, Validators, FormControl, MaxLengthValidator } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../../Core/_services/auth.service'
import { MessagingService } from '../../Core/_services/messaging.service'
import { environment } from '../../../environments/environment.prod'
import { UserService } from '../../Core/_services/user.service'
import { AppComponent } from '../../app.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  user: any
  currentUser: any
  connections: any
  subscription: any

  name = ''
  bio = ''
  major = ''
  graduationYear = ''
  interests = ''
  clubs = ''

  constructor( private authService: AuthService ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(
      (user) => {
        this.currentUser = user
        console.log('CHATKIT USER:', this.currentUser)
        this.initForm()
      }
    )
  }

  initForm() {
    try {
      this.name = this.currentUser.name
    } catch (error) {
      this.name = ''
    }

    try {
      this.bio = this.currentUser.customData.bio
    } catch (error) {
      this.bio = ''
    }

    try {
      this.major = this.currentUser.customData.major
    } catch (error) {
      this.major = ''
    }

    try {
      this.graduationYear = this.currentUser.customData.graduationYear
    } catch (error) {
      this.graduationYear = ''
    }

    try {
      this.interests = this.currentUser.customData.interests
    } catch (error) {
      this.interests = ''
    }

    try {
      this.clubs = this.currentUser.customData.clubs
    } catch (error) {
      this.clubs = ''
    }
  }
}
