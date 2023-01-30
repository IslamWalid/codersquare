const { Model, DataTypes } = require('sequelize');

class Post extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      timestamps: true,
      createdAt: true,
      updatedAt: false,
      deletedAt: false
    });
  }
}

module.exports = Post;
