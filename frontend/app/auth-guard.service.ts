import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public user: UserService,
    public router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.user.isLoggedInPromise().then((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        this.user.loginRedirectionURL = state.url;
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}