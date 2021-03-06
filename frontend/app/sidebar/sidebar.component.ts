import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { MediatorService } from "../mediator.service";
import { PanelComponent, PanelComponentStates } from "../../kolos.dom/src/panel.component";
import { StateService } from "../state.service";
import {UserService} from '../user.service';
import {DOMService} from '../dom.service';

@Component({
  selector: 'vh-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('state', [
      state(PanelComponentStates.Closed, style({
        transform: 'translate(100%, 0)'
      })),
      state(PanelComponentStates.Open, style({
        transform: 'translate(0, 0)'
      })),
      transition('closed => open', animate('250ms ease-in')),
      transition('open => closed', animate('250ms ease-out'))
    ])
  ]
})
export class SidebarComponent extends PanelComponent implements OnInit {
  constructor(
    public mediator: MediatorService,
    public elementRef: ElementRef,
    public user: UserService,
    public DOMService: DOMService
  ) {
    super(elementRef.nativeElement);

    mediator.sidebar = this;
  }

  ngOnInit() {
  }
}
