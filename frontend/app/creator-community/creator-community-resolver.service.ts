import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Resolve, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '../api.service';

@Injectable()
export class CreatorCommunityResolver implements Resolve<any> {
    constructor(
        public api: ApiService,
        public router: Router,
    ) {
    }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.api.getProfileByUrl(route.params['author']).then((data) => {
            return data;
        }, (data) => {
            this.router.navigate(['/']);
            return false;
        });
    }
}