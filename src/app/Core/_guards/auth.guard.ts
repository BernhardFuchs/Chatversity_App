import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          // User authorized so return true
          console.log('USER AUTHORIZED');
          return true;
        }

        console.log('USER NOT AUTHORIZED');

        // not logged in so redirect to login page via UrlTree
        const url = '/login';
        const tree: UrlTree = this.router.parseUrl(url);
        return tree;
    }
}
