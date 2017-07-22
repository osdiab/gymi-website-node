import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { CounterSectionView } from '../../components/CounterSection';

describe('CounterSection', () => {
  it('displays the counter', () => {
    const testValues = [0, 6, 24, -2, 5];

    for (const value of testValues) {
      const incrementCounter = sinon.spy();
      const counterSection = shallow(
        <CounterSectionView counterValue={value} incrementCounter={incrementCounter} />);
      const valueDom = counterSection.find('.CounterSection--value');
      assert.equal(valueDom.length, 1);
      assert.equal(valueDom.text(), value);
      const buttonDom = counterSection.find('Button');
      assert.equal(buttonDom.length, 1);
    }
  });

  it('increments the counter when button clicked', () => {
    const incrementCounter = sinon.spy();
    const counterSection = shallow(
      <CounterSectionView counterValue={0} incrementCounter={incrementCounter} />);
    const buttonDom = counterSection.find('Button');
    assert(!incrementCounter.called);
    buttonDom.simulate('click');
    assert(incrementCounter.calledOnce);
    assert(incrementCounter.calledWith());

    const numIterations = 5;
    for (const curIteration of Array(numIterations - 1).keys()) {
      buttonDom.simulate('click');
      // add 2 since 0-indexed and already called once
      assert.equal(incrementCounter.callCount, curIteration + 2);
    }
  });
});
