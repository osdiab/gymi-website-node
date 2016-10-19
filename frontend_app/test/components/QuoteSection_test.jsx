import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { QuoteSectionView } from '../../components/QuoteSection';

// Asserts that each element in testCases matches the properties defined in the test case for a
// rendered QuoteSectionView
function assertQuoteSection(domElement, testCases) {
  for (const testCase of testCases) {
    const selector = `.QuoteSection--${testCase.element}`;

    if (testCase.expectedLength) {
      const actualLength = domElement.find(selector).length;
      assert.equal(actualLength, testCase.expectedLength,
                   `Expected ${testCase.expectedLength} instances of ` +
                   `'${selector}', instead found ${actualLength}.`);
    }

    if (testCase.expectedText) {
      const actualText = domElement.find(selector).text();
      assert.equal(actualText, testCase.expectedText,
                   `Expected '${selector}' to have text ${testCase.expectedText}, instead ` +
                   `found ${actualText}.`);
    }
  }
}

describe('QuoteSection', () => {
  it('prompts to fetch quote at first', () => {
    const fetchSpy = sinon.spy();
    const quoteSection = shallow(<QuoteSectionView fetchingQuote={false} fetchQuote={fetchSpy} />);
    assert.equal(quoteSection.find('.QuoteSection--welcome').length, 1);
    const fetchButton = quoteSection.find('Button');
    assert.equal(fetchButton.length, 1);
    assert.equal(fetchButton.props().value, 'Get a random quote');
    assert(!fetchSpy.called);
    fetchButton.simulate('click');
    assert(fetchSpy.calledOnce);
  });

  it('displays correct loading message while fetching quote', () => {
    for (const quotePresent of [true, false]) {
      const quoteSection = shallow(
        <QuoteSectionView fetchingQuote fetchQuote={() => {}}
          quote={quotePresent ? 'hello' : null} author={quotePresent ? 'person' : null}
        />);


      const expectedText = quotePresent ? 'Finding another computer science quote...' :
        'Finding a computer science quote...';

      const testCases = [
        { element: 'welcome', expectedLength: 0 },
        { element: 'loading', expectedLength: 1, expectedText },
        { element: 'error', expectedLength: 0 },
      ];

      assertQuoteSection(quoteSection, testCases);
    }
  });

  it('displays a loading message and not an error when both present', () => {
    const quoteSection = shallow(
      <QuoteSectionView fetchingQuote fetchQuote={() => {}} fetchError={{ error: true }} />);

    const testCases = [
      { element: 'welcome', expectedLength: 0 },
      { element: 'loading', expectedLength: 1 },
      { element: 'error', expectedLength: 0 },
    ];

    assertQuoteSection(quoteSection, testCases);
  });

  it('displays quote and author when provided, not fetching, and no outstanding error', () => {
    const author = 'Jane Doe';
    const quote = 'My quote';
    const quoteSection = shallow(
      <QuoteSectionView fetchingQuote={false} fetchQuote={() => {}} quote={quote} author={author} />
    );

    const testCases = [
      { element: 'welcome', expectedLength: 0 },
      { element: 'loading', expectedLength: 0 },
      { element: 'error', expectedLength: 0 },
      { element: 'author', expectedLength: 1, expectedText: `-${author}` },
      { element: 'quote', expectedLength: 1, expectedText: quote },
    ];

    assertQuoteSection(quoteSection, testCases);
  });

  it('displays an error if quote fetching fails', () => {
    const quoteSection = shallow(
      <QuoteSectionView fetchingQuote={false} fetchQuote={() => {}} fetchError={{ error: true }} />
    );

    const testCases = [
      { element: 'welcome', expectedLength: 0 },
      { element: 'loading', expectedLength: 0 },
      { element: 'error', expectedLength: 1 },
      { element: 'author', expectedLength: 0 },
      { element: 'quote', expectedLength: 0 },
    ];

    assertQuoteSection(quoteSection, testCases);
  });

  it('displays an error if quote fetching fails, even with author and quote present', () => {
    const author = 'Jane Doe';
    const quote = 'My quote';
    const quoteSectionWithQuote = shallow(
      <QuoteSectionView fetchingQuote={false} fetchQuote={() => {}} fetchError={{ error: true }}
        author={author} quote={quote}
      />
    );

    const testCases = [
      { element: 'welcome', expectedLength: 0 },
      { element: 'loading', expectedLength: 0 },
      { element: 'error', expectedLength: 1 },
      { element: 'author', expectedLength: 0 },
      { element: 'quote', expectedLength: 0 },
    ];

    assertQuoteSection(quoteSectionWithQuote, testCases);
  });
});
