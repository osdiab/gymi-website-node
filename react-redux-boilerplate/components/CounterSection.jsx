// Component
// View of the section of the page that displays a counter and a button to increment it.
// Presentational code only; state is passed as properties by the container.
import { Button } from 'clever-components';
import React, { PropTypes } from 'react';
import { FormattedDate } from 'react-intl';

require('./CounterSection.less');
export function CounterSectionView({ counterValue, incrementCounter }) {
  return (<div className="section CounterSection">
    <h2>Counter</h2>
    <p>The current value is: <span className="CounterSection--value">{counterValue}</span></p>
    <Button type="primary" onClick={incrementCounter} value="Increment Counter" />
    <p>
      Today is {' '}
      <FormattedDate value={Date.now()} month="long" day="numeric" />
    </p>
  </div>);
}

CounterSectionView.propTypes = {
  counterValue: PropTypes.number.isRequired,
  incrementCounter: PropTypes.func.isRequired,
};

// Container
// Injects state and action dispatchers into the Component, thus decoupling the
// presentation from state management.
import { connect } from 'react-redux';

import { incrementCounter } from '../actions';

function mapStateToProps(state) {
  return { counterValue: state.counter.value };
}

function mapDispatchToProps(dispatch) {
  return { incrementCounter: () => dispatch(incrementCounter()) };
}

const CounterSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterSectionView);

export default CounterSection;
