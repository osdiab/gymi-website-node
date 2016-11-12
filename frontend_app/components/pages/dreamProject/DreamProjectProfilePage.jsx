import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import messages from '../../../messages';
import Button from '../../Button';
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

const interestsMessages = messages.dreamProject.profile.interests;

export class DreamProjectProfilePageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingInterests: false,
    };
  }

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
        <div className="DreamProjectProfilePage--interestsTitle sectionHeader">
          <h3><FormattedMessage {...interestsMessages.title} /></h3>
          <Button
            action={() => this.setState({ editingInterests: !this.state.editingInterests })}
            disabled={allTopics === 'not loaded'}
          >
            { this.state.editingInterests ?
              <FormattedMessage {...interestsMessages.finishEditing} />
            :
              <FormattedMessage {...interestsMessages.changeInterests} />
            }
          </Button>
        </div>
        { interests !== 'not loaded' &&
          allTopics !== 'not loaded' &&
          <Interests
            interests={interests}
            edit={this.state.editingInterests && {
              addInterest: (id, primary) => addInterest(user.id, token, id, primary),
              removeInterest: id => removeInterest(user.id, token, id),
              allTopics,
            }}
          />
        }
        <h3 className="sectionHeader">
          <FormattedMessage {...messages.dreamProject.profile.submissions.title} />
        </h3>
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
