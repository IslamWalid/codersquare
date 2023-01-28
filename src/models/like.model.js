const { Model } = require('sequelize');

class Like extends Model {
  static init (sequelize) {
    super.init({}, {
      sequelize,
      timestamps: false
    });
  }
}

module.exports = Like;
