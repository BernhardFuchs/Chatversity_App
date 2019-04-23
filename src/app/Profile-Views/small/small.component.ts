import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-small',
  templateUrl: './small.component.html',
  styleUrls: ['./small.component.css']
})
export class SmallComponent implements OnInit {

  bio: string
  graduationYear: string

  @Input() user: any
  @Input() isConnection = false

  constructor() { }

  ngOnInit() {
    // Get user bio
    try {
      this.bio = this.user.customData.bio
    } catch (err) {
      try {
        this.bio = this.user.custom_data.bio
      } catch (error) {
        this.bio = ''
      }
    }

    // Get user graduation year
    try {
      this.graduationYear = this.user.customData.graduationYear
    } catch (err) {
      try {
        this.graduationYear = this.user.custom_data.graduationYear
      } catch (error) {
        this.graduationYear = ''
      }
    }
  }

  // TODO: Implement actual add connection functionality
  addConnection() {
    this.isConnection = true
  }

}
