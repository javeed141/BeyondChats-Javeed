const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  url: String,
  isUpdated: { type: Boolean, default: false },
  references: [String],
}, { timestamps: true });

module.exports = mongoose.model("Article", ArticleSchema);
