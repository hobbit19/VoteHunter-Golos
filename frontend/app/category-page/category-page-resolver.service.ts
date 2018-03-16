import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '../api.service';

@Injectable()
export class CategoryPageResolverService implements Resolve<any> {
  constructor(
    public api: ApiService,
    public router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    this.api.getCategory(route.params.id).then((data) => {
      console.log(data);
    });

    return true;
  }
}