import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, ElementRef, HostBinding, Renderer2} from '@angular/core';
import {Listener} from '../../kolos.dom/src/listener';
import {PopupsService} from '../popups.service';
import {DOMService} from '../dom.service';

require('style-loader!./popup.component.less');

const animationDuration = 150; // equal to @popupsAnimationDuration in popups.less

@Component({
  selector: 'popup',
  template: ''
})
export class PopupComponent {
  static key: string;


  i18n = window['i18n'];

  error: string;
  closeable = true;
  data?: any;
  $node: JQuery;
  $wrap: JQuery;
  popups: PopupsService;
  subscription: any;
  config: any;
  isFull?: boolean;

  constructor(public router: Router,
              public elementRef: ElementRef,
              public changeDetectorRef: ChangeDetectorRef,
              public DOM: DOMService,
              public renderer: Renderer2) {

  }

  self() {
    return this;
  }

  onHideBeforeAnimationCallback?();

  validSubmit?(e?: any, formController?: any);

  callbackAfterAnimation?();

  withoutBg: boolean;
  withoutAnimation: boolean;
  horizontalScrolling?: boolean;
  preventClosingByWrapClick?: boolean;
  name: string;

  className?: string;

  hideCallback?();

  animationDuration: number;

  callback?();

  onClick(e) {
    let $target = $(e.target);

    if (($target.is(this.$wrap) && !this.preventClosingByWrapClick) || ($target.closest('.js-wrapPopup').is(this.$wrap) && $target.hasClass('js-popup__close'))) {
      this.hide({e: e});
    }
  }

  getClass(cl = '') {
    cl += ` ${this.name}Up`;

    if (this.className) {
      cl += ' ' + this.className;
    }

    return cl;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getWrapClass(cl = '') {
    return cl;
  }

  isDocumentWidthChanged: boolean;

  prevScrolling?: number;
  prevTop?: number;
  private _escapeListener?: Listener;

  ngOnInit() {
    this.subscription = this.popups.hidePopup.subscribe(this.onHidePopupEvent.bind(this));

    let horizontalScrolling = typeof this.horizontalScrolling !== 'undefined' ? this.horizontalScrolling : true;
    let $wrap = $(this.elementRef.nativeElement).find('.js-wrapPopup');

    this.$wrap = $wrap;
    this.$node = $wrap.find('.js-popup');

    if (this.popups.list.length === 1) {
      // https://stackoverflow.com/a/34754029/5385623
      if (this.DOM.IS_IOS) {
        this.prevScrolling = $('html').scrollTop();

        this.prevTop = parseFloat($('body').css('top'));

        document.body.style.top = -this.prevScrolling + 'px';
      }
    }

    this.renderer.addClass(document.documentElement, 'html-popupActive');

    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      this.renderer.setStyle(document.documentElement, 'width', `calc(100% - ${this.DOM.getScrollbarWidth()}px)`);

      this.isDocumentWidthChanged = true;
    }

    this._escapeListener = this.DOM.listen(document.documentElement, 'keyup', this.hide.bind(this), {
      keyCode: this.DOM.KEYCODES.ESCAPE,
      queued: true
    });

    if (this.isFull) {
      $wrap.addClass('wrapPopup-full');
    }

    setTimeout(() => {
      $wrap.addClass('wrapPopup-active');

      if (!horizontalScrolling) {
        $wrap.addClass('wrapPopup-withoutScrolling');
      }

      if (this.withoutBg) {
        $wrap.addClass('wrapPopup-withoutBg');
      }

      if (this.withoutAnimation) {
        $wrap.addClass('wrapPopup-withoutAnimation');
      }

      if (this.callback) {
        this.callback();
      }

      if (this.callbackAfterAnimation) {
        setTimeout(() => {
          this.callbackAfterAnimation();
        }, this.animationDuration);
      }

      if (!this.closeable) {
        $wrap.addClass('wrapPopup-nonCloseable');
      }
    }, 0);
  }

  onHidePopupEvent(event) {
    if (this.name === event.name) {
      this.hide(event.params);
    }
  }

  @HostBinding('class') get classStr() {
    return 'popupComponent';
  }

  hide(params: { e?: any, force?: boolean } = {}) {
    if (!this.closeable && !params.force) {
      return;
    }

    this._escapeListener.unbind();

    this.$wrap.removeClass('wrapPopup-active');

    if (this.onHideBeforeAnimationCallback) {
      this.onHideBeforeAnimationCallback();
    }

    if (this.popups.list.length > 1) {
      this.popups.list[this.popups.list.length - 2].instance.$wrap.removeClass('wrapPopup-hidden');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.popups.list.length === 1) {
          this.renderer.removeClass(document.documentElement, 'html-popupActive');

          if (this.DOM.IS_IOS) {
            document.body.style.top = this.prevTop ? this.prevTop + 'px' : '';

            $('html').scrollTop(this.prevScrolling);
          }

          if (this.isDocumentWidthChanged) {
            this.renderer.removeStyle(document.documentElement, 'width');
          }
        }

        if (this.hideCallback) {
          this.hideCallback();
        }

        for (let i = this.popups.list.length - 1; i >= 0; i--) {
          let config = this.popups.list[i];

          if (config === this.config) {
            this.popups.list.splice(i, 1);
          }
        }

        resolve();
      }, this.withoutAnimation ? 0 : animationDuration);
    });
  }
}