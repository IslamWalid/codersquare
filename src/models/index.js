const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './DB_FILE.db',
  dialectOptions: {
    foreign_keys: 'ON'
  }
});

const User = sequelize.define('User', {
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
  }
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false
});

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false
});

const Like = sequelize.define('Like', {}, {
  timestamps: false
});

const Comment = sequelize.define('Comment', {
  body: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false
});

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.belongsToMany(Post, { through: Like, foreignKey: 'userId', otherKey: 'postId' });
Post.belongsToMany(User, { through: Like, foreignKey: 'postId', otherKey: 'userId' });

User.belongsToMany(Post, { through: Comment, foreignKey: 'userId', otherKey: 'postId' });
Post.belongsToMany(User, { through: Comment, foreignKey: 'postId', otherKey: 'userId' });

async function initDatabase () {
  await sequelize.sync();
}

module.exports = {
  User,
  Post,
  Like,
  Comment,
  initDatabase
};
