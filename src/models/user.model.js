const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      loggedIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      timestamps: false
    });
  }

  static initAssociations () {
    const Post = this.sequelize.models.Post;
    const Like = this.sequelize.models.Like;
    const Comment = this.sequelize.models.Comment;

    this.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
    this.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
    this.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  }
}

module.exports = User;
