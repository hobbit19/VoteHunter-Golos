import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { MediatorService } from "./mediator.service";

@Injectable()
export class StateService {
  routeName: string;
  navigationEnd: Observable<any>;
  renderer: Renderer2;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public mediator: MediatorService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.navigationEnd = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data);

    this.navigationEnd.subscribe((event) => {
      this.renderer.removeClass(document.documentElement, 'html-route-' + this.routeName);

      this.routeName = event.name;

      this.renderer.addClass(document.documentElement, 'html-route-' + this.routeName);

      if (this.mediator.sidebar) {
        this.mediator.sidebar.close();
      }
    });
  }

}
