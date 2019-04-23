import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomFormValidation } from '../../Core/_models/form-validation';


@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.css']
})
export class SecuritySettingsComponent implements OnInit {

  formValidation = new CustomFormValidation;
  oldPassword = new FormControl('')
  changePassForm: FormGroup;
  samePassword: boolean;
  passwordsMatch: boolean;
  constructor(private formBuilder: FormBuilder) { }

  onChanges() {
    this.changePassForm.valueChanges.subscribe(val => {

      if (val.oldPassword === val.newPassword) {
        this.samePassword = true
      }
      else {
        this.samePassword = false
      }

      if (val.newPassword === val.confirmPassword) {
        this.passwordsMatch = true
      } else {
        this.passwordsMatch = false
      }
    })
}

  onSubmit(){
    if (this.changePassForm.invalid) {
      return;
    }
    console.log("hi")
  }
  ngOnInit() {
    this.changePassForm = this.formBuilder.group({
      oldPassword: new FormControl([''], Validators.required),
      newPassword: new FormControl([''], Validators.compose([
        Validators.required, Validators.pattern(this.formValidation.passwordValidation)
      ])),
      confirmPassword: new FormControl([''], Validators.required),
    })

    this.onChanges()
  }

}
