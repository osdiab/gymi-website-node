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
  db.createTable('active_users', {
    user_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'active_users_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    period_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'active_users_period_id_fk',
        table: 'periods',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('active_users', callback);
};

exports._meta = {
  "version": 1
};
