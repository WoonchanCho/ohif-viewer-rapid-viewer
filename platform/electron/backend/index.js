const express = require('express');
const path = require('path');
const fs = require('fs');
let app;

const MAX_TRY = 10;
const WAIT_MS = 5000;

async function beginServer() {
  app = express();
  const staticFolder = path.resolve(__dirname, '..', 'public');

  app.use(express.static(staticFolder));

  // check if index.html exists in the public folder.
  checkIndex(staticFolder);

  // fallback to index.html
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(staticFolder, 'index.html'));
  });

  let listener = undefined;
  for (let i = 0; i < MAX_TRY; ++i) {
    try {
      listener = await listen(app);
    } catch (error) {
      console.error(error.message);
      console.error(`Will retry in ${WAIT_MS / 1000} seconds`);
      await sleep(WAIT_MS);
    }
  }
  return listener;
}

function listen(app, port) {
  return new Promise((resolve, reject) => {
    const listener = app.listen(port ? port : 0, () => {
      resolve(listener);
    });
    listener.on('error', error => {
      reject(error);
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function checkIndex(staticFolder) {
  if (!fs.existsSync(staticFolder)) {
    throw new Error(`public directory doesn't exist: ${staticFolder}`);
  }

  if (!fs.existsSync(path.join(staticFolder, 'index.html'))) {
    throw new Error(`index.html doesn't exist in ${staticFolder}`);
  }
}

module.exports = beginServer;
