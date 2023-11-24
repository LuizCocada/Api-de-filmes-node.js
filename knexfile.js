const patch = require("path");

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: patch.resolve(__dirname, "src", "database", "database.db")
    },
    pool:{
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)// habilitar o onDelete em cascata
    },
    migrations: {
      directory: patch.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    useNullAsDefault: true
  }
};
