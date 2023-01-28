const log = require('fancy-log');
const app = require('./app');
const models = require('./src/models');
require('dotenv').config();

function checkEnv () {
  const { DB_FILE, PORT, JWT_SECRET } = process.env;

  if (!DB_FILE) {
    throw (new Error('DB_FILE env is missing'));
  }

  if (!PORT) {
    throw (new Error('PORT env is missing'));
  }

  if (!JWT_SECRET) {
    throw (new Error('JWT_TOKEN env is missing'));
  }
}

(async () => {
  try {
    checkEnv();
    const connection = models.connectDatabase(process.env.DB_FILE);
    await models.initDatabase(connection);
  } catch (error) {
    log.error(error);
    process.exit(1);
  }

  app.listen(process.env.PORT);
})();
