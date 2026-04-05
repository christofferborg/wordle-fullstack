const wordPicker = require("../wordPicker.js");

const mockWordList = ["piano", "ball", "house", "apple"];

test("Should return a 5 letter word without duplicates", () => {
  const length = 5;
  const unique = true;
  const expectedOptions = ["piano", "house"];

  const result = wordPicker(mockWordList, length, unique);
  expect(expectedOptions).toContain(result);
});
