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

  constructor(public elementRef: ElementRef) {
  }

  quillEditor: any;

  ngAfterViewInit() {
    require.ensure([], () => {
      let Quill = require('quill/dist/quill.min.js');
      let elem = this.elementRef.nativeElement.querySelector('.js-wysiwyg__container');
      let toolbarOptions = [
        ['bold', 'italic', 'underline'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'list': 'ordered'}, {'list': 'bullet'}],
//            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
//            [{ 'direction': 'rtl' }],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
//            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        //          [{ 'font': [] }],
        [{'align': []}],

        ['clean']                                         // remove formatting button
      ];
      this.quillEditor = new Quill(elem, {
        modules: {toolbar: toolbarOptions},
        theme: 'snow'
      });

      this.quillEditor.on('text-change', (delta: any, oldDelta: any, source: string) => {
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
