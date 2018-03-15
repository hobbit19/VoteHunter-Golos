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
   return this.api.getProfileByUrl(state.url.replace('/', '')).then((data) => {
      return data.profile;
    }, (data) => {
      this.router.navigate(['/']);
      return false;
    });
  }
}