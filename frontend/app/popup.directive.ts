import {ComponentFactoryResolver, Directive, Input, ViewContainerRef} from '@angular/core';
import {PopupComponent} from './popup/popup.component';
import {PopupsService} from './popups.service';

@Directive({
  selector: '[nv-popup]'
})
export class PopupDirective {
  @Input() config: any;

  constructor(
    public viewContainerRef: ViewContainerRef,
    public popups: PopupsService,
  ) {
  }

  componentRef: any;

  ngOnInit() {
    let componentFactory = this.popups.getFactoryResolver(this.config.data.name).resolveComponentFactory(this.config.component);

    this.viewContainerRef.clear();

    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    let instance = this.componentRef.instance as PopupComponent;

    Object.assign(instance, this.config.data);

    instance.config = this.config;
    this.config.instance = instance;
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}