function wordPicker(list, length, unique) {
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

module.exports = wordPicker;
