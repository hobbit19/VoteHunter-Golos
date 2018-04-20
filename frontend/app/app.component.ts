import { Component, Renderer2, ViewEncapsulation } from '@angular/core';
import { StateService } from "./state.service";
import { DOMService } from "./dom.service";
import {PopupsService} from './popups.service';
let golos = require('golos-js');

//tests

/*let usernamesArr = ['roman.sitrota'];
golos.api.getAccounts(usernamesArr, function(err, response) {
    if ( ! err) {
        let pubWif;
        let privWif = '5KkZmMC9JN2Vsps4b3Vs8HWscKMTWbMK75E51RisEbSeeHzH2Tz'; // private key
        let resultWifToPublic = golos.auth.wifToPublic(privWif, pubWif);
        // example check of privete posting key
        if (response[0].posting.key_auths[0][0] == resultWifToPublic) console.log('yes, is it private posting key!');
        else console.log('no, is it not private posting key!');
    }
});*/

//по паблик кею получаем username
/*
var publicKeys = ['GLS6Z8RkcijWnWfkf5uCnp94fpANRxtrX61T9VDSBRct2r5fZuYXj'];
golos.api.getKeyReferences(publicKeys, function(err, result) {
    //console.log(err, result);
    if (!err) {
        result.forEach(function(item) {
            console.log('getKeyReferences', 'username: [', item[0], ']');
        });
    }
    else console.error(err);
});
*/


// golos.api.getAccounts(['roman-sitrota'], function(err, result) {
//     console.log(err, result);
// });


//golos.api.getAccountHistory('roman-sitrota', from, limit, function(err, result) {
//    console.log(err, result);
//});

/**
 * comment() add a post
 * @param {Base58} wif - private posting key
 * @param {String} parentAuthor - for add a post, empty field
 * @param {String} parentPermlink - main tag
 * @param {String} author - author of the post
 * @param {String} permlink - url-address of the post
 * @param {String} title - header of the post
 * @param {String} body - text of the post
 * @param {String} jsonMetadata - meta-data of the post (images etc.)
 */
/*let wif = '5KkZmMC9JN2Vsps4b3Vs8HWscKMTWbMK75E51RisEbSeeHzH2Tz';
let parentAuthor = '';
let parentPermlink = 'hakaton';
let author = 'roman-sitrota';
let permlink = 'test-post-12345';
let title = 'Приверка';
let body = 'Проверка связи';
let jsonMetadata = JSON.stringify({tags: ['test', 'post', 'тест']});
golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
    console.log('ПОСТ!!!!');
    if (!err) {
        console.log('comment', result);
    }
    else console.error(err);
});*/


//



@Component({
  selector: 'vh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(
    public state: StateService,
    public domService: DOMService,
    public popups: PopupsService
  ) {
    if (domService.IS_IOS) {
      document.documentElement.classList.add('ios');
    }

    /*setTimeout(() => {
      this.popups.show('test');
    }, 2000);*/
  }
}
