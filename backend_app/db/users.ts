/**
 * Database methods related to retrieving and updating users.
 */

// tslint:disable-next-line
// TODO: don't throw ApplicationErrors from here, db shouldn't know about app logic

import * as _ from 'lodash';

import db from 'backend/db';
import periodsDb from 'backend/db/periods';
import { ApplicationError } from 'backend/errors';
import {Id} from 'common/entities';
import {Role} from 'common/roles';

export const PUBLIC_USER_FIELDS = ['id', 'username', 'role', 'name'];
export const VALID_LIST_FILTERS = ['primaryInterest', 'period'];

export interface IPublicUser {
  id: Id;
  username: string;
  role: Role;
  name: string;
}

export interface IFullUser extends IPublicUser {
  passwordHash: string;
}

export function toPublicUser(user: IFullUser): IPublicUser {
  return _.pick(user, PUBLIC_USER_FIELDS);
}

// flexible find function—can search for id or username.
// Returns one entry, or null.
async function find(identifier: (Id | string), getPasswordHash: true): Promise<IFullUser>;
async function find(identifier: (Id | string), getPasswordHash: false): Promise<IPublicUser>;
async function find(identifier: (Id | string), getPasswordHash: boolean) {
  const columns = getPasswordHash ? PUBLIC_USER_FIELDS.concat('passwordHash') :
    PUBLIC_USER_FIELDS;
  const normalizedUsername = typeof identifier === 'number' ? identifier : identifier.toLowerCase();
  const clause = (typeof identifier !== 'number') ? '"normalizedUsername" = $<id>' : 'id = $<id>';
  const query = `SELECT $<columns:name> FROM users WHERE ${clause}`;

  return await db.oneOrNone(query, { columns, id: normalizedUsername });
}

interface IFilter {
  primaryInterest?: Id | Id[];
  period?: Id | Id[];
}

interface IFilterStrict {
  primaryInterest?: Id[];
  period?: Id[];
}

interface IDbClause {
  key: 'primaryInterests' | 'periods';
  clause: string;
  value: Id[];
}

export default {
  create: async (
    username: string, passwordHash: string, name: string, role: Role
  ) => {
    if (!isNaN(Number(username))) {
      throw new ApplicationError('Username cannot be a number', 400);
    }

    const existingUser = await find(username, false);
    if (existingUser) {
      throw new ApplicationError('User already exists', 400);
    }

    const periods = await periodsDb.list();
    const latestPeriodId = Math.max(...periods.map(period => period.id));

    const {userId} = await db.tx(tx =>
      tx.one(
        'INSERT INTO users (username, "normalizedUsername", "passwordHash", name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [username, username.toLowerCase(), passwordHash, name, role]
      ).then(user => tx.one(
        'INSERT INTO "activeUsers" ("userId", "periodId") VALUES ($1, $2) RETURNING "userId"',
        [user.id, latestPeriodId]
      ))
    );

    return userId;
  },

  find,
  list: (filters: IFilter) => new Promise((resolve, reject) => {
    const normalizedFilters: IFilterStrict = _(filters).mapValues(
      val => (_.isArray(val) ? val : [val])
    ).value();
    const whereClauses = Object.keys(normalizedFilters).reduce(
      (memo, key) => {
        switch (key) {
          case 'primaryInterest':
            if (normalizedFilters.primaryInterest) {
              return memo.concat({
                key: 'primaryInterests',
                clause: '"topicId" IN ($<primaryInterests:csv>)',
                value: normalizedFilters.primaryInterest
              });
            }
          case 'period':
            if (normalizedFilters.period) {
              return memo.concat({
                key: 'periods',
                clause: '"periodId" IN ($<periods:csv>)',
                value: normalizedFilters.period
              });
            }
          default:
            return memo;
        }
      },
      <IDbClause[]>[]);

    const columns = PUBLIC_USER_FIELDS.concat(
      '"topicId" AS "primaryInterestId"',
      '"periodId"'
    );
    const completeClauses = whereClauses.map(entry => entry.clause).join(' AND ');
    const query = `
      SELECT ${columns.join(', ')}
      FROM users
      LEFT OUTER JOIN "primaryUserInterests" ON "primaryUserInterests"."userId" = users.id
      LEFT OUTER JOIN "activeUsers" ON "activeUsers"."userId" = users.id
      ${completeClauses.length > 0 ? `WHERE ${completeClauses}` : ''}`;
    const queryArgs = _.chain(whereClauses).mapKeys('key').mapValues('value').value();

    return db.manyOrNone(query, queryArgs).then((results) => {
      // query returns redundant entries with different periods;
      // combine the periods active into an array
      const combined = results.reduce(
        (memo, entry) => {
          if (memo[entry.id]) {
            const updatedEntry = memo[entry.id];
            updatedEntry.periodsActive = updatedEntry.periodsActive.concat(entry.periodId);

            return {...memo, [entry.id]: updatedEntry};
          }

          const newEntry = {
            ..._.omit(entry, ['periodId']),
            periodsActive: entry.periodId === null ? [] : [entry.periodId]
          };

          return {...memo, [entry.id]: newEntry };
        },
        {});
      resolve(_.values(combined));
    }).catch(reject);
  }),

  setPassword: (id: Id, newPasswordHash: string) => new Promise((resolve, reject) => {
    db.one(
      'UPDATE users SET "passwordHash" = $1 WHERE id = $2',
      [newPasswordHash, id]
    ).then(resolve).catch(reject);
  })
};
