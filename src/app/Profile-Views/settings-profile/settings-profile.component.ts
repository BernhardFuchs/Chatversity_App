import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl, MaxLengthValidator } from '@angular/forms';
import { AuthService } from '../../Core/_services/auth.service';
import { UserService } from '../../Core/_services/user.service';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent implements OnInit {
  loading = false;
  submitted = false;
  editingForm = false;

  profileForm: FormGroup;
  user: any;
  subscription: any;
  chatkitUser: any;

  name = '';
  bio = '';
  major = '';
  graduationYear = '';
  interests = '';
  clubs = '';

  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private userService: UserService) {
      this._auth.chatkitUser$.subscribe(
        (user) => {
          this.chatkitUser = user;
          console.log('CHATKIT USER:', this.chatkitUser);
          this.initForm();
        }
      );
    }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  // Validation and other actions upon form submission
  onSubmit() {
    this.submitted = true;
    this.loading = true;

    // Stop here if form is invalid
    if (this.profileForm.invalid) {
      this.loading = false;
      console.log('ERROR: Form invalid');
      return;
    }

    // Get updated profile data from user
    const _name: string = this.profileForm.get('name').value;
    const _bio: string = this.profileForm.get('bio').value;
    const _major: string = this.profileForm.get('major').value;
    const _gradYr: number = this.profileForm.get('graduationYear').value;
    const _interests: string = this.profileForm.get('interests').value;
    const _clubs: string = this.profileForm.get('clubs').value;

    // Get current user custom data
    const currentUserData = this.chatkitUser.customData;
    console.log('CHATKIT USER CUSTOM DATA: ', currentUserData);

    // Add update data
    currentUserData['name'] = _name;
    currentUserData['bio'] = _bio;
    currentUserData['major'] = _major;
    currentUserData['graduationYear'] = _gradYr;
    currentUserData['interests'] = _interests;
    currentUserData['clubs'] = _clubs;

    // Send the updated data and update the user
    this.userService.update(this.chatkitUser.id, JSON.stringify(currentUserData))
    .toPromise()
    .then((data) => {

      console.log('RESPONSE:', data);
      console.log('UPDATED CHATKIT USER:', this.chatkitUser);

      this.setUserProfile(data);

      this.editingForm = false;
      this.loading = false;
    });
  }

  // Build profile form
  initForm() {
    this.getUserProfile();

    // Build Form
    this.profileForm = this.formBuilder.group({
      // Name
      name: [ this.name, Validators.required ],
      // Bio
      bio: [ this.bio, MaxLengthValidator ],
      // Major
      major: [ this.major, MaxLengthValidator ],
      // Graduation year
      graduationYear: [ this.graduationYear, MaxLengthValidator ],
      // Interests
      interests: [ this.interests, MaxLengthValidator ],
        // Clubs
      clubs: [ this.clubs, MaxLengthValidator ]
    });
  }

  // Set updated profile data
  setUserProfile(userData) {
    this.chatkitUser.customData.avatarURL = userData.avatar_url;
    this.chatkitUser.customData.customData = userData.custom_data;
    this.chatkitUser.name = userData.name;
    this.chatkitUser.updatedAt = userData.updated_at;
  }

  // Bring in chatkit user data
  getUserProfile() {
    try {
      this.name = this.chatkitUser.name;
    } catch (error) {
      this.name = '';
    }

    try {
      this.bio = this.chatkitUser.customData.bio;
    } catch (error) {
      this.bio = '';
    }

    try {
      this.major = this.chatkitUser.customData.major;
    } catch (error) {
      this.major = '';
    }

    try {
      this.graduationYear = this.chatkitUser.customData.graduationYear;
    } catch (error) {
      this.graduationYear = '';
    }

    try {
      this.interests = this.chatkitUser.customData.interests;
    } catch (error) {
      this.interests = '';
    }

    try {
      this.clubs = this.chatkitUser.customData.clubs;
    } catch (error) {
      this.clubs = '';
    }
  }

  ngOnInit() {
  }
}
