import { WordPickerOptions } from "./types";

function wordPicker(
  list: string[],
  length: number,
  unique: boolean,
): string | null {
  let filteredList = list.filter((word) => word.length === length);
  if (unique) {
    filteredList = filteredList.filter((word) => {
      return new Set(word).size === word.length;
    });
  }
  const randomIndex = Math.floor(Math.random() * filteredList.length);
  if (filteredList.length === 0) {
    return null;
  }
  return filteredList[randomIndex];
}

export default wordPicker;
