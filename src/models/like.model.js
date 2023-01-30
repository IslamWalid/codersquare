const { Model, DataTypes } = require('sequelize');

class Like extends Model {
  static init (sequelize) {
    super.init({
      userId: {
        primaryKey: true,
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      postId: {
        primaryKey: true,
        type: DataTypes.UUID,
        references: {
          model: 'Posts',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      timestamps: false
    });
  }
}

module.exports = Like;
