import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Button from '../../Button';
import messages from '../../../messages';

require('./QuestionSection.less');

const joinMessages = messages.JoinUsPage;
export default class QuestionSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 'title',
    };
  }

  render() {
    const { id, questions, buttonUrl, color } = this.props;
    const { currentQuestion } = this.state;

    return (
      <section className="JoinUsPage--QuestionSection">
        <div>
          <button
            className={`JoinUsPage--QuestionSection--titleButton JoinUsPage--QuestionSection--${color}`}
            onClick={() => this.setState({ currentQuestion: 'title' })}
          >
            <h2><FormattedMessage {...joinMessages[id].title.name} /></h2>
          </button>
          <ul>
            {questions.map(questionId => (
              <li key={`${id}--${questionId}`}>
                <button onClick={() => this.setState({ currentQuestion: questionId })}>
                  <FormattedMessage {...joinMessages[id][questionId].name} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <article className="JoinUsPage--QuestionSection--response">
            <FormattedHTMLMessage {...joinMessages[id][currentQuestion].description} />
          </article>
          <Button className="JoinUsPage--QuestionSection--Button" action={{ href: buttonUrl }}>
            <FormattedMessage {...joinMessages[id].button} />
          </Button>
        </div>
      </section>
    );
  }
}

QuestionSection.defaultProps = {
  questions: [],
};

const COLORS = [
  'salmon', 'purple', 'blue', 'green', 'yellow',
];
QuestionSection.propTypes = {
  id: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.string),
  color: PropTypes.oneOf(COLORS),
};
