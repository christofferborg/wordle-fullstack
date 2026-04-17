import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import app, { Game } from "../src/app";

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/wordleTestDB");
});

describe("POST /api/games/guess", () => {
  test("should return 404 if game does not exist", async () => {
    const response = await request(app).post("/api/games/guess").send({
      id: "65f1a2b3c4d5e6f7a8b9c0d1",
      guess: "CYKLA",
    });

    expect(response.status).toBe(404);
  });

  test("should return 200 if there is an active game", async () => {
    const testGame = new Game({ correctWord: "BIKING", guesses: [] });
    await testGame.save();
    const response = await request(app)
      .post("/api/games/guess")
      .send({ id: testGame._id, guess: "BIKING" });

    expect(response.status).toBe(200);
  });

  test("should stop the game if user guess the right word", async () => {
    const testGame = new Game({ correctWord: "TREES", guesses: [] });
    await testGame.save();
    const response = await request(app)
      .post("/api/games/guess")
      .send({ id: testGame._id, guess: "TREES" });
    const updatedGame = await Game.findById(testGame._id);
    expect(updatedGame?.isFinished).toBe(true);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
