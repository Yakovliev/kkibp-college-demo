const { test, expect } = require('@playwright/test');

test('home page renders without horizontal overflow', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle(/Економіко-правовий фаховий коледж/);

  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    title: document.title,
    touch: 'ontouchstart' in window,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    dpr: window.devicePixelRatio
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
});
