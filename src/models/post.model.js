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

  static initAssociations () {
    const User = this.sequelize.models.User;
    const Like = this.sequelize.models.Like;
    const Comment = this.sequelize.models.Comment;

    this.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
    this.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
    this.belongsTo(User, { as: 'postAuthor', foreignKey: 'userId', onDelete: 'CASCADE' });
  }
}

module.exports = Post;
