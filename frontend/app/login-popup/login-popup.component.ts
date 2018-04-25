import {Component, OnInit} from '@angular/core';
import {PopupComponent} from '../popup/popup.component';

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');


@Component({
    selector: 'vh-login-popup',
    templateUrl: './login-popup.component.html',
    styleUrls: ['./login-popup.component.less', '../login-page/login-page.component.less']
})
export class LoginPopupComponent extends PopupComponent implements OnInit {
    login: string;
    password: string;

    ngOnInit() {

    }

    submit(event) {
        let promises = [];
        let pubKey = null;

        promises.push(new Promise((resolve, reject) => {
            this.steemLogin(resolve, reject);
        }));

        this.DOM.onFormSubmit(event.target, new Promise((resolve, reject) => {
            Promise.all(promises).then((pubKey) => {

                if (pubKey[0] === null) {
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

    steemLogin(resolve, reject) {
        //console.log(steem.auth.verify(this.login, this.password))
        let wif = '';
        if (!steem.auth.isWif(this.password)) {
            wif = steem.auth.getPrivateKeys(this.login, this.password, ['posting']).posting;
        } else {
            wif = this.password;
        }
        steem.api.getAccounts([this.login], (err, response) => {
            if (err) {
                //console.log('Unknown error, please try later.');
                reject();
            } else {
                if (response.length > 0) {
                    /*
                                        let resultWifToPublic;
                                        try {
                                            resultWifToPublic = steem.auth.wifToPublic(wif);
                                        } catch (err) {
                                            reject();
                                        }
                    */
                    let pubWif = response[0].posting.key_auths[0][0];
                    let isvalid;
                    try {
                        isvalid = steem.auth.wifIsValid(wif, pubWif);
                    } catch (e) {
                        isvalid = false;
                    }
                    if (isvalid) {
                        localStorage.setItem('password', this.password);
                        localStorage.setItem('nick', this.login);
                        if (this.password != wif) {
                            localStorage.setItem('wif', wif);
                        }
                        resolve(pubWif);
                    }
                } else {
                    //console.log('Username not found');
                    resolve(null);
                }
                resolve(null);
            }
        })
    }

}
