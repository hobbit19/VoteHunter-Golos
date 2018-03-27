import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output,
  ViewEncapsulation
} from "@angular/core";
import {PanelComponent} from '../../kolos.dom/src/panel.component';

@Component({
  selector: 'vh-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent extends PanelComponent {
  @Input() className: string;
  @Input() title: string;
  @Output() openCallback: EventEmitter<void> = new EventEmitter<void>();

  isDismountingNeeded = true;

  constructor(public elementRef: ElementRef) {
    super(elementRef.nativeElement);
  }

  ngOnInit() {

  }

  @HostBinding('class') get classStr() {
    let cl = 'dropdown js-dropdown';

    if (this.className) {
      cl += ' ' + this.className;
    }

    if (this.isOpen()) {
      cl += ' dropdown-active';
    }

    return cl;
  }

  @HostListener("click") onClick() {
    this.toggle();
  }
}