import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {DOMService} from '../dom.service';
import {MediatorService} from '../mediator.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

@Component({
  selector: 'vh-requisites-page',
  templateUrl: './requisites-page.component.html',
  styleUrls: ['./requisites-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RequisitesPageComponent implements OnInit {
  login: string;
  password: string;

  constructor(public api: ApiService,
              public router: Router,
              public user: UserService,
              public domService: DOMService,
              public mediator: MediatorService
              ) {
  }

  ngOnInit() {
    if(this.user.isLoggedIn == true) {
      this.login = this.user.golos_nick;
    }
  }

  @HostBinding('class') get classStr() {
    return 'requisitesPage block';
  }

  error?: string;

  submit(event) {
    let wif = '';

      if (!golos.auth.isWif(this.password)) {
          wif = golos.auth.toWif(this.login, this.password, 'active');
      } else {
          wif = this.password;
      }

      golos.api.getAccounts([this.login], (err, response) => {
          if (err) {
              this.error = 'Unknown error, please try later.';
          } else {
              if(response.length > 0) {
                  let pubWif;
                  let resultWifToPublic;
                  try {
                      resultWifToPublic = golos.auth.wifToPublic(wif, pubWif);

                      if (response[0].active.key_auths[0][0] === resultWifToPublic) {
                          //console.log('login OK!');
                          let WifToPrivate = golos.auth.getPrivateKeys(this.login, this.password)
                          this.mediator.requisitesCallback(wif, this.login, WifToPrivate.posting);
                      }
                  } catch (err) {
                  }

                  this.error = 'Auth error';
              } else {
                  this.error = 'Username not found';
              }
          }
      })
  }

  onInputChange() {
    delete this.error;
  }

}
