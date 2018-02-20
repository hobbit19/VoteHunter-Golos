import { VoteHunterPage } from './app.po';

describe('vote-hunter App', () => {
  let page: VoteHunterPage;

  beforeEach(() => {
    page = new VoteHunterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to vh!!');
  });
});
