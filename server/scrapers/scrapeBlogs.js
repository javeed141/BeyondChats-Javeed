const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
require("dotenv").config();

const Article = require("../models/Article");

const URL = "https://beyondchats.com/blogs/";

async function scrapeBlogs() {
  await mongoose.connect(process.env.MONGO_URI);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Open page
  await page.goto(URL, {
    waitUntil: "networkidle2"
  });

  // Wait for blog cards to load
  await page.waitForSelector("a");

  // Extract articles from browser DOM
  const articles = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll("a"));
    
    return items
      .filter(a => a.href.includes("/blog"))
      .slice(-5)
      .map(a => ({
        title: a.innerText.trim(),
        url: a.href,
        content: "TO BE SCRAPED LATER"
      }));
  });

  if (articles.length === 0) {
    console.log("❌ No articles found");
  } else {
    await Article.insertMany(articles);
    console.log("✅ Oldest articles saved");
  }

  console.log(articles);

  await browser.close();
  process.exit();
}

scrapeBlogs();
