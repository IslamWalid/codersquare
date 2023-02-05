const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
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
      postId: {
        type: DataTypes.UUID,
        references: {
          model: 'Posts',
          key: 'id'
        }
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

  static initAssociations () {
    const User = this.sequelize.models.User;
    const Post = this.sequelize.models.Post;

    this.belongsTo(User, { as: 'commentAuthor', foreignKey: 'userId', onDelete: 'CASCADE' });
    this.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
  }
}

module.exports = Comment;
