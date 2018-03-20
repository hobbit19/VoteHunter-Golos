import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediatorService} from '../mediator.service';
import {ApiService} from '../api.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

@Component({
  selector: 'vh-become-patron-page',
  templateUrl: './become-patron-page.component.html',
  styleUrls: ['./become-patron-page.component.less']
})
export class BecomePatronPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mediator: MediatorService,
    public api: ApiService
    ) { }

  rewards: any;

  ngOnInit() {
    this.rewards = this.route.snapshot.data.rewards;
  }

  submit(reward) {
    this.mediator.requisitesCallback = (wif, login) => {
        golos.broadcast.transfer(wif, login, reward.nick , reward.golos, login + ' is now patron for ' +reward.nick, function (err, result) {
            if(err) {
                alert('Cannot make transfer, please check username or password/active key');
            }
            if(result) {
                let data = {
                    op_data: reward,
                    user_from: login,
                }
                this.api.setAsPatron(data).then(
                    (data)=>{

                    },
                    (data) => {

                    });
                console.log(result);
            }
        });

    };

    this.router.navigateByUrl('requisites');
  }

}
