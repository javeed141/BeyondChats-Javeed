const Article = require("../models/Article");
const { searchGoogleAndScrape } = require("../scrapers/googleScraper");
const { rewriteArticle } = require("../utils/llm");

// CREATE
exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to create article" });
  }
};

// READ ALL
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// READ ONE
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  } catch {
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

// UPDATE
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  } catch {
    res.status(500).json({ error: "Failed to update article" });
  }
};

// DELETE
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete article" });
  }
};

// 🔥 UPDATE FROM GOOGLE (WORKING)
// const Article = require("../models/Article");
// const { searchGoogleAndScrape } = require("../scrapers/googleScraper");
// const { rewriteArticle } = require("../utils/llm");

exports.updateFromGoogle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Exclude original article domain
    let excludeDomain = null;
    try {
      excludeDomain = new URL(article.url).hostname;
    } catch {}

    // 1️⃣ Google search + scrape (SerpAPI)
    const references = await searchGoogleAndScrape(
      article.title,
      excludeDomain
    );

    // 🟡 Safe fallback if no references found
    if (!references || references.length === 0) {
      const updated = await Article.findByIdAndUpdate(
        article._id,
        { references: [] },
        { new: true }
      );

      return res.json({
        updated,
        references: [],
        message: "No external references available"
      });
    }

    // 2️⃣ Prepare original content
    const originalContent =
      article.originalContent || article.content || "";

    // 3️⃣ Send to LLM
    const rewritten = await rewriteArticle(
      {
        title: article.title,
        originalContent
      },
      references
    );

    // 4️⃣ Normalize LLM output (ARRAY → STRING)
    let finalContent = "";

    if (Array.isArray(rewritten?.content)) {
      finalContent = rewritten.content.join("\n\n");
    } else if (typeof rewritten?.content === "string") {
      finalContent = rewritten.content;
    } else if (typeof rewritten === "string") {
      finalContent = rewritten;
    } else {
      finalContent = article.content || "";
    }

    // 5️⃣ Update DB (IMPORTANT PART)
    const updated = await Article.findByIdAndUpdate(
      article._id,
      {
        content: finalContent,           // for UI
        updatedContent: finalContent,    // ✅ REQUIRED
        originalContent,
        references: references.map(r => r.url)
      },
      { new: true }
    );

    return res.json({
      updated,
      references: references.map(r => r.url)
    });

  } catch (err) {
    console.error("UpdateFromGoogle error:", err);
    return res.status(500).json({
      error: "Update from Google failed"
    });
  }
};

