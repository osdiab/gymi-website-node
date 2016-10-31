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
  db.createTable('primary_user_topics', {
    user_id: {
      type: 'int', notNull: true, unique: true,
      foreignKey: {

        name: 'primary_user_topics_user_id_fk',
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

        name: 'primary_user_topics_topic_id_fk',
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
  db.dropTable('primary_user_topics', callback);
};

exports._meta = {
  "version": 1
};
