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
  db.createTable('submissions', {
    id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
    timestamp: { type: 'timestamp', notNull: true },
    user_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'submissions_user_id_fk',
        table: 'users',
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
  db.dropTable('submissions', callback);
};

exports._meta = {
  "version": 1
};
