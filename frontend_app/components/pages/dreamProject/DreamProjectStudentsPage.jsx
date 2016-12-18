import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import messages from '../../../messages';
import Button from '../../Button';
import LoadingSpinner from '../../LoadingSpinner';
import UserCategories from './UserCategories';
import {
  loadAllUsers,
  loadTopics as loadTopicsAction,
  loadPeriods as loadPeriodsAction,
} from '../../../actions';

import './DreamProjectStudentsPage.less';

const studentsMessages = messages.dreamProject.students;

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
    const { topics, periods, students } = this.props;
    const filterByField = this.state.filterByField;

    let title = null;
    if (students && topics && periods) {
      title = filterByField === 'period' ?
        <FormattedMessage {...studentsMessages.byYear} /> :
          <FormattedMessage
            {...studentsMessages.byInterest}
            values={{ field: topics.find(t => t.id === filterByField).title }}
          />;
    } else {
      title = <FormattedMessage {...messages.common.loading} />;
    }

    const matchingStudents = filterByField === 'period' ? students :
      students && students.filter(student => student.primaryInterestId === filterByField);

    const studentsByPeriod = matchingStudents && matchingStudents.reduce((memo, student) => {
      const change = {};
      for (const periodId of student.periodsActive) {
        if (!memo[periodId]) {
          change[periodId] = [student];
        } else {
          change[periodId] = memo[periodId].concat(student);
        }
      }
      return Object.assign({}, memo, change);
    }, {});

    const categories = students && periods ?
      Object.keys(studentsByPeriod).map(periodId => (
        {
          // cast to string because obj keys are strings
          title: periods.find(period => `${period.id}` === periodId).title,
          users: studentsByPeriod[periodId],
        }
      )) : {};

    return (
      <div className="DreamProjectStudentsPage">
        <div className="DreamProjectStudentsPage--body">
          <h2>{title}</h2>
          { topics && periods && students ?
            <UserCategories categories={categories} /> : <LoadingSpinner />
          }
        </div>
        <div className="DreamProjectStudentsPage--sidebar">
          <Button
            className="DreamProjectStudentsPage--periodFilter"
            action={() => this.setState({ filterByField: 'period' })}
          >
            <h4><FormattedMessage {...studentsMessages.filterByYear} /></h4>
          </Button>
          <h4><FormattedMessage {...studentsMessages.filterByField} /></h4>
          {topics ? topics.map(field => (
            <Button
              className="DreamProjectStudentsPage--topicFilter"
              key={field.id} action={() => this.setState({ filterByField: field.id })}
            >
              {field.title}
            </Button>
          )) : <LoadingSpinner />}
        </div>
      </div>
    );
  }
}

DreamProjectStudentsPage.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  })),
  periods: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  })),
  students: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    primaryInterestId: PropTypes.string,
    activePeriods: PropTypes.arrayOf(PropTypes.string).isRequired,
  })),
  loadUsers: PropTypes.func,
  loadTopics: PropTypes.func,
  loadPeriods: PropTypes.func,
};

function mapStateToProps(state) {
  return Object.assign({
    topics: state.topics.topics,
    periods: state.periods.periods,
    token: state.session.token,
  }, state.users.allUsers && {
    students: state.users.allUsers.filter(u => u.role === 'student'),
  });
}

function mapDispatchToProps(dispatch) {
  return {
    loadTopics: token => dispatch(loadTopicsAction(token)),
    loadPeriods: token => dispatch(loadPeriodsAction(token)),
    loadUsers: token => dispatch(loadAllUsers(token)),
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const token = stateProps.token;
  const newDispatchProps = {
    loadUsers: () => dispatchProps.loadUsers(token),
    loadTopics: () => dispatchProps.loadTopics(token),
    loadPeriods: () => dispatchProps.loadPeriods(token),
  };
  const newStateProps = _.omit(stateProps, ['token']);
  return Object.assign({}, ownProps, newStateProps, newDispatchProps);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(DreamProjectStudentsPage);
