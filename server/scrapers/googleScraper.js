const { getJson } = require("serpapi");
const puppeteer = require("puppeteer");

async function searchGoogleAndScrape(title, excludeDomain) {
  const apiKey = process.env.SERP_API;

  return new Promise((resolve, reject) => {
    getJson(
      {
        api_key: apiKey,
        engine: "google",
        q: title,
        num: 2
      },
      async (json) => {
        try {
          console.log("SERP RAW RESPONSE:", json);
console.log("Organic results:", json.organic_results);

          const results = json.organic_results || [];
          const links = [];

          for (const r of results) {
            if (!r.link) continue;
            try {
              const u = new URL(r.link);
              if (excludeDomain && u.hostname.includes(excludeDomain)) continue;
              links.push(r.link);
            } catch {}
            if (links.length === 2) break;
          }

          if (links.length === 0) {
            return resolve([]);
          }

          // 🔍 Scrape content from links
          const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
          });

          const scraped = [];

          for (const url of links) {
            const page = await browser.newPage();
            try {
              await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 30000
              });

              const data = await page.evaluate(() => {
                const container =
                  document.querySelector("article") ||
                  document.querySelector("main") ||
                  document.body;

                const text = Array.from(
                  container.querySelectorAll("p, h1, h2, h3")
                )
                  .map(e => e.innerText.trim())
                  .filter(Boolean)
                  .join("\n\n");

                return {
                  title: document.title,
                  content: text
                };
              });

            scraped.push({
  title: data.title || "",
  url,
  content: data.content || ""
});

            } catch (err) {
              console.error("Scrape failed:", url);
            } finally {
              await page.close();
            }
          }

          await browser.close();
          resolve(scraped);

        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

module.exports = { searchGoogleAndScrape };
