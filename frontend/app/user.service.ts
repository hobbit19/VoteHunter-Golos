import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  isLoggedIn = false;
  golos_nick = '';

  constructor(
    public api: ApiService
  ) {
    this.api.user().then((data) => {
      this.isLoggedIn = data.status === 'ok';
      if (this.isLoggedIn) {
          this.golos_nick = data.golos_nick;
      }
    }, (data) => {});
  }
}
