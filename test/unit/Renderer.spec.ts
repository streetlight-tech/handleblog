import { Renderer } from '../../src/index';

describe('Renderer', () => {
  it('should render template with content', async() => {
    const result = await Renderer.render('Handlebars <b>{{doesWhat}}</b> compiled!', { doesWhat: 'rocks!' });

    expect(result).toBe('Handlebars <b>rocks!</b> compiled!');
  });
});