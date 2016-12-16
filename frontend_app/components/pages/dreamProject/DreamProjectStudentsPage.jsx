import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import Button from '../../Button';
import UserCategories from './UserCategories';
import {
  loadAllUsers,
  loadTopics as loadTopicsAction,
  loadPeriods as loadPeriodsAction,
} from '../../../actions';

import './DreamProjectStudentsPage.less';

export class DreamProjectStudentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterByField: 'period',
    };
  }
  componentWillMount() {
    this.props.loadUsers();
    this.props.loadTopics();
    this.props.loadPeriods();
  }

  render() {
    const { filterByField, topics, periods, students } = this.props;
    const title = filterByField === 'period' ? 'Students by year' : `Students interested in ${filterByField.title}`;

    let categories = null;
    return (
      <div>
        <div className="DreamProjectStudentsPage--period">
          <h2>{title}</h2>
          { topics && periods && students &&
          <UserCategories categories={categories} />
          }
        </div>
        <div className="DreamProjectStudentsPage--sidebar">
          <Button action={() => alert('hi')}>
            <h4>Filter by year</h4>
          </Button>
          <h4>Filter by primary interest</h4>
          {topics && topics.map(field => (
            <Button key={field.id} action={() => alert(field.title)}>
              {field.title}
            </Button>
          ))}
        </div>
      </div>
    );
  }
}

DreamProjectStudentsPage.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  })),
  periods: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  })),
  students: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    primaryInterestId: PropTypes.string,
    activePeriods: PropTypes.arrayOf(PropTypes.string).isRequired,
  })),
  loadUsers: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    topics: state.topics.topics,
    periods: state.periods.periods,
    students: state.users.allUsers.filter(u => u.role === 'student'),
    token: state.session.token,
  };
}

function mapDispatchToProps(state, ownState) {
  return {
    loadTopics: token => loadTopicsAction(token),
    loadPeriods: token => loadPeriodsAction(token),
    loadUsers: token => loadAllUsers(token),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const token = stateProps.token;
  const newDispatchProps = {
    loadUsers: () => dispatchProps.loadUsers(token),
  };
  const newStateProps = _.omit(stateProps, ['token']);
  Object.assign({}, ownProps, newStateProps, newDispatchProps);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(DreamProjectStudentsPage);
