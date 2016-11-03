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
  db.createTable('user_interests', {
    user_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'user_interests_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    topic_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'user_interests_topic_id_fk',
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

    db.addIndex('user_interests', 'user_interests_uniq', ['user_id', 'topic_id'], callback);
  });
};

exports.down = function(db, callback) {
  db.dropTable('user_interests', callback);
};

exports._meta = {
  "version": 1
};
