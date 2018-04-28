import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Resolve, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '../api.service';

@Injectable()
export class CreatorPageResolver implements Resolve<any> {
  constructor(
    public api: ApiService,
    public router: Router,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
      let profileUrl =  state.url;
      let tmp = state.url.match(/^\/([a-z0-9]+)/);
      if(tmp) {
          profileUrl = tmp[1];
      } else {
          this.router.navigate(['/']);
          return false;
      }
   return this.api.getProfileByUrl(profileUrl).then((data) => {
      return data;
    }, (data) => {
      this.router.navigate(['/']);
      return false;
    });
  }
}