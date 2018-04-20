import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output,
  ViewEncapsulation
} from "@angular/core";
import {PanelComponent} from '../../kolos.dom/src/panel.component';
import {DOMService} from '../dom.service';

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

  get isDismountingNeeded() {
    return true;
  }

  constructor(public elementRef: ElementRef, public DOMService: DOMService) {
    super(elementRef.nativeElement);
  }

  ngOnInit() {

  }

  getHeight(withOverflowingPart?) {
    let height = super.getHeight();

    if (withOverflowingPart) {
      height += (this.node.querySelector('.js-dropdown__content') as HTMLElement).offsetHeight;
    }

    return height;
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