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
  db.createTable('submissionAnswers', {
    body: { type: 'string', notNull: true },
    submissionId: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'submissionAnswers_submissionId_fk',
        table: 'submissions',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      },
    },
    questionId: {
      type: 'int', notNull: true,
      foreignKey: {

        name: 'submissionAnswers_questionId_fk',
        table: 'submissionQuestions',
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
  db.dropTable('submissionAnswers', callback);
};

exports._meta = {
  "version": 1
};
