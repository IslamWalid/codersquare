const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './DB_FILE.db'
})

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
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
})

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
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false
})

const Like = sequelize.define('Like', {}, {
  timestamps: false
})

const Comment = sequelize.define('Comment', {
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false
})

User.hasMany(Post, { onDelete: 'CASCADE' })
Post.belongsTo(User, { onDelete: 'CASCADE' })

User.belongsToMany(Post, { through: Like })
Post.belongsToMany(User, { through: Like })

User.belongsToMany(Post, { through: Comment })
Post.belongsToMany(User, { through: Comment })

async function initDatabase () {
  await sequelize.sync()
}

module.exports = {
  User,
  Post,
  Like,
  Comment,
  initDatabase
}
