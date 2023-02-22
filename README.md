# Codersquare
- Codersquare is a social web app for sharing learning resources in [hacker news](https://news.ycombinator.com/) style by making posts with avilability to comments on as well as votes/likes.
- It's and implementation of the original [Codersquare](https://github.com/yebrahim/codersquare) project in javascript and nodejs with express.

## Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Sequelize to be used as an ORM.

### Auth

A JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database.

### API
The API is described in detail in this [OpenAPI documentation](https://app.swaggerhub.com/apis-docs/IslamWalid/codersquare/1.0.0)
 
**Users:**
```
/users/login  [POST]
/users/signup [POST]
/users/logout [GET]
```
**Posts:**
```
/posts/:id [GET]
/posts/:id [DELETE]
/posts/    [POST]
/posts/    [GET] 
```
**Comments:**
```
/comments/:postid [GET]
/comments/:id     [DELETE]
/comments/        [POST]
```
**Likes:**
```
/likes/:postid  [GET]
/likes/         [DELETE]
/likes/         [POST]
```

## Storage

### Database

A relational database (schema follows) to fast retrieval of posts and
comments. A minimal database implementation such as [sqlite3](https://sqlite.org/index.html) suffices.

### Schema
**Users**:
| Column | Type |
|--------|------|
| ID    | STRING/UUID |
| username | STRING |
| email | STRING |
| firstName | STRING |
| lastName | STRING |
| password | STRING |
| loggedIn | BOOLEAN |

**Posts**:
| Column | Type |
|--------|------|
| ID | STRING/UUID |
| title | STRING |
| body | STRING |
| userId | STRING/UUID |
| createdAt | Timestamp |

**Likes**:
| Column | Type |
|--------|------|
| userId | STRING/UUID |
| postId | STRING/UUID |

**Comments**:
| Column | Type |
|---------|------|
| ID | STRING |
| userId | STRING/UUID |
| postId | STRING/UUID |
| body | STRING |
| createdAt | Timestamp |

## How to use
- **First you need to clone the repo:**
```sh
$ git clone https://github.com/IslamWalid/codersquare.git
```
- **Install dependencies**
```sh
$ npm install 
```
- **Start server**
```sh
$ npm start
```
**NOTE:** you need to specify the following environment variables:

- `JWT_SECRET`: string used by jwt to encode and decode tokens
- `DB_FILE`: sqlite database file path
- `PORT`: listening port
