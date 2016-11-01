import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../../messages';

require('./LeadershipTeamSection.less');

const teamMessages = messages.LeadershipTeamSection;

const TEAM_MEMBER_IDS = [
  'ChristineWang', 'SherminLuo', 'YunQu', 'HarryGao', 'KeyingQue', 'EllenXu', 'RonaWo',
  'AndrewTang', 'YilinWei', 'YouzhihangDeng', 'GraceZheng', 'DavidRyu', 'GavinJiao', 'YangLi',
  'SamanthaLee',
];

export default function LeadershipTeamSection() {
  return (
    <section className="LeadershipTeamSection">
      { TEAM_MEMBER_IDS.map(id => (
        <div className="LeadershipTeamSection--profile" key={id} tabIndex="0">
          <img role="presentation" src={`/media/team_photos/${id}.png`} />
          <div className="LeadershipTeamSection--details">
            <h4><FormattedMessage {...teamMessages[id].name} /></h4>
            <h5><FormattedMessage {...teamMessages[id].title} /></h5>
            <p><FormattedMessage {...teamMessages[id].description} /></p>
          </div>
        </div>
      )) }
    </section>
  );
}
