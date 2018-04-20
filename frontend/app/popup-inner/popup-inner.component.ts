import {Component, Input, OnInit} from '@angular/core';
import {PopupComponent} from '../popup/popup.component';

@Component({
  selector: 'vh-popup-inner',
  templateUrl: './popup-inner.component.html',
  styleUrls: ['./popup-inner.component.less']
})
export class PopupInnerComponent implements OnInit {
  @Input() popup: PopupComponent;

  constructor() { }

  ngOnInit() {
  }

}
