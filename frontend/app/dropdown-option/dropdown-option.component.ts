//import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'vh-dropdown-option',
  template: `
		<ng-content></ng-content>
	`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownOptionComponent {
  @HostBinding('class') get className() {
    return 'dropdown__option';
  }
}
