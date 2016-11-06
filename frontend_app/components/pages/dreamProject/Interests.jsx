import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../Button';
import messages from '../../../messages';
import LoadingSpinner from '../../LoadingSpinner';

const interestsMessages = messages.dreamProject.profile.interests;

export default class Interests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingTags: false,
    };
  }

  render() {
    const loading = this.props.interests.loading;
    const loadError = this.props.interests.error;

    return (
      <div className="Interests">
        <div className="Interests--title">
          <h3><FormattedMessage {...interestsMessages.title} /></h3>
          <Button action={() => this.setState({ changingTags: true })}>
            <FormattedMessage {...interestsMessages.changeTags} />
          </Button>
        </div>
        { loading || loadError ? <div className="Interests--notPresent">
          { loadError ? <p className="Interests--error">
            <FormattedMessage {...messages.errors.unexpected} />
          </p> : <LoadingSpinner />
          }
        </div> : <div className="Interests--interests">
          <p>
            <span className="Interests--interests--category">
              <FormattedMessage {...interestsMessages.primary} />
            </span>
            <span>
              {this.props.interests.primaryInterest.title}
            </span>
          </p>
          <p>
            <span className="Interests--interests--category">
              <FormattedMessage {...interestsMessages.other} />
            </span>
            <span>
              {this.props.interests.otherInterests.map(i => i.title).join(', ')}
            </span>
          </p>

        </div>
        }
      </div>
    );
  }
}

export const interestType = PropTypes.shape({
  title: PropTypes.string,
  id: PropTypes.number,
  primary: PropTypes.bool,
});

Interests.propTypes = {
  interests: PropTypes.oneOfType([
    PropTypes.shape({
      otherInterests: PropTypes.arrayOf(interestType).isRequired,
      primaryInterest: interestType.isRequired,
    }),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
  ]).isRequired,
};
