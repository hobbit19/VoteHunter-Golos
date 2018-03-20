import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '../api.service';

@Injectable()
export class BecomePatronPageResolverService implements Resolve<any> {
  constructor(
    public api: ApiService,
    public router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    return this.api.getUserRewards({ user_id: route.params.id }).then((data) => {
      return data;
    }, () => {
      this.router.navigate(['/']);
      return false;
    });
  }
}