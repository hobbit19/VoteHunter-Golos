import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {DOMService} from '../dom.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

let steem = require('steem');
steem.config.set('websocket','wss://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');


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
        let pubKey = null;

        promises.push(new Promise((resolve, reject) => {
            //this.golosLogin(resolve, reject);
            this.steemLogin(resolve, reject);
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

    steemLogin(resolve, reject)
    {
        let wif = '';
        if (!steem.auth.isWif(this.password)) {
            wif = steem.auth.toWif(this.login, this.password, 'posting');
        } else {
            wif = this.password;
        }
        steem.api.getAccounts([this.login], (err, response) => {
            if (err) {
                //console.log('Unknown error, please try later.');
                reject();
            } else {
                if (response.length > 0) {
                    let pubWif;
                    let resultWifToPublic;

                    try {
                        resultWifToPublic = steem.auth.wifToPublic(wif, pubWif);
                    } catch (err) {
                        reject();
                    }

                    if (response[0].posting.key_auths[0][0] === resultWifToPublic) {
                        localStorage.setItem('password', this.password);
                        localStorage.setItem('nick', this.login);
                        if(this.password != wif) {
                            localStorage.setItem('wif', wif);
                        }
                        /*
                                                    let time_now  = (new Date()).getTime();
                                                    localStorage.setItem('stored', time_now.toString());
                        */
                        resolve(resultWifToPublic);
                    }
                } else {
                    console.log('Username not found');
                }
                resolve(null);
            }
        })
    }
    golosLogin(resolve, reject)
    {
        let wif = '';
        if (!golos.auth.isWif(this.password)) {
            wif = golos.auth.toWif(this.login, this.password, 'posting');
        } else {
            wif = this.password;
        }
        golos.api.getAccounts([this.login], (err, response) => {
            if (err) {
                //console.log('Unknown error, please try later.');
                reject();
            } else {
                if (response.length > 0) {
                    let pubWif;
                    let resultWifToPublic;

                    try {
                        resultWifToPublic = golos.auth.wifToPublic(wif, pubWif);
                    } catch (err) {
                        reject();
                    }

                    if (response[0].posting.key_auths[0][0] === resultWifToPublic) {
                        localStorage.setItem('password', this.password);
                        localStorage.setItem('nick', this.login);
                        if(this.password != wif) {
                            localStorage.setItem('wif', wif);
                        }
                        /*
                                                    let time_now  = (new Date()).getTime();
                                                    localStorage.setItem('stored', time_now.toString());
                        */
                        resolve(resultWifToPublic);
                    }
                } else {
                    console.log('Username not found');
                }
                resolve(null);
            }
        })
    }
}


