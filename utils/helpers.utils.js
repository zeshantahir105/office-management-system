const isStringified = (string) => {
  try {
    return JSON.parse(string);
  } catch {
    return string;
  }
};

module.exports = {
  isStringified,
};
