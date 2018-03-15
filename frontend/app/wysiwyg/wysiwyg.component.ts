import {Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'vh-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WysiwygComponent {
  @Output() onContentChanged: EventEmitter<any> = new EventEmitter();

  @Input() ops: string;

  constructor(public elementRef: ElementRef) { }

  quillEditor: any;

  ngAfterViewInit() {
    require.ensure([], () => {
      let Quill = require('quill/dist/quill.min.js');
      let elem = this.elementRef.nativeElement.querySelector('.js-wysiwyg__container');

      this.quillEditor = new Quill(elem, {
        modules: { toolbar: true },
        theme: 'snow'
      });

      this.quillEditor.on(
        'text-change',
        (delta: any, oldDelta: any, source: string) => {
          this.onContentChanged.emit({
            editor: this.quillEditor,
            html: elem.children[0].innerHTML,
            contents: this.quillEditor.getContents(),
            delta: delta,
            oldDelta: oldDelta,
            source: source
          });
        }
      );

      if (this.ops) {
        this.quillEditor.setContents(this.ops);
      }
    });
  }

  @HostBinding('class') get classStr() {
    return 'wysiwyg';
  }
}
