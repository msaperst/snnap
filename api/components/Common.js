function parseIntAndDbEscape(input) {
  const number = parseInt(input, 10);
  if (Number.isNaN(number)) {
    throw new Error('Invalid User Input');
  }
  return number;
}

module.exports = parseIntAndDbEscape;
