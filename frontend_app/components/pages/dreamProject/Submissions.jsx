import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import _ from 'lodash';

import messages from '../../../messages';
import LoadingSpinner from '../../LoadingSpinner';
import './Submissions.less';

export default function Submissions({ submissions, displayMetadata }) {
  return (
    <div className="Submissions">
      { _.isArray(submissions) ? (
        <ul className="Submissions--submissions">
          {submissions.length === 0 && <p>
            <FormattedMessage {...messages.dreamProject.profile.submissions.none} />
          </p>}
          { submissions.map(s => (
            <li key={s.id}>
              <div className="Submissions--gutter">
                <div className="Submissions--gutter--circle" />
              </div>
              { displayMetadata === 'date' &&
                <div className="Submissions--metadata">
                  <h4><FormattedDate month="long" value={s.timestamp} /></h4>
                  <time className="Submissions--metadata--subtext">
                    <FormattedDate
                      month="numeric" day="numeric" year="numeric"
                      value={s.timestamp}
                    />
                  </time>
                </div>
              }
              { displayMetadata === 'user' &&
                <div className="Submissions--metadata">
                  <h4>{s.user.name}</h4>
                  <span className="Submissions--metadata--subtext">
                    {s.user.primaryInterest.title}
                  </span>
                </div>
              }
              <div className="Submissions--answers">
                {s.answers.map(a =>
                  <div className="Submissions--answer" key={a.questionId}>
                    <p className="Submissions--question">{a.question}</p>
                    <p>{a.answer}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="Submissions--no-data">
          { submissions.loading ? <LoadingSpinner /> :
            <FormattedMessage {..._.get(messages, submissions.error)} />
          }
        </div>
      )}
    </div>
  );
}

export const submissionType = PropTypes.shape({
  id: PropTypes.number,
  answers: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string,
    answer: PropTypes.string,
  })),
  timestamp: PropTypes.instanceOf(Date),
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    primaryInterest: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  }),
});

Submissions.propTypes = {
  submissions: PropTypes.oneOfType([
    PropTypes.arrayOf(submissionType),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
  ]).isRequired,
  displayMetadata: PropTypes.oneOf(['date', 'user']).isRequired,
};

