import { ImageUploadsPage } from './app.po';

describe('image-uploads App', () => {
  let page: ImageUploadsPage;

  beforeEach(() => {
    page = new ImageUploadsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
