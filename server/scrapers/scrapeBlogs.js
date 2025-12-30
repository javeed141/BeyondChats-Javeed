const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Article = require("../models/Article");

const BLOG_LIST_URL = "https://beyondchats.com/blogs/";
const delay = ms => new Promise(res => setTimeout(res, ms));

/* -------------------- CONTENT CLEANER -------------------- */
function beautifyContent(text) {
  if (!text) return "";

  return text
    // remove tabs & multiple spaces
    .replace(/[ \t]+/g, " ")

    // normalize line endings
    .replace(/\r\n/g, "\n")

    // limit multiple newlines
    .replace(/\n{3,}/g, "\n\n")

    // remove space before punctuation
    .replace(/\s+([.,!?;:])/g, "$1")

    // trim each line
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

/* -------------------- SCRAPER -------------------- */
async function scrapeBlogs() {
  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not found in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(BLOG_LIST_URL, { waitUntil: "networkidle2" });
  await page.waitForSelector("ul.wp-block-latest-posts__list");

  /* -------------------- GET BLOG LIST -------------------- */
  const blogs = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("ul.wp-block-latest-posts__list li")
    )
      .slice(0, 5)
      .map(li => {
        const titleEl = li.querySelector("a.wp-block-latest-posts__post-title");
        const authorEl = li.querySelector(".wp-block-latest-posts__post-author");

        return {
          title: titleEl?.innerText.trim(),
          url: titleEl?.href,
          author: authorEl?.innerText.replace("by", "").trim()
        };
      });
  });

  console.log(`🔎 Found ${blogs.length} blogs`);

  /* -------------------- SCRAPE EACH BLOG -------------------- */
  for (const blog of blogs) {
    if (!blog.url) {
      console.log("⚠️ Skipping blog with no URL");
      continue;
    }

    const articlePage = await browser.newPage();

    try {
      await articlePage.goto(blog.url, {
        waitUntil: "domcontentloaded"
      });

      await delay(3000);

      let rawContent = await articlePage.evaluate(() => {
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
          if (t) text += t + "\n\n";
        });

        return text.trim();
      });

      const content = beautifyContent(rawContent);

      if (!content || content.length < 300) {
        console.log(`❌ No valid content for ${blog.url}`);
        continue;
      }

      await Article.create({
        title: blog.title,
        author: blog.author || "Unknown",
        url: blog.url,
        originalContent: content,
        content,
        updatedContent: null
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

// const puppeteer = require("puppeteer");
// const mongoose = require("mongoose");
// require("dotenv").config({ path: "../.env" });

// const Article = require("../models/Article");

// const BLOG_LIST_URL = "https://beyondchats.com/blogs/";
// const delay = ms => new Promise(res => setTimeout(res, ms));

// // remove extra spaces + keep first 3 paragraphs
// function cleanContent(text) {
//   if (!text) return "";

//   return text
//     .replace(/\s+/g, " ")
//     .split("\n\n")
//     .map(p => p.trim())
//     .filter(Boolean)
//     .slice(0, 3)
//     .join("\n\n");
// }

// async function scrapeBlogs() {
//   if (!process.env.MONGO_URI) {
//     throw new Error("❌ MONGO_URI not found in .env");
//   }

//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("✅ MongoDB connected");

//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"]
//   });

//   const page = await browser.newPage();
//   await page.goto(BLOG_LIST_URL, { waitUntil: "networkidle2" });
//   await page.waitForSelector("ul.wp-block-latest-posts__list");

//   const blogs = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll("ul.wp-block-latest-posts__list li")
//     )
//       .slice(0, 5)
//       .map(li => {
//         const a = li.querySelector("a.wp-block-latest-posts__post-title");
//         const author = li.querySelector(".wp-block-latest-posts__post-author");

//         return {
//           title: a?.innerText.trim(),
//           url: a?.href,
//           author: author?.innerText.replace("by", "").trim()
//         };
//       })
//   );

//   for (const blog of blogs) {
//     const p = await browser.newPage();
//     try {
//       await p.goto(blog.url, { waitUntil: "domcontentloaded" });
//       await delay(2000);

//       const raw = await p.evaluate(() => {
//         const container =
//           document.querySelector("main") ||
//           document.querySelector("article");

//         if (!container) return "";

//         return Array.from(container.querySelectorAll("p"))
//           .map(p => p.innerText.trim())
//           .join("\n\n");
//       });

//       const content = cleanContent(raw);
//       if (!content) continue;

//       await Article.create({
//         title: blog.title,
//         author: blog.author,
//         url: blog.url,
//         originalContent: raw,
//         content
//       });

//       console.log("Saved:", blog.title);
//     } finally {
//       await p.close();
//     }
//   }

//   await browser.close();
//   process.exit();
// }

// scrapeBlogs();
