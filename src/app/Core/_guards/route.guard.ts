import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class RouteGuard implements CanActivate {
  returnUrl: string;
  tree: UrlTree;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authService.userLoggedIn();

        if (currentUser) {
          // User is authorized
          if (state.url === '/login' || state.url === '/signup' || state.url === '/forgot') {
            this.returnUrl = '/home'
            this.tree = this.router.parseUrl(this.returnUrl)
            return this.tree
           }
          return true
        }
        return true
      }
}
