import { Component, OnInit } from '@angular/core';
import { View } from '../../Core/_models/view';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-view-navigation-home',
  templateUrl: './view-navigation-home.component.html',
  styleUrls: ['./view-navigation-home.component.css']
})
export class ViewNavigationHomeComponent implements OnInit {
  HomeView:View = { id: 1, name: 'Home', current: false }
  FriendsView:View = { id: 2, name: 'Friends', current: false }
  ProfileView:View = { id: 3, name: 'Profile', current: false }

  views:View[] = [this.HomeView, this.FriendsView, this.ProfileView];

  headerText:string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.HomeView.current = true;
    this.headerText = "Latest News";

    // [routerLink]="['/home']" [queryParams]="{view:'param'}"
    this.activatedRoute.queryParams.subscribe(params => {
      let view = params['view'];
      console.log(view);
  
      this.handleViewParam(view);
    });
  }

  // Display home view
  showHomeView(){
    this.showPage(this.HomeView.id);
  }

  // Display friends view
  showFriendsView(){
    this.showPage(this.FriendsView.id);
  }

  // Display profile view
  showProfileView(){
    this.showPage(this.ProfileView.id);
  }

  // Display view by id
  showPage(_id:number){
    this.hideAllViews();
    switch(_id){
      case 2:
        this.FriendsView.current = true;
        this.headerText = "Friends";
        break;
      case 3:
        this.ProfileView.current = true;
        this.headerText = "Profile";
        break;
      default:
        this.HomeView.current = true;
        this.headerText = "Latest News";
        break;
    }  
  }

  // Hide all home views
  hideAllViews(){
    this.views.forEach(function(view){
      view.current = false;
    })
  }

  // Display views based on url param
  handleViewParam(param:string){
    switch(param){
      case "profile":
        this.showProfileView();
        break;
      case "friends":
        this.showFriendsView();
        break;
      default:
        this.showHomeView();
        break;
    }
  }
}
