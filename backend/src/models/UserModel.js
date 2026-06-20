const { db } = require('../config/database');

class UserModel {
  static findByEmail(email) {
    return db('users').where({ email }).first();
  }

  static findById(id) {
    return db('users').where({ id }).first();
  }
}

module.exports = UserModel;
