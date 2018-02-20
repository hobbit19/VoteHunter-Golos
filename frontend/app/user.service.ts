import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  isLoggedIn = false;

  constructor(
    public api: ApiService
  ) {
    this.api.user().then((data) => {
      this.isLoggedIn = data.status === 'ok';
    });
  }
}