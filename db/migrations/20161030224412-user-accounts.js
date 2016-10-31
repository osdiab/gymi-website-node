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
  db.createTable('user_profiles', {
    user_id: {
      type: 'int', notNull: true, unique: true,
      foreignKey: {

        name: 'user_profiles_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    name: { type: 'string', notNull: true },
    role: { type: 'string', notNull: true },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_profiles', callback);
};

exports._meta = {
  "version": 1
};
