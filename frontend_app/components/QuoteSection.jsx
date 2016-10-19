// Component
// View of the section of the page that displays a button to fetch and display a computer science
// quote.
// Presentational code only; state is passed as properties by the container.
import { Button } from 'clever-components';
import React, { PropTypes } from 'react';

require('./QuoteSection.less');

export function QuoteSectionView({ fetchError, fetchingQuote, quote, author, fetchQuote }) {
  let content = null;
  if (fetchingQuote) {
    const verb = quote ? 'Finding another' : 'Finding a';
    content = <p className="QuoteSection--loading">{verb} computer science quote...</p>;
  } else {
    if (fetchError) {
      content = (<p className="QuoteSection--error">
        There was an error finding a computer science quote. Please try again!
      </p>);
    } else {
      content = (quote ? (
        <div className="QuoteSection--content">
          <p className="QuoteSection--quote">{quote}</p>
          <p className="QuoteSection--author">-{author}</p>
        </div>) : <p className="QuoteSection--welcome">Find a random computer science quote!</p>);
    }
  }
  const buttonText = quote ? 'Get another quote' : 'Get a random quote';
  return (
    <div className="section QuoteSection">
      <h2>Computer Science Quotes</h2>
      {content}
      <Button type="primary" onClick={fetchQuote} value={buttonText} />
    </div>
  );
}

QuoteSectionView.propTypes = {
  fetchError: PropTypes.object,
  fetchingQuote: PropTypes.bool.isRequired,
  quote: PropTypes.string,
  author: PropTypes.string,
  fetchQuote: PropTypes.func.isRequired,
};

// Container
// Injects state and action dispatchers into the QuoteSectionView, thus decoupling the
// presentation from state management.
import { connect } from 'react-redux';

import { fetchQuote } from '../actions';

function mapStateToProps(state) {
  return {
    fetchingQuote: state.quote.fetching,
    quote: state.quote.quote,
    author: state.quote.author,
    fetchError: state.quote.fetchError,
  };
}

function mapDispatchToProps(dispatch) {
  return { fetchQuote: () => dispatch(fetchQuote()) };
}

const QuoteSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuoteSectionView);

export default QuoteSection;
