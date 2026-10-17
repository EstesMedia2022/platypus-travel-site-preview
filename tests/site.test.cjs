const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync, existsSync} = require('node:fs');
const {join} = require('node:path');
const vm = require('node:vm');
const root = join(__dirname, '..');
const source = readFileSync(join(root, 'app.js'), 'utf8');

function site(pathname, height = 900) {
  const element = () => ({innerHTML: '', textContent: '', addEventListener() {},
    classList: {add() {}, remove() {}}, setAttribute(name, value) {this[name] = value;}});
  const elements = new Map();
  const byId = id => {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  };
  const image = {...element(), clientWidth: 600, setPointerCapture() {}, hasPointerCapture() {return false;}};
  const position = element();
  const forms = ['packed', 'inflated'].map(form => ({...element(), dataset: {form}, 'aria-pressed': String(form === 'inflated')}));
  const arrows = [-1, 1].map(turn => ({...element(), dataset: {turn}}));
  const panel = {
    querySelector: selector => selector === '.spin-image' ? image : position,
    querySelectorAll: selector => selector === '[data-form]' ? forms : arrows,
    getBoundingClientRect: () => ({top: 100, bottom: 600, height: 500})
  };
  let scroll;
  const window = {scrollY: 0, addEventListener(name, callback) {if (name === 'scroll') scroll = callback;}};
  const motion = {matches: false};
  vm.runInNewContext(source, {
    location: {pathname}, window, innerHeight: height,
    document: {getElementById: byId, querySelector: () => element(),
      querySelectorAll: () => pathname.endsWith('about.html') ? [] : [panel]},
    sessionStorage: {getItem() {return null;}},
    Image: class {}, IntersectionObserver: class {observe() {}},
    requestAnimationFrame: callback => callback(), matchMedia: () => motion
  });
  return {html: byId('app').innerHTML, image, position, forms, arrows, motion,
    scrollBy(delta) {window.scrollY += delta; scroll();}};
}

test('all entry pages render their content and resolve local navigation links', () => {
  for (const [file, heading] of [['index.html', 'One pillow.'], ['product.html', 'Platypus Cloud'], ['about.html', 'A little more comfort.']]) {
    const entry = readFileSync(join(root, file), 'utf8');
    assert.match(entry, /<script src="app.js" defer>/);
    const {html} = site(`/platypus-travel-site-preview/${file}`);
    assert.ok(html.includes(heading), `${file} renders the correct page`);
    assert.ok(html.includes('href="product.html"'), `${file} links to the product page`);
    for (const [, href] of html.matchAll(/href="([^"#]+)"/g)) {
      if (!/^https?:/.test(href)) assert.ok(existsSync(join(root, href.split('#')[0])), `${file}: ${href} exists`);
    }
  }
});

for (const height of [844, 900]) {
  for (const page of ['index.html', 'product.html']) {
    test(`${page} at height ${height}: scrolling preserves either selected form and spins its frames`, () => {
      const viewer = site(`/platypus-travel-site-preview/${page}`, height);
      for (const button of viewer.forms) {
        button.onclick();
        const before = viewer.image.src;
        viewer.scrollBy(150);
        assert.notEqual(viewer.image.src, before);
        assert.ok(viewer.image.src.startsWith(`assets/${button.dataset.form}/`));
        assert.equal(button['aria-pressed'], 'true');
        viewer.scrollBy(-100);
        assert.ok(viewer.image.src.startsWith(`assets/${button.dataset.form}/`));
        assert.equal(button['aria-pressed'], 'true');
        assert.ok(existsSync(join(root, viewer.image.src)));
      }
    });
  }
}

test('arrows, keyboard and dragging rotate the selected neck pillow; reduced motion suppresses scroll spin', () => {
  const viewer = site('/index.html');
  viewer.forms[0].onclick();
  viewer.arrows[0].onclick();
  assert.equal(viewer.position.textContent, '72 / 72');
  viewer.image.onkeydown({key: 'ArrowRight', preventDefault() {}});
  assert.equal(viewer.position.textContent, '1 / 72');
  viewer.image.onpointerdown({isPrimary: true, pointerType: 'touch', pointerId: 1, clientX: 50});
  viewer.image.onpointermove({pointerId: 1, clientX: 100});
  assert.equal(viewer.position.textContent, '11 / 72');
  viewer.image.onpointerup();
  viewer.motion.matches = true;
  const before = viewer.image.src;
  viewer.scrollBy(150);
  assert.equal(viewer.image.src, before);
  assert.equal(viewer.forms[0]['aria-pressed'], 'true');
});
