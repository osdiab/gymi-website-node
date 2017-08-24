/**
 * Helpers and types related to submissions
 */

import {Id} from 'common/entities';
import {User} from 'common/users';

export type Submission = {
  id: Id,
  timestamp: Date,
  answers: Answer[],
  user: User
};

export type Answer = {
  answer: string,
  questionId: Id,
  question: string,
  questionArchived: boolean
};
