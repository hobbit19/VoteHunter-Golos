import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  isLoggedIn = false;
  golos_nick = '';
  id?: number;
  dataPromise: Promise<void>;
  loginRedirectionURL = '/dashboard';

  constructor(
    public api: ApiService
  ) {
    this.dataPromise = this.api.user().then((data) => {
      this.isLoggedIn = data.status === 'ok';

      if (this.isLoggedIn) {
          this.golos_nick = data.golos_nick;
      }
    }, (data) => {});
  }

  isLoggedInPromise() {
    return this.dataPromise.then(() => {
      return this.isLoggedIn;
    });
  }

  logout() {
    localStorage.clear();

    location.href = '/user/logout/';
  }
}
