const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function searchGoogleAndScrape(title, excludeDomain, maxResults = 3) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const query = encodeURIComponent(title + ' blog article');
  const searchUrl = `https://www.google.com/search?q=${query}&hl=en`;

  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
  await delay(1500);

  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a'));
    return anchors
      .map(a => a.href)
      .filter(h => h && h.startsWith('http') && !h.includes('google.com'));
  });

  const unique = Array.from(new Set(links));

  const results = [];

  for (const link of unique) {
    try {
      const urlObj = new URL(link);
      if (excludeDomain && urlObj.hostname.includes(excludeDomain)) continue;
    } catch (e) {
      continue;
    }

    // open page and scrape main textual content
    const articlePage = await browser.newPage();
    try {
      await articlePage.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await delay(2000);

      const scraped = await articlePage.evaluate(() => {
        const container = document.querySelector('main') || document.querySelector('article') || document.body;
        if (!container) return { title: document.title || '', content: '' };

        const titleEl = container.querySelector('h1') || document.querySelector('h1') || { innerText: document.title };
        const elements = container.querySelectorAll('p, h1, h2, h3, h4, li, blockquote');
        let text = '';
        elements.forEach(el => {
          const t = el.innerText?.trim();
          if (t && t.length > 0) text += t + '\n\n';
        });
        return { title: titleEl?.innerText?.trim() || document.title || '', content: text.trim() };
      });

      if (scraped.content && scraped.content.length > 200) {
        results.push({ title: scraped.title, url: link, content: scraped.content });
      }
    } catch (err) {
      // ignore individual failures
    } finally {
      try { await articlePage.close(); } catch(e){}
    }

    if (results.length >= maxResults) break;
  }

  try { await page.close(); } catch(e){}
  await browser.close();

  return results;
}

module.exports = { searchGoogleAndScrape };
