import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { AuthService } from '../../Core/_services/auth.service';
import { first } from 'rxjs/operators';
import { University } from '../../Core/_models/university';
import { CustomFormValidation } from '../../Core/_models/form-validation';
import { environment } from '../../../environments/environment';

// NativeScript Imports
import application = require("tns-core-modules/application");
import { getFrameById } from 'tns-core-modules/ui/frame';


const frame = getFrameById("signupFrame");
// Navigate from Signup component to Login component
frame.navigate("login");


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  universities: University[];
  searchingForSchool = false;
  formValidation: CustomFormValidation = new CustomFormValidation();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient) { }

  ngOnInit() {

    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      university: ['', Validators.required],
      username: ['', Validators.compose([
        Validators.required, Validators.email, Validators.pattern(this.formValidation.eduEmailValidation)
      ])],
      password: ['', Validators.compose([
        Validators.required, Validators.minLength(6), Validators.pattern(this.formValidation.passwordValidation)
      ])]
    });

    this.returnUrl = '/new-user';
  }

  //
  // ─── CHECK FOR USERNAME OR PASSWORD ERRORS ──────────────────────────────────────
  //
  checkForFormErrors() {
    if (this.f.username.errors || this.f.password.errors) {
      return true;
    }
    return false;
  }

  //
  // ─── CONVENIENCE GETTER FOR EASY ACCESS TO FORM FIELDS ──────────────────────────
  //
  get f() { return this.signupForm.controls; }

  //
  // ─── CHECK FOR VALID UNIVERSITY ─────────────────────────────────────────────────
  //
  checkUniversity(_id: number): boolean {
    console.log('University Id:' + _id);
    return (this.universities.find(x => x.id.toString() === _id.toString())) ? true : false;
  }

  //
  // ─── SEARCH FOR UNIVERSITY FROM JSON STORE ──────────────────────────────────────
  //
  findUniversity(query: string) {
    this.searchingForSchool = true;
    console.log(query);

    this.http.get(`${environment.apiUrl}/university/${query}`)
    .toPromise()
    .then(university => {
      console.log(university);
    })
    .catch(error => {
      this.searchingForSchool = false;
    });
  }

  //
  // ─── HANDLE SIGN UP ─────────────────────────────────────────────────────────────
  //
  onSubmit() {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      this.loading = false;
      return;
    }

    // Stop if invalid university
    if (!(this.checkUniversity(this.signupForm.get('university').value))) {
      console.log('Invalid University.');
      this.f.university.setErrors({'invalid': true});
      this.loading = false;
      return;
    }

    // Create obj to hold formdata
    const formData: FormData = new FormData();

    // Append input to form data
    formData.append('firstname', this.signupForm.get('firstname').value);
    formData.append('lastname', this.signupForm.get('lastname').value);
    formData.append('university', this.signupForm.get('university').value);
    formData.append('username', this.signupForm.get('username').value);
    formData.append('password', this.signupForm.get('password').value);

    this.auth.signup(this.f.firstname.value, this.f.lastname.value, this.f.university.value, this.f.username.value, this.f.password.value);

    this.loading = false;
  }
}


// Dont place any code below this final line as it will not execute when running the NativeScript app
// This is the inital starting point of the app!  Dont change unless we do a team discussin and design changes
// ~ Noah

application.run({ moduleName: "signup"  });
