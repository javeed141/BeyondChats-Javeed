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
exports.updateFromGoogle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    let excludeDomain = null;
    try {
      excludeDomain = new URL(article.url).hostname;
    } catch {}

    // ✅ ALWAYS RETURNS URLs
    const refs = await searchGoogleAndScrape(article.title, excludeDomain, 3);
    const referenceUrls = refs.map(r => r.url);

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { references: referenceUrls },
      { new: true }
    );

    res.json({
      updated,
      references: referenceUrls,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google update failed" });
  }
};
