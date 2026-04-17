import app from './app'
import mongoose, { Schema, Document } from "mongoose";

const PORT = 5080;

mongoose
  .connect("mongodb://localhost:27017/wordleDB")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Servern körs på http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("Could not connect to MongoDB", err.message);
  });
