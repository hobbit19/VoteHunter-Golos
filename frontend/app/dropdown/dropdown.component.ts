import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: 'vh-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {
  @Input() className: string;
  @Input() disabled: boolean = false;
  @Input() title: string;
  @Output() openCallback: EventEmitter<void> = new EventEmitter<void>();

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    (this.elementRef.nativeElement as any).nvDropdown = this;
  }

  @HostBinding('class') get classStr() {
    let cl = 'dropdown js-dropdown';

    if (this.className) {
      cl += ' ' + this.className;
    }

    if (this.disabled) {
      cl += ' dropdown-disabled';
    }

    if (this.active) {
      cl += ' dropdown-active';
    }

    return cl;
  }

  @HostBinding('attr.nv-panel') nvPanelAttr = 'dropdown';

  active = false;

  @HostListener("click") onClick() {
    if (this.active) { return; }

    this.active = true;

    let onClick = () => {
      this.active = false;

      document.removeEventListener('click', onClick);
    };

    setTimeout(() => {
      document.addEventListener('click', onClick);
    }, 0);
  }
}
