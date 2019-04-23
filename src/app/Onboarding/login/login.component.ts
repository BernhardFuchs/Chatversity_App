import { Component, OnInit } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import {AuthService} from '../../Core/_services/auth.service'
import { CustomFormValidation } from '../../Core/_models/form-validation'
import { MessagingService } from '../../Core/_services/messaging.service'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loading = false
  submitted = false
  returnUrl = 'home'
  formValidation: CustomFormValidation = new CustomFormValidation()

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessagingService) {}

  ngOnInit() {
    // TODO: Check if already logged in, redirect
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(this.formValidation.regularEmailValidation)]
      )],
      password: ['', Validators.required]
  })
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls }

  //
  // ─── HANDLE LOGIN FORM ──────────────────────────────────────────────────────────
  //
    onSubmit() {

      this.submitted = true
      this.loading = true

      // Stop here if form is invalid
      if (this.loginForm.invalid) {
        this.loading = false
        return
      }

      // Create obj to hold formdata
      const formData: FormData = new FormData()

      // Append username and password to form data
      formData.append('username', this.loginForm.get('username').value)
      formData.append('password', this.loginForm.get('password').value)

      this.authService.login(this.f.username.value, this.f.password.value).then(oktaUser => {

        // console.log(`Logged in as ${oktaUser._embedded.user.profile.firstName}`)

        /*******************/
        /* Begin App setup */
        /*******************/

        // Initialize Chatkit
        // this.messageService.initChatkit(oktaUser._embedded.user.id)
        //   .then(chatkitUser => {

        //     this.authService.currentUser = chatkitUser;
        //     console.log(this.authService.currentUser);

            this.router.navigate([this.returnUrl])

        // });

      },
      error => {
        console.log('LOGIN ERROR:', error)
        this.loading = false
        this.loginForm.setErrors( {'invalid': true} )
      })
    }
  // ─────────────────────────────────────────────────────────────────

}
