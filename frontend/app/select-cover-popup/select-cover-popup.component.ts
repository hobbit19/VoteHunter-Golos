import { Component, OnInit } from '@angular/core';
import {PopupComponent} from '../popup/popup.component';

@Component({
  selector: 'vh-select-cover-popup',
  templateUrl: './select-cover-popup.component.html',
  styleUrls: ['./select-cover-popup.component.less']
})
export class SelectCoverPopupComponent extends PopupComponent implements OnInit {
    public covers: any;

    ngOnInit() {
      super.ngOnInit();
      this.covers = [];
      for(let i=1; i<=30; i++) {
          this.covers.push({url: '/covers/th_400_'+i+'.jpg', num: i});
      }
    }

}

