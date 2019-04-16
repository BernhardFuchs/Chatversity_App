import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../Core/_models/user';
import { UserProfile } from '../../Core/_models/profile';

@Component({
  selector: 'app-small',
  templateUrl: './small.component.html',
  styleUrls: ['./small.component.css']
})
export class SmallComponent implements OnInit {

  bio: string;
  graduationYear: string;

  @Input() user: any;
  @Input() isConnection = false;

  constructor() { }

  ngOnInit() {

    try {
      this.bio = this.user.customData.bio;
    } catch (error) {
      this.bio = '';
    }

    try {
      this.graduationYear = this.user.customData.graduationYear;
    } catch (error) {
      this.graduationYear = '';
    }
  }

  addConnection() {
    this.isConnection = true;
  }

}
