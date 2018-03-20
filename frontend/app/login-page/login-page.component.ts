import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {DOMService} from '../dom.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

@Component({
  selector: 'vh-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPageComponent implements OnInit {
  login: string;
  password: string;

  constructor(public api: ApiService,
              public router: Router,
              public user: UserService,
              public domService: DOMService) {
  }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'loginPage block';
  }

  submit(event) {
    let promises = [];
    let usernamesArr = [this.login];
    let pubKey = null;

    promises.push(new Promise((resolve, reject) => {
      golos.api.getAccounts(usernamesArr, (err, response) => {
        if (err) {
          reject();
        } else {
          let pubWif;
          let resultWifToPublic;

          try {
            resultWifToPublic = golos.auth.wifToPublic(this.password, pubWif);
          } catch (err) {
            reject();
          }

          if (response[0].posting.key_auths[0][0] === resultWifToPublic) {
            // for hackathon testing only save PK in localstorage
            localStorage.setItem('privKey', this.password);
            resolve(resultWifToPublic);
          }
          resolve(null);
        }
      })
    }));

    this.domService.onFormSubmit(event.target, new Promise((resolve, reject) => {
      Promise.all(promises).then((pubKey) => {
        if (pubKey === null) {
          reject();
        } else {
          this.api.login({
            golos_nick: this.login,
            golos_pub_key: pubKey[0]
          }).then((data) => {
            if (data.status == 'ok') {
              this.user.isLoggedIn = true;

              resolve();

              this.router.navigateByUrl(this.user.loginRedirectionURL);
            } else {
              reject();
            }
          }, reject);
        }
      }, reject);
    }));
  }
}


