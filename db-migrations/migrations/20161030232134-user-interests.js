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
  db.createTable('userInterests', {
    userId: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'userInterests_userId_fk',
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

        name: 'userInterests_topicId_fk',
        table: 'topics',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
  }, (err) => {
    if (err) {
      callback(err);
      return;
    }

    db.addIndex('userInterests', 'userInterests_uniq', ['userId', 'topicId'], true, callback);
  });
};

exports.down = function(db, callback) {
  db.dropTable('userInterests', callback);
};

exports._meta = {
  "version": 1
};
