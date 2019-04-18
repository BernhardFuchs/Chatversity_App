import { Component, OnInit, Input } from '@angular/core';

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

  }

  // TODO: Implement actual add connection functionality
  addConnection() {
    this.isConnection = true;
  }

}
