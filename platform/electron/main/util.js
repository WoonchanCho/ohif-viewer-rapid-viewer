const fs = require('fs');
const { CONF_FILENAME } = require('./constant');

function isDev() {
  return (
    process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development'
  );
}

function getRecentLoginInfo() {
  try {
    const data = fs.readFileSync(CONF_FILENAME, {
      encoding: 'utf8',
      flag: 'r',
    });

    const tokens = data.split('\n');
    return {
      xnatUrl: tokens[0],
      username: tokens.length > 1 ? tokens[1] : undefined,
    };
  } catch (error) {
    return {
      xnatUrl: '',
      username: '',
    };
  }
}

function saveLoginInfo({ xnatUrl, username }) {
  try {
    fs.writeFileSync(CONF_FILENAME, `${xnatUrl}\n${username}`);
  } catch (error) {
    console.error('Failed to save conf file.');
  }
}

function getScreenSize() {
  const { width, height } = require('electron').screen.getPrimaryDisplay().size;
  return { width, height };
}

module.exports = {
  isDev,
  getRecentLoginInfo,
  saveLoginInfo,
  getScreenSize,
};
