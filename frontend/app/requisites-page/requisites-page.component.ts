import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {DOMService} from '../dom.service';
import {MediatorService} from '../mediator.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');


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

      if (!steem.auth.isWif(this.password)) {
          wif = steem.auth.toWif(this.login, this.password, 'active');
      } else {
          wif = this.password;
      }

      let promise = new Promise((resolve) => {
          steem.api.getAccounts([this.login], (err, response) => {
          if (err) {
              this.error = 'Unknown error, please try later.';
          } else {
              if(response.length > 0) {
                  let pubWif;
                  let resultWifToPublic;
                  try {
                      resultWifToPublic = steem.auth.wifToPublic(wif);

                      if (response[0].active.key_auths[0][0] === resultWifToPublic) {
                          let WifToPrivate = steem.auth.getPrivateKeys(this.login, this.password)
                          this.mediator.requisitesCallback(wif, this.login, WifToPrivate.posting, resolve);
                          return true;
                      }
                  } catch (err) {
                  }

                  this.error = 'Auth error';
              } else {
                  this.error = 'Username not found';
              }
          }
      })});
      this.domService.onFormSubmit(event.target, promise);
  }

  onInputChange() {
    delete this.error;
  }

}
