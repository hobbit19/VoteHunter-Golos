import { Injectable } from '@angular/core';
import { DOMService as DS } from "../kolos.dom/src/dom.service";

const BUTTON_FINISH_TRANSITION_DURATION = 1000; // equal to @buttonFinishTransitionDuration

@Injectable()
export class DOMService extends DS {

  constructor() {
    super();
  }

  onFormSubmit(form: HTMLElement, promise: Promise<any>) {
    let button = form.querySelector('button[type=submit]') || form.querySelector('button:not([type])');

    button.classList.add('button-progress');

    function onSuccess() {
      button.classList.add('button-finish');
      button.classList.add('button-sccss');

      final();
    }

    function onFail() {
      button.classList.add('button-finish');
      button.classList.add('button-fail');

      final();
    }

    function final() {
      setTimeout(function () {
        button.classList.remove('button-sccss');
        button.classList.remove('button-fail');

        setTimeout(function () {
          button.classList.remove('button-finish');

          button.classList.remove('noEvents');
        }, BUTTON_FINISH_TRANSITION_DURATION);
      }, 1500);

      button.classList.remove("button-progress");
    }

    promise.then(function (isFail) {
      if (isFail === true) {
        onFail();
      } else {
        onSuccess();
      }
    });

    promise.catch(onFail);
  }

}
