const Article = require("../models/Article");
const { searchGoogleAndScrape } = require('../scrapers/googleScraper');
const { rewriteArticle } = require('../utils/llm');

exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    return res.status(201).json(article);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create article" });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    return res.json(articles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    return res.json(article);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch article" });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!article) return res.status(404).json({ error: "Article not found" });
    return res.json(article);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update article" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Article not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete article" });
  }
};

exports.updateFromGoogle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    // determine domain to exclude (so we pick other websites)
    let excludeDomain = null;
    try { excludeDomain = new URL(article.url).hostname; } catch (e) { excludeDomain = null; }

    let refs;
    try {
      refs = await searchGoogleAndScrape(article.title, excludeDomain, 3);
    } catch (e) {
      console.error('searchGoogleAndScrape failed:', e);
      return res.status(500).json({ error: 'search_failed', message: e.message || String(e) });
    }

    if (!refs || refs.length === 0) {
      console.warn('No references returned from searchGoogleAndScrape for article', req.params.id);
      // Return a non-500 response so the frontend can handle the case gracefully
      return res.status(200).json({ updated: article, references: [], message: 'No suitable references found; no update performed' });
    }

    const topTwo = refs.slice(0, 2);

    // ensure originalContent is preserved
    const originalContent = article.originalContent || article.content || '';

    let rewritten;
    try {
      rewritten = await rewriteArticle({ title: article.title, originalContent }, topTwo);
    } catch (e) {
      console.error('rewriteArticle failed:', e, e.response && e.response.data ? e.response.data : 'no response body');
      return res.status(500).json({ error: 'rewrite_failed', message: e.message || String(e), remote: e.response && e.response.data ? e.response.data : null });
    }

    const updatedFields = {
      title: rewritten.title || article.title,
      updatedContent: rewritten.content || article.content,
      content: rewritten.content || article.content,
      originalContent: originalContent,
      references: topTwo.map(r => r.url)
    };

    const updated = await Article.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    return res.json({ updated, references: topTwo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update from Google' });
  }
};
