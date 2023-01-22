const models = require('./src/models');

(async () => {
  await models.initDatabase()
})()
