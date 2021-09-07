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
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "pool": {

      max: 5,

      min: 0,

      acquire: 30000,

      idle: 10000

    }
  }
}