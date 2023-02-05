const fs = require('fs/promises');
const { Sequelize } = require('sequelize');

const connectDatabase = (dbFile) => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: dbFile,
    dialectOptions: {
      foreign_keys: 'ON'
    }
  });
};

const initDatabase = async (sequelize) => {
  const modelsDir = await fs.readdir('./src/models');

  modelsDir
    .filter((file) => file !== 'index.js')
    .map((file) => {
      const model = require(`./${file}`);
      model.init(sequelize);

      return model;
    })
    .forEach((model) => {
      model.initAssociations();
    });

  await sequelize.sync();
};

module.exports = {
  connectDatabase,
  initDatabase
};
