import { browser, by, element } from 'protractor';

export class VoteHunterPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('vh-root h1')).getText();
  }
}
