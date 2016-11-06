'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
    username: { type: 'string', unique: true, notNull: true },
    normalizedUsername: { type: 'string', unique: true, notNull: true },
    passwordHash: { type: 'char', length: '60', notNull: true },
    name: { type: 'string', notNull: true },
    role: { type: 'string', notNull: true },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};

exports._meta = {
  'version': 1
};
