import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../messages';

require('./LeadershipTeamSection.less');

const teamMessages = messages.LeadershipTeamSection;

const TEAM_MEMBER_IDS = [
  'ChristineWang',
  'SherminLuo',
  'YunQu',
  'YilinWei',
  'ShantingChen',
  'NingLu',
  'KeyingQue',
  'YuqingZhang',
  'QiaoqiaoDong',
  'PoppyTian',
  'KelinLi',
];

export default function LeadershipTeamSection() {
  return (
    <section className="LeadershipTeamSection">
      {TEAM_MEMBER_IDS.map(id => (
        <div
          className="LeadershipTeamSection--profile"
          key={id}
          // make selectable if description is present
          // TODO: remove until bios are present
          // tabIndex={teamMessages[id].description ? '0' : undefined}
        >
          <img role="presentation" src={`/media/team_photos/${id}.png`} />
          <h4>
            <FormattedMessage {...teamMessages[id].name} />
          </h4>
          <h5>
            <FormattedMessage {...teamMessages[id].title} />
          </h5>
          {/* // show description only if present */}
          {/* // TODO: remove until bios are present */}
          {/* {teamMessages[id].description && (
            <div className="LeadershipTeamSection--details">
              <h4>
                <FormattedMessage {...teamMessages[id].name} />
              </h4>
              <h5>
                <FormattedMessage {...teamMessages[id].title} />
              </h5>
              <p>
                <FormattedMessage {...teamMessages[id].description} />
              </p>
            </div>
          )} */}
        </div>
      ))}
    </section>
  );
}
