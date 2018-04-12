import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Resolve, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ApiService} from '../api.service';

@Injectable()
export class PostPageResolver implements Resolve<any> {
    constructor(
        public api: ApiService,
        public router: Router,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean>|Promise<boolean>|boolean {
        return this.api.isPostExists(route.params).then((data) => {
            return data;
        }, (data) => {
            this.router.navigate(['/']);
            return false;
        });
    }
}