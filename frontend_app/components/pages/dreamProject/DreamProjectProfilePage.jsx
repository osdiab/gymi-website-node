import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Interests, { interestType } from './Interests';
import Submissions, { submissionType } from './Submissions';
import {
  loadOwnSubmissions,
  loadOwnInterests,
  loadTopics as loadTopicsAction,
  removeInterest as removeInterestAction,
  addInterest as addInterestAction,
} from '../../../actions';

import './DreamProjectProfilePage.less';

export class DreamProjectProfilePageView extends React.Component {
  componentWillMount() {
    this.props.loadSubmissions(this.props.user.id, this.props.token);
    this.props.loadInterests(this.props.user.id, this.props.token);
    this.props.loadTopics(this.props.user.id, this.props.token);
  }
  render() {
    const {
      user, interests, submissions,
      addInterest, removeInterest, allTopics, token,
    } = this.props;
    return (
      <div className="DreamProjectProfilePage">
        <div className="DreamProjectProfilePage--user">
          <h2>{user.name}</h2>
          <span>{user.username}</span>
        </div>
        { interests !== 'not loaded' &&
          allTopics !== 'not loaded' &&
          <Interests
            interests={interests}
            edit={{
              addInterest: (id, primary) => addInterest(user.id, token, id, primary),
              removeInterest: id => removeInterest(user.id, token, id),
              allTopics,
            }}
          />
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
  ]).isRequired,
  submissions: PropTypes.oneOfType([
    PropTypes.arrayOf(submissionType),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
    PropTypes.oneOf(['not loaded']),
  ]).isRequired,
  allTopics: PropTypes.oneOfType([
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
  loadInterests: PropTypes.func.isRequired,
  loadTopics: PropTypes.func.isRequired,
  loadSubmissions: PropTypes.func.isRequired,
  addInterest: PropTypes.func.isRequired,
  removeInterest: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { ownInterests, requestingOwnInterests, ownInterestsError } = state.interests;
  const interests =
    ownInterests || requestingOwnInterests || ownInterestsError ? (
      ownInterests || {
        loading: requestingOwnInterests,
        error: ownInterestsError,
      }
    ) : 'not loaded';

  const { ownSubmissions, requestingOwnSubmissions, ownSubmissionsError } = state.submissions;
  const submissions =
    ownSubmissions || requestingOwnSubmissions || ownSubmissionsError ?
      (
        ownSubmissions || {
          loading: requestingOwnSubmissions,
          error: ownSubmissionsError,
        }
      ) : 'not loaded';

  const { topics, requestingTopics, topicsError } = state.topics;
  const allTopics =
    topics || requestingTopics || topicsError ?
      (
        topics || {
          loading: requestingTopics,
          error: topicsError,
        }
      ) : 'not loaded';

  return {
    user: state.session.user,
    token: state.session.token,
    interests,
    submissions,
    allTopics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadTopics: (userId, token) => dispatch(loadTopicsAction(userId, token)),
    loadInterests: (userId, token) => dispatch(loadOwnInterests(userId, token)),
    loadSubmissions: (userId, token) => dispatch(loadOwnSubmissions(userId, token)),
    addInterest: (userId, token, topicId, primary) =>
      dispatch(addInterestAction(userId, token, topicId, primary)),
    removeInterest: (userId, token, topicId) =>
      dispatch(removeInterestAction(userId, token, topicId)),
  };
}

const DreamProjectProfilePage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DreamProjectProfilePageView);

export default DreamProjectProfilePage;
