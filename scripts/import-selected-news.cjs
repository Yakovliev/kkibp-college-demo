const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourceHost = 'https://kkibp.edu.ua';
const publicBase = 'https://yakovliev.github.io/kkibp-college-demo/';

const entries = [
  {
    sourceFile: '/tmp/kkibp-balance-news/4864.html',
    publishedAt: '2026-06-24T13:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4864-prorektorka-inna-raikovska-vziala-uchast-u-naukovo-praktychnomu-seminari-z-pytan-tsyfrovoi-transformatsii-sfery-nti',
    tags: ['it-science', 'sdg-04', 'sdg-09', 'sdg-17']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4851.html',
    publishedAt: '2026-06-20T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4851-syla-v-iednosti-instytut-vidznacheno-nahorodoiu-vid-povitrianoho-komanduvannia-tsentr',
    tags: ['sdg-16', 'sdg-17']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4838.html',
    publishedAt: '2026-06-12T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4838-uchast-vykladachiv-kafedry-prava-u-mizhnarodnomu-naukovomu-forumi-asotsiatsii-iurydychnykh-klinik-ukrainy',
    tags: ['social-law', 'sdg-04', 'sdg-10', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4831.html',
    publishedAt: '2026-06-09T13:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4831-vykladachi-kafedry-prava-vzialy-uchast-u-vseukrainskii-naukovo-praktychnii-konferentsii-z-mizhnarodnoiu-uchastiu',
    tags: ['social-law', 'sdg-03', 'sdg-04', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4811.html',
    publishedAt: '2026-05-31T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4811-petrenko-artem-sportyvna-hordist-ekonomiko-pravovoho-fakhovoho-koledzhu',
    tags: ['sdg-03']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4760.html',
    publishedAt: '2026-05-10T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4760-den-zemli-ekolohichne-pravo-i-stalyi-rozvytok',
    tags: ['social-law', 'sdg-04', 'sdg-12', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4731.html',
    publishedAt: '2026-04-27T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4731-chornobyl-u-fotohrafiiakh-analiz-zmin-kriz-chas',
    tags: ['it-science', 'sdg-04', 'sdg-13', 'sdg-15']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4729.html',
    publishedAt: '2026-04-27T11:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4729-notayenota-feyky-pro-chornobyl-ta-radiatsiyu-vidbulasya-antyfeykova-intelektualna-hra',
    tags: ['social-law', 'it-science', 'sdg-04', 'sdg-13', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4726.html',
    publishedAt: '2026-04-25T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4726-100-troiand-dlia-kvituchoho-maibutnoho-vesniana-toloka-v-instytuti',
    tags: ['it-science', 'sdg-11', 'sdg-13', 'sdg-15']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4723.html',
    publishedAt: '2026-04-24T13:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4723-treninh-iz-protydii-dyskryminatsii-ta-pidtrymky-rivnosti',
    tags: ['social-law', 'sdg-05', 'sdg-10', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4716.html',
    publishedAt: '2026-04-24T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4716-praktychnyi-dosvid-i-novi-mozhlyvosti-uchast-studentiv-u-forumi-kharchovoi-ta-pobutovoi-industrii',
    tags: ['food-hospitality', 'sdg-04', 'sdg-09', 'sdg-12']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4651.html',
    publishedAt: '2026-04-07T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4651-zdobuvachi-osvity-otrymaly-sertyfikaty-za-kursom-otsinka-shkody-dovkillyu-vid-rosiyskoyi-ahresiyi',
    tags: ['social-law', 'it-science', 'sdg-13', 'sdg-15', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4648.html',
    publishedAt: '2026-04-05T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4648-praktychne-zaniattia-restoratoriv-poiednannia-estetyky-ta-kreatyvnosti',
    tags: ['food-hospitality', 'sdg-02', 'sdg-04', 'sdg-08']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4643.html',
    publishedAt: '2026-04-04T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4643-praktychni-zanyattya-u-restoratoriv',
    tags: ['food-hospitality', 'sdg-02', 'sdg-04', 'sdg-08']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4558.html',
    publishedAt: '2026-03-18T12:00:00+02:00',
    source: 'https://kkibp.edu.ua/uk/news/4558-vidbuvsia-kruhlyi-stil-na-temu-henderna-rivnist-u-pravi-ta-ekonomitsi-suchasni-vyklyky',
    tags: ['social-law', 'economics-trade', 'sdg-05', 'sdg-10', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4530.html',
    publishedAt: '2026-03-06T12:00:00+02:00',
    source: 'https://kkibp.edu.ua/uk/news/4530-uchast-u-natsionalnomu-forumi-women-led-recovery-hroshi-rishennia-vplyv',
    tags: ['economics-trade', 'sdg-05', 'sdg-08', 'sdg-10']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4452.html',
    publishedAt: '2026-02-10T12:00:00+02:00',
    source: 'https://kkibp.edu.ua/uk/news/4452-klasyka-svitovoho-kino-pro-kryzu-ta-nadiiu',
    tags: ['social-law', 'sdg-01', 'sdg-04', 'sdg-08']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4379.html',
    publishedAt: '2025-12-01T12:00:00+02:00',
    source: 'https://kkibp.edu.ua/uk/news/4379-mystetstvo-proty-nasylstva-ta-movy-nenavysti',
    tags: ['social-law', 'sdg-05', 'sdg-10', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4297.html',
    publishedAt: '2025-11-06T12:00:00+02:00',
    source: 'https://kkibp.edu.ua/uk/news/4297-pravo-na-zhyttia-mizhnarodno-pravovyi-zakhyst-dovkillia-pid-chas-viiny',
    tags: ['social-law', 'it-science', 'sdg-13', 'sdg-15', 'sdg-16']
  },
  {
    sourceFile: '/tmp/kkibp-balance-news/4247.html',
    publishedAt: '2025-10-20T12:00:00+03:00',
    source: 'https://kkibp.edu.ua/uk/news/4247-fotovystavka-torhivlya-lyudmy-nebezpeka-poruch',
    tags: ['social-law', 'sdg-05', 'sdg-10', 'sdg-16']
  }
];

const monthNames = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня'
];

function decodeHtml(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function textFromHtml(value) {
  return decodeHtml(String(value || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function truncate(value, maxLength) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(' ');
  const end = lastSpace > maxLength * 0.65 ? lastSpace : maxLength;
  return `${text.slice(0, end).replace(/[.,;:!?…]+$/, '')}...`;
}

function formatDate(value) {
  const date = new Date(value);
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function removeFirstDivByClass(html, className) {
  const start = html.search(new RegExp(`<div\\s+class=["'][^"']*${className}[^"']*["']`, 'i'));
  if (start < 0) return html;

  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let seenStart = false;

  for (let match = tagRe.exec(html); match; match = tagRe.exec(html)) {
    const tag = match[0];
    if (!tag.startsWith('</')) {
      depth += 1;
      seenStart = true;
    } else if (seenStart) {
      depth -= 1;
      if (depth === 0) {
        return `${html.slice(0, start)}${html.slice(tagRe.lastIndex)}`;
      }
    }
  }

  return html;
}

function absoluteImageUrl(src) {
  const clean = decodeHtml(src || '').trim();
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith('//')) return `https:${clean}`;
  if (clean.startsWith('/')) return `${sourceHost}${clean}`;
  return `${sourceHost}/${clean.replace(/^\.?\//, '')}`;
}

function imageExtension(url) {
  const clean = decodeURIComponent(url.split('?')[0].split('#')[0]);
  const ext = path.extname(clean).toLowerCase();
  return ext && ext.length <= 6 ? ext : '.jpg';
}

function articleId(sourceUrl) {
  return sourceUrl.split('/').pop();
}

function localArticleFile(sourceUrl) {
  return `news-${articleId(sourceUrl)}.html`;
}

function extractArticle(entry) {
  const raw = fs.readFileSync(entry.sourceFile, 'utf8');
  const itemStart = raw.indexOf('<div class="item-page">');
  const componentEnd = raw.indexOf('<!--End Component Area-->', itemStart);
  if (itemStart < 0 || componentEnd < 0) {
    throw new Error(`Cannot find article body in ${entry.sourceFile}`);
  }

  let block = raw.slice(itemStart, componentEnd);
  const titleMatch = block.match(/<h2>\s*<a\b[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i);
  const title = textFromHtml(titleMatch ? titleMatch[1] : '');
  const id = articleId(entry.source);

  block = block.replace(/<div class="item-page">\s*/i, '');
  block = block.replace(/<h2>[\s\S]*?<\/h2>/i, '');
  block = block.replace(/<div class='spshare'>[\s\S]*?<div style='clear:both'><\/div><\/div>/i, '');
  block = removeFirstDivByClass(block, 'article-tools');

  const hiddenIndex = block.lastIndexOf('<div style="display:none;">');
  if (hiddenIndex >= 0) block = block.slice(0, hiddenIndex);

  block = block
    .replace(/\r/g, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/<\/span>\s*<span\b[^>]*>/gi, (match, offset, source) => {
      const before = source[offset - 1] || '';
      const after = source[offset + match.length] || '';
      return /[\p{L}\p{N}]/u.test(before) && /[\p{L}\p{N}]/u.test(after) ? ' ' : '';
    })
    .replace(/<\/?span\b[^>]*>/gi, '')
    .replace(/\s+(style|class|width|height)="[^"]*"/gi, '')
    .replace(/\s+(style|class|width|height)='[^']*'/gi, '')
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const images = [];
  let imageIndex = 0;
  block = block.replace(/<img\b([^>]*?)>/gi, (tag, attrs) => {
    const srcMatch = attrs.match(/\bsrc=(["'])(.*?)\1/i);
    if (!srcMatch) return '';
    imageIndex += 1;
    const remoteUrl = absoluteImageUrl(srcMatch[2]);
    const ext = imageExtension(remoteUrl);
    const localPath = `assets/news/latest/${id}-${String(imageIndex).padStart(2, '0')}${ext}`;
    const altMatch = attrs.match(/\balt=(["'])(.*?)\1/i);
    const alt = decodeHtml(altMatch ? altMatch[2] : title).trim();
    images.push({ remoteUrl, localPath, alt });
    return `<img src="${localPath}" alt="${escapeHtml(alt || title)}" loading="lazy">`;
  });

  const text = textFromHtml(block);
  return {
    id,
    loadedAt: entry.publishedAt,
    publishedLabel: formatDate(entry.publishedAt),
    title,
    excerpt: truncate(text, 170),
    image: images[0]?.localPath || '',
    alt: images[0]?.alt || title,
    url: localArticleFile(entry.source),
    tags: entry.tags,
    body: block,
    images
  };
}

function loadCurrentNews() {
  const source = fs.readFileSync(path.join(root, 'js/news-data.js'), 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  return Array.isArray(context.window.COLLEGE_NEWS) ? context.window.COLLEGE_NEWS : [];
}

function updateMeta(html, article) {
  const description = escapeHtml(article.excerpt);
  const pageTitle = escapeHtml(`${article.title} – Новини – Економіко-правовий фаховий коледж ККІБП`);
  const absoluteUrl = `${publicBase}${article.url}`;
  const absoluteImage = article.image ? `${publicBase}${article.image}` : `${publicBase}assets/logo_small.gif`;
  const imageType = article.image.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const imageAlt = escapeHtml(article.alt || article.title);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${absoluteUrl}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${absoluteImage}">`)
    .replace(/<meta property="og:image:type" content="[^"]*">/, `<meta property="og:image:type" content="${imageType}">`)
    .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${imageAlt}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${absoluteImage}">`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*">/, `<meta name="twitter:image:alt" content="${imageAlt}">`);
}

function neighborLinks(article, orderedNews) {
  const currentIndex = orderedNews.findIndex((item) => item.id === article.id);
  const newer = orderedNews[currentIndex - 1];
  const older = orderedNews[currentIndex + 1];
  return [
    newer ? `<a href="${newer.url}"><span>Наступна новина</span><strong>${escapeHtml(newer.title)}</strong></a>` : '',
    older ? `<a href="${older.url}"><span>Попередня новина</span><strong>${escapeHtml(older.title)}</strong></a>` : ''
  ].filter(Boolean).join('');
}

function buildArticleMain(article, orderedNews) {
  const articleNav = neighborLinks(article, orderedNews);
  return `<main id="main"><section class="page-hero page-hero--solo news-article-hero"><div class="container"><nav class="breadcrumbs" aria-label="Хлібні крихти"><a href="index.html">Головна</a><a href="news.html">Новини</a><span>${escapeHtml(article.title)}</span></nav><div class="page-hero-grid"><div class="page-hero-copy"><span class="eyebrow eyebrow--light">Новина</span><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt)}</p></div></div></div></section>
<section class="section news-article-section"><div class="container news-article-layout"><article class="news-article-card"><div class="news-article-meta"><span>Новини коледжу</span><time datetime="${escapeHtml(article.loadedAt)}">${escapeHtml(article.publishedLabel)}</time></div><div class="news-article-body">${article.body}</div></article><aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини</a>${articleNav ? `<div class="news-article-neighbors">${articleNav}</div>` : ''}</aside></div></section>
</main>`;
}

const importedArticles = entries.map(extractArticle);
const importedIds = new Set(importedArticles.map((article) => article.id));
const currentNews = loadCurrentNews().filter((article) => !importedIds.has(article.id));
const allNews = [...currentNews, ...importedArticles.map(({ body, images, ...article }) => article)];
const orderedNews = [...allNews].sort((a, b) => Date.parse(b.loadedAt) - Date.parse(a.loadedAt));

const template = fs.readFileSync(path.join(root, 'news.html'), 'utf8');
for (const article of importedArticles) {
  const main = buildArticleMain(article, orderedNews);
  const page = updateMeta(template.replace(/<main id="main">[\s\S]*?<\/main>/, main), article);
  fs.writeFileSync(path.join(root, article.url), page);
}

for (const article of currentNews) {
  const articlePath = path.join(root, article.url);
  let page = fs.readFileSync(articlePath, 'utf8');
  const links = neighborLinks(article, orderedNews);
  page = page.replace(
    /<aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини<\/a>(?:<div class="news-article-neighbors">[\s\S]*?<\/div>)?<\/aside>/,
    `<aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини</a>${links ? `<div class="news-article-neighbors">${links}</div>` : ''}</aside>`
  );
  fs.writeFileSync(articlePath, page);
}

fs.writeFileSync(
  path.join(root, 'js/news-data.js'),
  `window.COLLEGE_NEWS = ${JSON.stringify(allNews, null, 2)};\n`
);

const curlConfig = [
  'location',
  'compressed',
  'fail',
  'show-error',
  'create-dirs',
  ...importedArticles.flatMap((article) => article.images.flatMap((image) => [
    `url = "${image.remoteUrl}"`,
    `output = "${image.localPath}"`
  ]))
].join('\n');
fs.writeFileSync('/tmp/kkibp-selected-news-images.curl', `${curlConfig}\n`);

console.log(`Imported ${importedArticles.length} selected articles.`);
console.log(`Prepared ${importedArticles.reduce((total, article) => total + article.images.length, 0)} image downloads.`);
