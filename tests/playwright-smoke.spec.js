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

test('home about-college carousel renders and can be controlled', async ({ page }) => {
  await page.goto('/index.html');

  const section = page.locator('#college-about');
  const carousel = section.locator('[data-college-carousel]');
  const slides = carousel.locator('.college-photo-track img');
  const dots = carousel.locator('[data-carousel-dot]');

  await expect(section.getByRole('heading', { name: 'Коледж для впевненого професійного старту' })).toBeVisible();
  await section.scrollIntoViewIfNeeded();
  await expect(slides).toHaveCount(4);
  await expect(dots).toHaveCount(4);
  await expect(section.locator('.college-combo-more')).toHaveAttribute('href', 'college.html#about');

  const imageSources = await slides.evaluateAll((images) => images.map((image) => new URL(image.getAttribute('src'), window.location.href).href));
  for (const src of imageSources) {
    const response = await page.request.get(src);
    expect(response.ok(), `${src} should be available`).toBe(true);
  }

  const activeBefore = await dots.evaluateAll((buttons) => buttons.findIndex((button) => button.classList.contains('is-active')));
  await carousel.getByRole('button', { name: 'Наступне фото' }).click();
  const activeAfter = await dots.evaluateAll((buttons) => buttons.findIndex((button) => button.classList.contains('is-active')));
  const trackTransform = await carousel.locator('.college-photo-track').evaluate((track) => track.style.transform);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

  expect(activeAfter).toBe((activeBefore + 1) % 4);
  expect(trackTransform).toBe(`translateX(-${activeAfter * 100}%)`);
  expect(overflow).toBe(false);
});

test('primary menu toggles submenus without navigating', async ({ page }) => {
  await page.goto('/index.html');

  const navToggle = page.locator('.nav-toggle');
  if (await navToggle.isVisible()) await navToggle.click();

  const startUrl = page.url();
  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const applicantsToggle = page.getByRole('button', { name: /Абітурієнту/ }).first();
  const collegeMenu = page.locator('#menu-0');
  const applicantsMenu = page.locator('#menu-1');

  await collegeToggle.click();
  await expect(page).toHaveURL(startUrl);
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(collegeMenu).toBeVisible();

  await applicantsToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(collegeMenu).toBeHidden();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(applicantsMenu).toBeVisible();

  await applicantsToggle.click();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(applicantsMenu).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/mega-open/);

  await expect(page.getByRole('link', { name: 'Новини' }).first()).toHaveAttribute('href', 'news.html');
});

test('mobile submenu uses measured accordion motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'mobile accordion motion is specific to the drawer layout');

  await page.goto('/index.html');
  await page.locator('.nav-toggle').click();

  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const applicantsToggle = page.getByRole('button', { name: /Абітурієнту/ }).first();
  const collegeMenu = page.locator('#menu-0');
  const applicantsMenu = page.locator('#menu-1');

  await collegeToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(collegeMenu).toBeVisible();
  await page.waitForTimeout(320);

  const openMetrics = await collegeMenu.evaluate((menu) => {
    const style = getComputedStyle(menu);
    return {
      ariaHidden: menu.getAttribute('aria-hidden'),
      customHeight: style.getPropertyValue('--accordion-height').trim(),
      inert: menu.inert,
      maxHeight: style.maxHeight,
      overflowY: style.overflowY,
      pointerEvents: style.pointerEvents,
      settled: menu.closest('.has-menu').classList.contains('menu-settled'),
      scrollHeight: menu.scrollHeight,
      transitionProperty: style.transitionProperty
    };
  });

  expect(openMetrics.ariaHidden).toBe('false');
  expect(openMetrics.inert).toBe(false);
  expect(openMetrics.maxHeight).toBe('none');
  expect(openMetrics.overflowY).toBe('visible');
  expect(openMetrics.pointerEvents).toBe('auto');
  expect(openMetrics.settled).toBe(true);
  expect(openMetrics.transitionProperty).toContain('max-height');
  expect(Math.abs(parseFloat(openMetrics.customHeight) - openMetrics.scrollHeight)).toBeLessThanOrEqual(2);

  await applicantsToggle.click();
  await expect(collegeToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(collegeMenu).toBeHidden();
  await expect(applicantsToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(applicantsMenu).toBeVisible();

  const closedMetrics = await collegeMenu.evaluate((menu) => ({
    ariaHidden: menu.getAttribute('aria-hidden'),
    inert: menu.inert,
    maxHeight: getComputedStyle(menu).maxHeight,
    pointerEvents: getComputedStyle(menu).pointerEvents,
    settled: menu.closest('.has-menu').classList.contains('menu-settled')
  }));

  expect(closedMetrics.ariaHidden).toBe('true');
  expect(closedMetrics.inert).toBe(true);
  expect(parseFloat(closedMetrics.maxHeight)).toBeLessThanOrEqual(1);
  expect(closedMetrics.pointerEvents).toBe('none');
  expect(closedMetrics.settled).toBe(false);
});

test('mobile drawer remains scrollable with a long submenu open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-mobile', 'mobile drawer scroll regression runs on the drawer layout');

  await page.goto('/index.html');
  await page.locator('.nav-toggle').click();

  const libraryToggle = page.getByRole('button', { name: /Бібліотека/ }).first();
  const libraryMenu = page.locator('#menu-5');
  const navShell = page.locator('.nav-shell');

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(libraryMenu).toBeVisible();
  await page.waitForTimeout(320);

  const metrics = await navShell.evaluate((shell) => ({
    clientHeight: shell.clientHeight,
    overflowY: getComputedStyle(shell).overflowY,
    panelMaxHeight: getComputedStyle(shell.querySelector('#menu-5')).maxHeight,
    panelOverflowY: getComputedStyle(shell.querySelector('#menu-5')).overflowY,
    scrollHeight: shell.scrollHeight,
    scrollTop: shell.scrollTop
  }));

  expect(metrics.overflowY).toMatch(/auto|scroll/);
  expect(metrics.panelMaxHeight).toBe('none');
  expect(metrics.panelOverflowY).toBe('visible');
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  const touchMove = await navShell.evaluate((shell) => {
    const target = shell.querySelector('#menu-5 a') || shell;
    const createTouchEvent = (type, clientY) => {
      const event = new Event(type, {
        bubbles: true,
        cancelable: true
      });
      Object.defineProperty(event, 'touches', {
        value: [{ clientY }],
        configurable: true
      });
      return event;
    };

    target.dispatchEvent(createTouchEvent('touchstart', 520));

    const moveEvent = createTouchEvent('touchmove', 220);
    target.dispatchEvent(moveEvent);

    return {
      defaultPrevented: moveEvent.defaultPrevented,
      supported: true
    };
  });

  expect(touchMove.supported).toBe(true);
  expect(touchMove.defaultPrevented).toBe(false);

  const afterScroll = await navShell.evaluate((shell) => {
    shell.scrollTop = 0;
    shell.scrollBy(0, 420);
    return shell.scrollTop;
  });
  expect(afterScroll).toBeGreaterThan(metrics.scrollTop);
});

test('navigation remains visible when opened after page scroll', async ({ page }) => {
  await page.goto('/index.html');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForFunction(() => window.scrollY > 400);

  const navToggle = page.locator('.nav-toggle');
  if (await navToggle.isVisible()) {
    await navToggle.click();

    const navShell = page.locator('.nav-shell');
    await expect(navShell).toBeVisible();

    const shellMetrics = await navShell.evaluate((shell) => {
      const rect = shell.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        top: rect.top,
        viewportHeight: window.innerHeight
      };
    });

    expect(shellMetrics.bottom).toBeGreaterThan(0);
    expect(shellMetrics.top).toBeLessThan(shellMetrics.viewportHeight);

    const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
    await collegeToggle.click();
    await expect(page.locator('#menu-0')).toBeVisible();
    return;
  }

  const collegeToggle = page.getByRole('button', { name: /Коледж/ }).first();
  const collegeMenu = page.locator('#menu-0');

  await collegeToggle.click();
  await expect(collegeMenu).toBeVisible();

  const menuMetrics = await collegeMenu.evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      top: rect.top,
      viewportHeight: window.innerHeight
    };
  });

  expect(menuMetrics.bottom).toBeGreaterThan(0);
  expect(menuMetrics.top).toBeGreaterThanOrEqual(0);
  expect(menuMetrics.top).toBeLessThan(menuMetrics.viewportHeight);
});

test('mega menu scrolls inside a compact laptop viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-laptop', 'compact laptop scroll check runs once');

  await page.setViewportSize({ width: 1280, height: 480 });
  await page.goto('/index.html');

  const libraryToggle = page.getByRole('button', { name: /Бібліотека/ }).first();
  const libraryMenu = page.locator('#menu-5');

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(libraryMenu).toBeVisible();

  const metrics = await libraryMenu.evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    const style = getComputedStyle(menu);
    return {
      bottom: rect.bottom,
      clientHeight: menu.clientHeight,
      overflowY: style.overflowY,
      scrollHeight: menu.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });

  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
  expect(metrics.overflowY).toMatch(/auto|scroll/);
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

  const box = await libraryMenu.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + Math.min(80, box.height - 10));
  const beforeScroll = await libraryMenu.evaluate((menu) => menu.scrollTop);
  await page.mouse.wheel(0, 260);
  await page.waitForTimeout(100);
  const afterScroll = await libraryMenu.evaluate((menu) => menu.scrollTop);
  expect(afterScroll).toBeGreaterThan(beforeScroll);

  await libraryToggle.click();
  await expect(libraryToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(libraryMenu).toBeHidden();
});
