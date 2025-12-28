const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    url: String,

    content: String,      // this will hold the CURRENT article content
    references: [String]  // Google reference links (Phase-2)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
