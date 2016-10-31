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
  db.createTable('submission_answers', {
    body: { type: 'string', notNull: true },
    submission_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'submission_answers_submission_id_fk',
        table: 'submissions',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    question_id: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'submission_answers_question_id_fk',
        table: 'submission_questions',
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
  db.dropTable('submission_answers', callback);
};

exports._meta = {
  "version": 1
};
