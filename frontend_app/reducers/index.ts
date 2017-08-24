/**
 * Specifies the global state of the application and how it can change as
 * actions arrive.
 *
 * Combines a number of smaller Redux reducers into a larger one.
 */
import { combineReducers } from 'redux';

import interests, {IState as IInterestsState} from 'frontend/reducers/interests';
import language, {IState as ILangaugeState} from 'frontend/reducers/language';
import modal, {IState as IModalState} from 'frontend/reducers/modal';
import periods, {IState as IPeriodsState} from 'frontend/reducers/periods';
import session, {IState as ISessionState} from 'frontend/reducers/session';
import submissionQuestions, {
  IState as ISubmissionQuestionsState
} from 'frontend/reducers/submissionQuestions';
import submissions, {IState as ISubmissionsState} from 'frontend/reducers/submissions';
import topics, {IState as ITopicsState} from 'frontend/reducers/topics';
import users, {IState as IUsersState} from 'frontend/reducers/users';

export interface IState {
  readonly interests: IInterestsState;
  readonly language: ILangaugeState;
  readonly modal: IModalState;
  readonly periods: IPeriodsState;
  readonly session: ISessionState;
  readonly submissionQuestions: ISubmissionQuestionsState;
  readonly submissions: ISubmissionsState;
  readonly topics: ITopicsState;
  readonly users: IUsersState;
}

export default combineReducers<IState>({
  language,
  session,
  interests,
  submissions,
  submissionQuestions,
  topics,
  users,
  modal,
  periods
});
