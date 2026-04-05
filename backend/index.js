import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 5080;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/wordleDB")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Servern körs på http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err.message);
  });

const Word = mongoose.model("Word", { text: String });

app.post("/api/words", async (req, res) => {
  const newWord = new Word({ text: req.body.text });
  await newWord.save();
  res.json(newWord);
});
