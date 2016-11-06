import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedDate, intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';

import LoadingSpinner from '../../LoadingSpinner';
import Submissions, { submissionType } from './Submissions';
import { createSubmission as createSubmissionAction } from '../../../actions';
import messages from '../../../messages';
import Button from '../../Button';
import './DreamProjectHomePage.less';

function generateFormId(id) {
  return `DreamProjectHomePage--newSubmission--${id}`;
}

export class DreamProjectHomePageView extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.state = {
      formIsValid: false,
      validationError: null,
    };
  }

  componentWillMount() {
    this.props.loadSubmissions(this.props.user.id, this.props.token);
    this.props.loadSubmissionQuestions(this.props.user.id, this.props.token);
  }

  validateForm() {
    for (const q of this.props.submissionQuestions) {
      const input = this[generateFormId(q.id)];
      if (input.value.length < 1) {
        this.setState({
          formIsValid: false,
          validationError: 'messages.errors.newSubmission.missingAnswer',
        });
        return false;
      }
    }
    this.setState({
      formIsValid: true,
      validationError: null,
    });
    return true;
  }

  handleSubmit() {
    if (!this.validateForm()) {
      return;
    }
    const { user, createSubmission, token, submissionQuestions } = this.props;
    const answers = submissionQuestions.map(q => ({
      questionId: q.id,
      answer: this[generateFormId(q.id)].value,
    }));
    createSubmission(user.id, token, answers);
  }

  render() {
    const {
      submissions, submissionQuestions, intl, createdSubmission, creatingSubmission,
    } = this.props;
    return (
      <div className="DreamProjectHomePage">
        {this.state.validationError && <p className="DreamProjectHomePage--newSubmission--errors">
          <FormattedMessage {..._.get(messages, this.state.validationError)} />
        </p>}
        { submissionQuestions !== 'not loaded' && (
          submissionQuestions.loading ?
            <LoadingSpinner />
          :
            <form onSubmit={this.handleSubmit} refs={(f) => { this.submissionForm = f; }}>
              <p>
                <FormattedMessage
                  {...messages.newSubmission.submissionForDate}
                  values={{
                    date: <FormattedDate month="long" day="numeric" year="numeric" value={new Date()} />,
                  }}
                />
              </p>
              <ul>
                {submissionQuestions.map(q => (
                  <li key={q.id}>
                    <label htmlFor={generateFormId(q.id)}>
                      ${q.title}
                    </label>
                    <input
                      type="text"
                      id={generateFormId(q.id)}
                      placeholder={intl.formatMessage(messages.newSubmission.inputPlaceholder)}
                      maxLength={200}
                      onChange={this.validateForm}
                      ref={(i) => { this[generateFormId(q.id)] = i; }}
                    />
                  </li>
                ))}
              </ul>
              <Button
                disabled={createdSubmission || !this.state.formIsValid} onClick={this.handleSubmit}
              >
                { creatingSubmission ? <LoadingSpinner /> : (
                  createdSubmission ?
                    <FormattedMessage {...messages.newSubmission.submitted} />
                  :
                    <FormattedMessage {...messages.newSubmission.submit} />
                )}

              </Button>
            </form>
          )
        }

        { submissions !== 'not loaded' &&
          <Submissions
            submissions={submissions}
            displayMetadata="user"
          />
        }
      </div>
    );
  }
}

DreamProjectHomePageView.propTypes = {
  intl: intlShape,
  createSubmission: PropTypes.func.isRequired,
  createdSubmission: PropTypes.bool.isRequired,
  creatingSubmission: PropTypes.bool.isRequired,
  submissions: PropTypes.oneOfType([
    PropTypes.arrayOf(submissionType),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
    PropTypes.oneOf(['not loaded']),
  ]).isRequired,
  submissionQuestions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
    PropTypes.oneOf(['not loaded']),
  ]).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  loadSubmissions: PropTypes.func.isRequired,
  loadSubmissionQuestions: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const {
    otherSubmissions, requestingOtherSubmissions, otherSubmissionsError, createdSubmission,
    creatingSubmission,
  } = state.submissions;
  const submissions =
    otherSubmissions || requestingOtherSubmissions || otherSubmissionsError ?
      (
        otherSubmissions || {
          loading: requestingOtherSubmissions,
          error: otherSubmissionsError,
        }
      ) : 'not loaded';

  const { questions, requestingQuestions, questionsError } = state.submissionQuestions;
  const submissionQuestions =
    questions || requestingQuestions || questionsError ?
      (
        questions || {
          loading: requestingQuestions,
          error: questionsError,
        }
      ) : 'not loaded';
  return {
    submissions,
    submissionQuestions,
    createdSubmission,
    creatingSubmission,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSubmission: (userId, token, answers) =>
      dispatch(createSubmissionAction(userId, token, answers)),
    loadSubmissions: PropTypes.func.isRequired,
    loadSubmissionQuestions: PropTypes.func.isRequired,
  };
}

const DreamProjectHomePage = connect(mapStateToProps, mapDispatchToProps)(DreamProjectHomePageView);

export default injectIntl(DreamProjectHomePage);
