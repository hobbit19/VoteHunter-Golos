import { Injectable } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";

@Injectable()
export class MediatorService {
  sidebar: SidebarComponent;
  requisitesCallback?: Function;

  constructor() { }

}
