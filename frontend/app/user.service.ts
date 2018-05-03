import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  isLoggedIn = false;
  golos_nick = '';
  profile_image = '/images/ava_placeholder.svg';
  id?: number;
  dataPromise: Promise<void>;
  loginRedirectionURL = '/dashboard';
  profile_url = '';

  constructor(
    public api: ApiService
  ) {
    this.dataPromise = this.api.user().then((data) => {
      this.isLoggedIn = data.status === 'ok';

      if (this.isLoggedIn) {
          this.golos_nick = data.golos_nick;
          this.profile_image = data.profile_image;
          this.profile_url = data.profile_url;
      } else {
          localStorage.clear();
      }
    }, (data) => {
      localStorage.clear();
    });
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
