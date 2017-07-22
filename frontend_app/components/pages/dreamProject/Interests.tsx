import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Select from 'react-select';
import _ from 'lodash';

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
    this.handleAddInterest = this.handleAddInterest.bind(this);
  }

  handleAddInterest(selected, primary = false) {
    this.props.edit.addInterest(selected.value, primary);
  }

  render() {
    const { interests, edit, intl } = this.props;
    const loading = interests.loading;
    const loadError = interests.error;

    return (
      <div className="Interests">
        { loading || loadError ? <div className="Interests--no-data">
          { loadError ? <p className="Interests--error">
            <FormattedMessage {...messages.errors.unexpected} />
          </p> : <LoadingSpinner />
          }
        </div> : <div className="Interests--interests">
          { edit ? (
            <div className="Interests--editPrimary">
              <FormattedMessage {...interestsMessages.choosePrimary} />
              <Select
                name="primaryInterest"
                value={interests.primaryInterest && interests.primaryInterest.id}
                options={interestsToOptions(edit.allTopics)}
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
                {interests.primaryInterest ?
                  interests.primaryInterest.title
                :
                  <FormattedMessage {...interestsMessages.undecided} />
                }
              </span>
            </p>
          )}
          { edit ? (
            <div>
              <div>
                <FormattedMessage {...interestsMessages.chooseInterests} />
                <Select
                  name="otherInterest"
                  options={interestsToOptions(
                    _.differenceBy(
                      edit.allTopics,
                      interests.otherInterests,
                      'id',
                    )
                  )}
                  autofocus
                  onChange={this.handleAddInterest}
                  placeholder={intl.formatMessage(interestsMessages.typeInterestHere)}
                />
              </div>
              <ul className="Interests--editOtherInterests">
                {interests.otherInterests.map(i => (
                  <li key={i.id}>
                    <span>{i.title}</span>
                    <button
                      className="Interests--removeInterest"
                      onClick={(e) => {
                        e.preventDefault();
                        edit.removeInterest(i.id);
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
                {
                  interests.otherInterests.length === 0 ? 'None' :
                  interests.otherInterests.map(i => i.title).join(', ')}
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
      primaryInterest: interestType,
    }),
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
  ]).isRequired,
  edit: PropTypes.shape({
    addInterest: PropTypes.func.isRequired,
    removeInterest: PropTypes.func.isRequired,
    allTopics: PropTypes.oneOfType([
      PropTypes.arrayOf(interestType),
      PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
      }),
    ]),
  }),
  intl: intlShape,
};

export default injectIntl(Interests);
