const express = require("express");
const router = express.Router();
const controller = require("../controllers/articleController");

router.post("/", controller.createArticle);
router.get("/", controller.getArticles);
router.get("/:id", controller.getArticle);
router.post("/:id/update-from-google", controller.updateFromGoogle);
router.put("/:id", controller.updateArticle);
router.delete("/:id", controller.deleteArticle);

module.exports = router;
