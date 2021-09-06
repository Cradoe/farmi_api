require( 'dotenv' ).config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "host": process.env.HOST,
    "dialect": "mysql",
    "pool": {

      max: 5,

      min: 0,

      acquire: 30000,

      idle: 10000

    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "pool": {

      max: 5,

      min: 0,

      acquire: 30000,

      idle: 10000

    }
  }
  ,
  "production": {
    "username": "ba9ebd506c114f",
    "password": "8e3138ec",
    "database": "heroku_df536a102839664",
    "host": "us-cdbr-east-04.cleardb.com",
    "dialect": "mysql",
    "pool": {

      max: 5,

      min: 0,

      acquire: 30000,

      idle: 10000

    }
  }
}