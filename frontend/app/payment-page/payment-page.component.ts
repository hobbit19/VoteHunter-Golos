import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { UserService } from "../user.service";
let golos = require('golos-js');

@Component({
  selector: 'vh-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentPageComponent implements OnInit {
  key: string;
  login: string;
  id: string;

  constructor(
    public activatedRoute: ActivatedRoute,
    public api: ApiService,
    public user: UserService,
    public router: Router
    ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.id;
    });
  }

  submit() {
      let promises = [];
      let usernamesArr = [this.login];
      let pubKey = null;
      promises.push(new Promise((resolve) => {
          golos.api.getAccounts(usernamesArr, (err, response) => {
              console.log(response, err);
              if ( ! err) {
                  let pubWif;
                  let resultWifToPublic = golos.auth.wifToPublic(this.key, pubWif);
                  if (typeof response[0] != 'undefined'response[0] && response[0].posting.key_auths[0][0] == resultWifToPublic) {
                      //for hackthone testing only save PK in localstorage
                      localStorage.setItem("privKey", this.key);
                      resolve(resultWifToPublic);
                  }
                  resolve(null);
              }
          })}));

      Promise.all(promises).then((pubKey) => {
          if(pubKey !== null) {
              this.api.login({
                  golos_nick: this.login,
                  golos_pub_key: pubKey[0]
              }).then((data) => {
                  console.log(data);
                  if(data.status == 'ok') {
                      this.api.postPay(
                          {
                              post_id: this.id,
                              active_wif: this.key,
                          }
                      ).then((data) => {
                            if(data.status == 'ok') {
                                this.router.navigateByUrl('/post?a=' + data.author + '&p=' + data.permlink);
                            }
                      });

                      // console.log('LOGGED', data.user_id);
                      // this.user.isLoggedIn = true;
                      // this.router.navigateByUrl('/profile');
                  }
              })
          } else {
              console.log('Not Logged');
          }
      });
    console.log({
      id: this.id,
      key: this.key
    });
  }

  @HostBinding('class') get classStr() {
    return 'paymentPage bg1';
  }

}
