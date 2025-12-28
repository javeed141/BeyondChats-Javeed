const Article = require("../models/Article");

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
