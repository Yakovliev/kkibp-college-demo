const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const publicBase = 'https://yakovliev.github.io/kkibp-college-demo/';

const articles = [
  {
    id: 'sdg-06-vsesvitnii-den-vody-vidpovidalne-vodokorystuvannia',
    loadedAt: '2026-07-28T12:00:00+03:00',
    publishedLabel: '28 липня 2026',
    title: 'У ККІБП відзначили Всесвітній день води: формуємо культуру відповідального водокористування',
    excerpt: '22 березня у коледжі відбувся просвітницький захід до Всесвітнього дня води, присвячений відповідальному використанню водних ресурсів.',
    image: 'assets/sdg/sdg-06.svg',
    alt: 'ЦСР 6 - Чиста вода та належні санітарні умови',
    url: 'news-sdg-06-vsesvitnii-den-vody-vidpovidalne-vodokorystuvannia.html',
    tags: ['it-science', 'sdg-06', 'sdg-04', 'sdg-12'],
    body: `<p><img src="assets/sdg/sdg-06.svg" alt="ЦСР 6 - Чиста вода та належні санітарні умови" width="480" height="480" loading="lazy"></p>
<p>В Економіко-правовому фаховому коледжі Київського кооперативного інституту бізнесу і права 22 березня 2026 року відбувся просвітницький захід, присвячений Всесвітньому дню води. Його метою стало підвищення екологічної свідомості здобувачів освіти та популяризація принципів відповідального використання водних ресурсів.</p>
<p>Учасники заходу ознайомилися з глобальними викликами у сфері забезпечення населення якісною питною водою, обговорили сучасні підходи до ощадливого використання водних ресурсів та роль кожної людини у збереженні довкілля. Під час дискусії студенти презентували власні ідеї щодо впровадження екологічних практик у повсякденному житті та навчальному середовищі.</p>
<p>Захід став ще одним кроком у формуванні екологічної культури академічної спільноти та підтвердив прагнення коледжу долучатися до реалізації Цілі сталого розвитку 6 «Чиста вода та належні санітарні умови», що передбачає забезпечення доступу до безпечної води та раціонального використання водних ресурсів.</p>
<p>Коледж і надалі підтримуватиме освітні ініціативи, спрямовані на розвиток екологічної відповідальності та сталого розвитку суспільства.</p>`
  },
  {
    id: 'sdg-07-enerhoefektyvnist-v-osvitnomu-seredovyshchi',
    loadedAt: '2026-07-28T11:00:00+03:00',
    publishedLabel: '28 липня 2026',
    title: 'Коледж продовжує впроваджувати принципи енергоефективності в освітньому середовищі',
    excerpt: 'Коледж послідовно модернізує освітлення, оптимізує споживання електроенергії та розвиває культуру відповідального енергоспоживання.',
    image: 'assets/sdg/sdg-07.svg',
    alt: 'ЦСР 7 - Доступна та чиста енергія',
    url: 'news-sdg-07-enerhoefektyvnist-v-osvitnomu-seredovyshchi.html',
    tags: ['it-science', 'sdg-07', 'sdg-09', 'sdg-13'],
    body: `<p><img src="assets/sdg/sdg-07.svg" alt="ЦСР 7 - Доступна та чиста енергія" width="480" height="480" loading="lazy"></p>
<p>Економіко-правовий фаховий коледж Київського кооперативного інституту бізнесу і права послідовно впроваджує сучасні підходи до раціонального використання енергетичних ресурсів та створення комфортного освітнього середовища.</p>
<p>У межах розвитку інфраструктури закладу здійснюється поетапна модернізація систем освітлення із використанням енергоощадних LED-світильників, оптимізується споживання електроенергії в навчальних корпусах, а також проводиться інформаційно-просвітницька робота серед здобувачів освіти та працівників щодо культури відповідального енергоспоживання.</p>
<p>Енергоефективність сьогодні є не лише економічною необхідністю, а й важливим внеском у збереження природних ресурсів, скорочення викидів парникових газів та формування екологічно відповідальної академічної спільноти.</p>
<p>Реалізація таких ініціатив відповідає Цілі сталого розвитку 7 «Доступна та чиста енергія» та підтверджує прагнення коледжу інтегрувати принципи сталого розвитку в освітню, наукову й адміністративну діяльність.</p>`
  },
  {
    id: 'sdg-14-ekolohichna-aktsiia-proty-plastykovoho-zabrudnennia-vodoim',
    loadedAt: '2026-07-28T10:00:00+03:00',
    publishedLabel: '28 липня 2026',
    title: 'У коледжі провели екологічну акцію зі зменшення пластикового забруднення водойм',
    excerpt: 'Студенти й працівники коледжу долучилися до збору пластикових кришечок і обговорили вплив пластикових відходів на водні екосистеми.',
    image: 'assets/sdg/sdg-14.svg',
    alt: 'ЦСР 14 - Збереження морських ресурсів',
    url: 'news-sdg-14-ekolohichna-aktsiia-proty-plastykovoho-zabrudnennia-vodoim.html',
    tags: ['it-science', 'sdg-14', 'sdg-12', 'sdg-13'],
    body: `<p><img src="assets/sdg/sdg-14.svg" alt="ЦСР 14 - Збереження морських ресурсів" width="480" height="480" loading="lazy"></p>
<p>В Економіко-правовому фаховому коледжі Київського кооперативного інституту бізнесу і права відбулася екологічна акція, спрямована на популяризацію відповідального поводження з відходами та збереження водних екосистем.</p>
<p>Студенти, викладачі та працівники коледжу долучилися до збору пластикових кришечок для подальшої переробки, а також взяли участь у тематичній дискусії щодо впливу пластикових відходів на річкові та морські екосистеми. Учасники обговорили сучасні підходи до сортування сміття, принципи циркулярної економіки та роль молоді у збереженні природного середовища.</p>
<p>Подібні ініціативи формують екологічно відповідальне мислення, сприяють поширенню культури сталого споживання та демонструють активну громадянську позицію академічної спільноти.</p>
<p>Захід реалізовано в межах підтримки Цілі сталого розвитку 14 «Збереження морських ресурсів», яка спрямована на захист водних екосистем і зменшення забруднення Світового океану.</p>`
  },
  {
    id: '3357-publichna-lektsiia-alternatyvna-enerhetyka-ta-ii-rol-v-enerhetychnii-nezalezhnosti-derzhavy',
    loadedAt: '2024-02-29T12:00:00+02:00',
    publishedLabel: '29 лютого 2024',
    title: 'Публічна лекція «Альтернативна енергетика та її роль в енергетичній незалежності держави»',
    excerpt: 'Професор Олександр Серьогін розповів студентам і викладачам про відновлювані джерела енергії та їхнє значення для енергетичної незалежності держави.',
    image: 'assets/news/latest/3357-alternatyvna-enerhetyka-01.jpg',
    alt: 'Публічна лекція про альтернативну енергетику',
    url: 'news-3357-publichna-lektsiia-alternatyvna-enerhetyka-ta-ii-rol-v-enerhetychnii-nezalezhnosti-derzhavy.html',
    tags: ['it-science', 'sdg-07', 'sdg-04', 'sdg-13'],
    body: `<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-01.jpg" alt="Публічна лекція про альтернативну енергетику" loading="lazy"></p>
<p>29 лютого за ініціативи Ради молодих вчених Економіко-правового фахового коледжу Київського кооперативного інституту бізнесу і права організовано проведення публічної лекції. Спікер заходу - доктор технічних наук, професор, професор кафедри харчових технологій Олександр Серьогін. Тема його лекції - «Альтернативна енергетика та її роль в енергетичній незалежності держави».</p>
<p>Альтернативною називають усю енергетику, яка не надходить від традиційних джерел: нафти, газу або вугілля. Також вона відома як відновлювальна, або «зелена», оскільки її отримують з поновлюваних ресурсів. Ці ресурси або існують постійно, або періодично з’являються у природі, наприклад, енергія сонця, вітру або води. Альтернативна енергетика не має шкідливих відходів і не руйнує екосистему.</p>
<p>Слухачі лекції - студенти та викладачі навчального закладу - щиро вдячні доповідачу за цікаву інформацію та заряд позитивної енергії.</p>
<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-02.jpg" alt="Учасники публічної лекції про альтернативну енергетику" loading="lazy"></p>
<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-03.jpg" alt="Виступ професора Олександра Серьогіна" loading="lazy"></p>
<p><img src="assets/news/latest/3357-alternatyvna-enerhetyka-04.jpg" alt="Обговорення альтернативних джерел енергії" loading="lazy"></p>`
  }
];

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function loadCurrentNews() {
  const source = fs.readFileSync(path.join(root, 'js/news-data.js'), 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  return Array.isArray(context.window.COLLEGE_NEWS) ? context.window.COLLEGE_NEWS : [];
}

function imageType(image) {
  if (image.endsWith('.svg')) return 'image/svg+xml';
  if (image.endsWith('.png')) return 'image/png';
  return 'image/jpeg';
}

function updateMeta(html, article) {
  const description = escapeHtml(article.excerpt);
  const pageTitle = escapeHtml(`${article.title} – Новини – Економіко-правовий фаховий коледж ККІБП`);
  const absoluteUrl = `${publicBase}${article.url}`;
  const absoluteImage = `${publicBase}${article.image}`;
  const imageAlt = escapeHtml(article.alt || article.title);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(article.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${absoluteUrl}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${absoluteImage}">`)
    .replace(/<meta property="og:image:type" content="[^"]*">/, `<meta property="og:image:type" content="${imageType(article.image)}">`)
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

const newIds = new Set(articles.map((article) => article.id));
const tagUpdates = {
  '4885-uchasnyky-osvitnoho-protsesu-doluchylysya-do-aktsiyi-voroham-kryshka': ['sdg-12', 'sdg-14', 'sdg-16'],
  '4872-predstavnyky-instytutu-vzialy-uchast-u-mizhnarodnii-naukovo-praktychnii-konferentsii-z-pytan-ievropeiskoi-zelenoi-polityky-ta-stalykh-finansiv': ['sdg-07', 'sdg-13', 'sdg-17']
};

const currentNews = loadCurrentNews()
  .filter((article) => !newIds.has(article.id))
  .map((article) => {
    const sdgTags = tagUpdates[article.id];
    if (!sdgTags) return article;
    const departmentTags = article.tags.filter((tag) => !tag.startsWith('sdg-'));
    return { ...article, tags: [...departmentTags, ...sdgTags] };
  });
const orderedNews = [...currentNews, ...articles]
  .sort((a, b) => Date.parse(b.loadedAt) - Date.parse(a.loadedAt));

const template = fs.readFileSync(path.join(root, 'news.html'), 'utf8');
for (const article of articles) {
  const main = buildArticleMain(article, orderedNews);
  const page = updateMeta(template.replace(/<main id="main">[\s\S]*?<\/main>/, main), article);
  fs.writeFileSync(path.join(root, article.url), page.replace(/[ \t]+$/gm, ''));
}

for (const article of orderedNews) {
  if (newIds.has(article.id)) continue;
  const articlePath = path.join(root, article.url);
  let page = fs.readFileSync(articlePath, 'utf8');
  const links = neighborLinks(article, orderedNews);
  page = page.replace(
    /<aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини<\/a>(?:<div class="news-article-neighbors">[\s\S]*?<\/div>)?<\/aside>/,
    `<aside class="news-article-aside" aria-label="Навігація новиною"><a class="news-article-back" href="news.html">Усі новини</a>${links ? `<div class="news-article-neighbors">${links}</div>` : ''}</aside>`
  );
  fs.writeFileSync(articlePath, page.replace(/[ \t]+$/gm, ''));
}

fs.writeFileSync(
  path.join(root, 'js/news-data.js'),
  `window.COLLEGE_NEWS = ${JSON.stringify(orderedNews.map(({ body, ...article }) => article), null, 2)};\n`
);

console.log(`Added ${articles.length} SDG gap articles.`);
console.log(`News archive now contains ${orderedNews.length} articles.`);
