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
  db.createTable('activeUsers', {
    userId: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'activeUsers_userId_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    periodId: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'activeUsers_periodId_fk',
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
  db.dropTable('activeUsers', callback);
};

exports._meta = {
  "version": 1
};
