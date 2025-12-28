const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
require("dotenv").config();

const Article = require("../models/Article");

const BLOG_LIST_URL = "https://beyondchats.com/blogs/";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function scrapeBlogs() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(BLOG_LIST_URL, { waitUntil: "networkidle2" });

  await page.waitForSelector("ul.wp-block-latest-posts__list");

  const blogs = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("ul.wp-block-latest-posts__list li")
    ).map(li => {
      const titleEl = li.querySelector(
        "a.wp-block-latest-posts__post-title"
      );
      const authorEl = li.querySelector(
        ".wp-block-latest-posts__post-author"
      );

      return {
        title: titleEl?.innerText.trim(),
        url: titleEl?.href,
        author: authorEl?.innerText.replace("by", "").trim()
      };
    });
  });

  console.log(`🔎 Found ${blogs.length} blogs`);

  for (const blog of blogs) {
    const articlePage = await browser.newPage();

    try {
      await articlePage.goto(blog.url, {
        waitUntil: "domcontentloaded"
      });

      // ✅ version-safe delay
      await delay(3000);

      const content = await articlePage.evaluate(() => {
        const container =
          document.querySelector("main") ||
          document.querySelector("article");

        if (!container) return "";

        const elements = container.querySelectorAll(
          "p, h1, h2, h3, h4, blockquote, li, figcaption"
        );

        let text = "";
        elements.forEach(el => {
          const t = el.innerText?.trim();
          if (t && t.length > 0) text += t + "\n\n";
        });

        return text.trim();
      });

      if (!content || content.length < 300) {
        console.log(`❌ No content found for ${blog.url}`);
        await articlePage.close();
        continue;
      }

      await Article.create({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        content
      });

      console.log(`✅ Saved: ${blog.title}`);
    } catch (err) {
      console.log(`❌ Error scraping ${blog.url}`);
      console.error(err.message);
    } finally {
      await articlePage.close();
    }
  }

  await browser.close();
  console.log("🎉 All blogs scraped and stored successfully");
  process.exit();
}

scrapeBlogs();
