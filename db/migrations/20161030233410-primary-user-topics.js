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
  db.createTable('primaryUserInterests', {
    userId: {
      type: 'int', notNull: true, unique: true,
      foreignKey: {

        name: 'primaryUserInterests_userId_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    topicId: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'primaryUserInterests_topicId_fk',
        table: 'topics',
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
  db.dropTable('primaryUserInterests', callback);
};

exports._meta = {
  "version": 1
};
