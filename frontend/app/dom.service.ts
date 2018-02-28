import { Injectable } from '@angular/core';
import { DOMService as DS } from "../kolos.dom/src/dom.service"

@Injectable()
export class DOMService extends DS {

  constructor() {
    super();
  }

}
