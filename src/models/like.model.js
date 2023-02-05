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

  static initAssociations () {
    const User = this.sequelize.models.User;
    const Post = this.sequelize.models.Post;

    this.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });
    this.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
  }
}

module.exports = Like;
