import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
let golos = require('golos-js');

@Component({
  selector: 'vh-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent implements OnInit {
  login: string;
  password: string;

  constructor(
    public api: ApiService,
    public router: Router,
    public user: UserService
  ) { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'loginPage bg1';
  }

  submit() {
    let promises = [];
    //let userName = 'votehunter';// login
    //let privWif = '5JidAoVJn2ZBGPeHS66y5QS4tVvJJuMMqSCssUDi6kauSLScpku'; // private key
    let usernamesArr = [this.login];
    let pubKey = null;
    promises.push(new Promise((resolve) => {
      golos.api.getAccounts(usernamesArr, (err, response) => {
        console.log(response, err);
        if ( ! err) {
          let pubWif;
          let resultWifToPublic = golos.auth.wifToPublic(this.password, pubWif);
          if (response[0].posting.key_auths[0][0] == resultWifToPublic) {
            // for hackthone testing only save PK in localstorage
              localStorage.setItem("privKey", this.password);
            resolve(resultWifToPublic);
          }
          resolve(null);
        }
      })}));

    Promise.all(promises).then((pubKey) => {
      if (pubKey !== null) {
        this.api.login({
          golos_nick: this.login,
          golos_pub_key: pubKey[0]
        }).then((data) => {
          console.log(data);
          if(data.status == 'ok') {
            console.log('LOGGED', data.user_id);
            this.user.isLoggedIn = true;
            this.router.navigateByUrl('/profile');
          }
        })
      }
    });
  }


}
