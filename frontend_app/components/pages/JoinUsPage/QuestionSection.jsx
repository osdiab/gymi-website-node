import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import Button from '../../Button';
import messages from '../../../messages';

require('./QuestionSection.less');

const joinMessages = messages.JoinUsPage;
export default function QuestionSection({ id, questions = [], buttonUrl }) {
  return (
    <section className="JoinUsPage--QuestionSection">
      <button><h1><FormattedMessage {...joinMessages[id].title.name} /></h1></button>
      {questions.map(questionId => (
        <FormattedMessage key={`${id}--${questionId}`} {...joinMessages[id][questionId].name} />
      ))}
      <Button className="JoinUsPage--QuestionSection--Button" action={{ href: buttonUrl }}>
        <FormattedMessage {...joinMessages[id].button} />
      </Button>
    </section>
  );
}

QuestionSection.propTypes = {
  id: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.string),
};
