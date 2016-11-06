import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Interests, { interestType } from './Interests';
import Submissions, { submissionType } from './Submissions';
import { loadOwnSubmissions, loadOwnInterests } from '../../../actions';

import './DreamProjectProfilePage.less';

export class DreamProjectProfilePageView extends React.Component {
  componentWillMount() {
    this.props.loadSubmissions(this.props.user.id, this.props.token);
    this.props.loadInterests(this.props.user.id, this.props.token);
  }
  render() {
    const { user, interests, submissions } = this.props;
    return (
      <div className="DreamProjectProfilePage">
        <div className="DreamProjectProfilePage--user">
          <h2>{user.name}</h2>
          <span>{user.username}</span>
        </div>
        { interests !== 'not loaded' &&
          <Interests interests={interests} />
        }
        { submissions !== 'not loaded' &&
          <Submissions submissions={submissions} displayMetadata="date" />
        }
      </div>
    );
  }
}

DreamProjectProfilePageView.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  interests: PropTypes.oneOfType([
    PropTypes.shape({
      otherInterests: PropTypes.arrayOf(interestType).isRequired,
      primaryInterest: interestType.isRequired,
    }),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
    PropTypes.oneOf(['not loaded']),
  ]),
  submissions: PropTypes.oneOfType([
    PropTypes.arrayOf(submissionType),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
    PropTypes.oneOf(['not loaded']),
  ]),
  loadInterests: PropTypes.func.isRequired,
  loadSubmissions: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

function mapStateToProps(state) {
  const { ownInterests, requestingOwnInterests, ownInterestsError } = state.interests;
  const interests =
    ownInterests || requestingOwnInterests || ownInterestsError ? (
      state.interests.ownInterests || {
        loading: state.interests.requestingOwnInterests,
        error: state.interests.ownInterestsError,
      }
    ) : 'not loaded';

  const { ownSubmissions, requestingOwnSubmissions, ownSubmissionsError } = state.submissions;
  const submissions =
    ownSubmissions || requestingOwnSubmissions || ownSubmissionsError ?
      (
        state.submissions.ownSubmissions || {
          loading: state.submissions.requestingOwnSubmissions,
          error: state.submissions.ownSubmissionsError,
        }
      ) : 'not loaded';

  return {
    user: state.session.user,
    token: state.session.token,
    interests,
    submissions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadInterests: (userId, token) => dispatch(loadOwnInterests(userId, token)),
    loadSubmissions: (userId, token) => dispatch(loadOwnSubmissions(userId, token)),
  };
}

const DreamProjectProfilePage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DreamProjectProfilePageView);

export default DreamProjectProfilePage;
