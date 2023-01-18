const db = require('mysql');
const Mysql = require('../services/Mysql');

module.exports = {
  parseIntAndDbEscape,
  handleNewSkill,
};

function parseIntAndDbEscape(input) {
  const number = parseInt(input, 10);
  if (Number.isNaN(number)) {
    throw new Error('Invalid User Input');
  }
  return number;
}

async function handleNewSkill(skill, userId) {
  // if 'new' skill, create it
  if (skill.value.toString().indexOf('new') === 0) {
    const result = await Mysql.query(
      `INSERT INTO skills (name, who, date_created) VALUES (${db.escape(
        skill.label
      )}, ${parseIntAndDbEscape(userId)}, CURRENT_TIMESTAMP);`
    );
    return result.insertId;
  }
  return skill.value;
}
