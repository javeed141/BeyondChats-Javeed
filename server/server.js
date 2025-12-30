require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const articleRoutes = require("./routes/articleRoutes");

const app = express();
// app.use(cors());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://beyondchats-javeed.onrender.com",
  "https://beyond-chats-javeed.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.use("/api/articles", articleRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
