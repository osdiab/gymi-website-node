import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Select from 'react-select';
import _ from 'lodash';

import Button from '../../Button';
import messages from '../../../messages';
import LoadingSpinner from '../../LoadingSpinner';
import './Interests.less';

const interestsMessages = messages.dreamProject.profile.interests;

function interestsToOptions(interests) {
  return interests.map(i => ({ value: i.id, label: i.title }));
}

class Interests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingInterests: false,
      interestToAdd: null,
    };
    this.handleAddInterest = this.handleAddInterest.bind(this);
  }

  handleAddInterest(selected, primary = false) {
    this.props.edit.addInterest(selected.value, primary);
  }

  render() {
    const loading = this.props.interests.loading;
    const loadError = this.props.interests.error;

    return (
      <div className="Interests">
        <div className="Interests--title sectionHeader">
          <h3><FormattedMessage {...interestsMessages.title} /></h3>
          { this.props.edit && (
            <Button
              action={() =>
                this.setState({ changingInterests: !this.state.changingInterests })}
            >
              { this.state.changingInterests ?
                <FormattedMessage {...interestsMessages.cancel} />
              :
                <FormattedMessage {...interestsMessages.changeInterests} />
              }
            </Button>
          )}
        </div>
        { loading || loadError ? <div className="Interests--no-data">
          { loadError ? <p className="Interests--error">
            <FormattedMessage {...messages.errors.unexpected} />
          </p> : <LoadingSpinner />
          }
        </div> : <div className="Interests--interests">
          { this.props.edit && this.state.changingInterests ? (
            <div className="Interests--editPrimary">
              <FormattedMessage {...interestsMessages.choosePrimary} />
              <Select
                name="primaryInterest"
                value={this.props.interests.primaryInterest.id}
                options={interestsToOptions(this.props.edit.allTopics)}
                onChange={selected => this.handleAddInterest(selected, true)}
                clearable={false}
              />
            </div>
          ) : (
            <p>
              <span className="Interests--interests--category">
                <FormattedMessage {...interestsMessages.primary} />:
              </span>
              <span>
                {this.props.interests.primaryInterest.title}
              </span>
            </p>
          )}
          { this.props.edit && this.state.changingInterests ? (
            <div>
              <div>
                <FormattedMessage {...interestsMessages.chooseInterests} />
                <Select
                  name="otherInterest"
                  options={interestsToOptions(
                    _.differenceBy(
                      this.props.edit.allTopics,
                      this.props.interests.otherInterests,
                      'id',
                    )
                  )}
                  autofocus
                  onChange={this.handleAddInterest}
                  placeholder={this.props.intl.formatMessage(
                    interestsMessages.typeInterestHere)}
                />
              </div>
              <ul className="Interests--editOtherInterests">
                {this.props.interests.otherInterests.map(i => (
                  <li key={i.id}>
                    <span>{i.title}</span>
                    <button
                      className="Interests--removeInterest"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.edit.removeInterest(i.id);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>
              <span className="Interests--interests--category">
                <FormattedMessage {...interestsMessages.other} />:
              </span>
              <span>
                {this.props.interests.otherInterests.map(i => i.title).join(', ')}
              </span>
            </p>
          )}
        </div>
        }
      </div>
    );
  }
}

export const interestType = PropTypes.shape({
  title: PropTypes.string,
  id: PropTypes.number,
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
  edit: PropTypes.oneOfType([
    PropTypes.shape({
      addInterest: PropTypes.func.isRequired,
      removeInterest: PropTypes.func.isRequired,
      allTopics: PropTypes.arrayOf(interestType).isRequired,
    }),
    PropTypes.oneOf([false]),
  ]),
  intl: intlShape,
};

export default injectIntl(Interests);
