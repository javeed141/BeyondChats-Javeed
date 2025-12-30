require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors({
  origin: "https://beyond-chats-javeed.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const articleRoutes = require("./routes/articleRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/articles", articleRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
