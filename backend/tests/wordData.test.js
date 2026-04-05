const filteredWords = require("../wordService");

test("Real word list should only contain valid words", () => {
  expect(filteredWords.length).toBeGreaterThan(0);
  const invalidWords = filteredWords.filter(
    (word) => word.length < 4 || word.length > 8 || /[^a-zA-Z]/.test(word),
  );

  expect(invalidWords.length).toBe(0);
});
