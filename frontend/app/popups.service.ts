import {ComponentFactoryResolver, EventEmitter, Injectable, Output} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {PopupComponent} from './popup/popup.component';


@Injectable()
export class PopupsService {
  @Output() hidePopup = new EventEmitter();

  list: {
    component: typeof PopupComponent,
    instance: PopupComponent,
    data: any,
  }[] = [];

  configs: any = new Map();

  constructor(
    public router: Router,
    public http: HttpClient,
    public componentFactoryResolver: ComponentFactoryResolver,
  ) {

    PopupComponent.prototype.popups = this;
  }

  declareModule(module, popups) {
    this.configs.set(module, popups);
  }

  hideAll(params = {}) {
    this.list.forEach(() => {
      this.hideCurrent(params);
    });
  }

  hideCurrent(params = {}) {
    let config = this.list[this.list.length - 1];

    if (config) {
      this.hidePopup.emit({
        name: config.data.name,
        params: params
      });
    }
  }

  getFactoryResolver(name) {
    let factoryResolver;

    for (let module of Array.from(this.configs)) {
      for (let key in module[1]) {
        if (key === name) {
          factoryResolver = module[0].componentFactoryResolver || this.componentFactoryResolver;
        }
      }
    }

    return factoryResolver;
  }

  getConfig(name) {
    let result;

    for (let popups of Array.from(this.configs.values())) {
      for (let key in popups) {
        if (key === name) {
          result = popups[key];
        }
      }
    }

    return result;
  }

  show(param) {
    let data: any;

    if (typeof param === 'string') {
      data = {
        name: param
      };
    } else {
      data = param;
    }

    let config = this.getConfig(data.name);

    config.data = data;

    if (this.list.length) {
      this.list.forEach((item, index) => {
        item.instance.$wrap.addClass('wrapPopup-hidden');
      });
    }

    this.list.push(config);
  }

  get(name): PopupComponent {
    return this.list.find((item) => item.data.name === name).instance;
  }

  getData(name: string) {
    return this.get(name).data;
  }
}

