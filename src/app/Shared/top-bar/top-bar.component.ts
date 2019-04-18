import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../Core/_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  @Input() viewName: string;
  @Input() headerText: string;

  returnUrl: string;

  constructor(private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.returnUrl = '/login';
  }

  // Logout user
  logOut() {
    this.auth.logout();
    this.router.navigate([this.returnUrl]);
  }

}
