import { chromium } from 'playwright';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
});
const page = await browser.newPage();

async function measureViewport(width, height, openMenu = false) {
  await page.setViewportSize({ width, height });
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle' });
  if (openMenu) {
    await page.click('.nav-toggle');
  }
  await page.waitForTimeout(150);
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    };
    const visible = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const brand = document.querySelector('.brand-text strong');
    const brandStyle = brand ? getComputedStyle(brand) : null;
    return {
      viewport: { width: innerWidth, height: innerHeight },
      navOpen: document.body.classList.contains('nav-open'),
      header: rect(document.querySelector('.site-header')),
      brand: rect(brand),
      brandClientHeight: brand?.clientHeight || 0,
      brandScrollHeight: brand?.scrollHeight || 0,
      brandClipped: brand ? brand.scrollHeight > brand.clientHeight + 1 : null,
      brandLineClamp: brandStyle?.webkitLineClamp || brandStyle?.lineClamp || '',
      brandFontSize: brandStyle?.fontSize || '',
      headerLanguageVisible: visible(document.querySelector('.header-language')),
      mobileLanguageVisible: visible(document.querySelector('.mobile-language')),
      topbarDisplay: getComputedStyle(document.querySelector('.topbar')).display,
      navShell: rect(document.querySelector('.nav-shell')),
      mobileLanguage: rect(document.querySelector('.mobile-language')),
      searchButton: rect(document.querySelector('.search-open')),
      menuButton: rect(document.querySelector('.nav-toggle'))
    };
  });
}

const mobileClosed = await measureViewport(390, 844, false);
const mobileOpen = await measureViewport(390, 844, true);
await page.screenshot({ path: '/private/tmp/kkibp-mobile-menu.png', fullPage: false });
const narrowOpen = await measureViewport(360, 780, true);
const tabletClosed = await measureViewport(820, 1080, false);
const tabletOpen = await measureViewport(820, 1080, true);
await page.screenshot({ path: '/private/tmp/kkibp-tablet-menu.png', fullPage: false });

await browser.close();
console.log(JSON.stringify({ mobileClosed, mobileOpen, narrowOpen, tabletClosed, tabletOpen }, null, 2));
