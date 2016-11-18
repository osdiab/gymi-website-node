import React from 'react';
import ReactPlayer from 'react-player';

import PeriodShowcase from './PeriodShowcase';

export function Summer2013Page() {
  return (<PeriodShowcase
    messagesId="summer2013"
    season="summer"
    year={2013}
    imageDetails={[
      {
        media: '/media/page_assets/summer_2013/computers.png',
        imageId: '0',
      },
      {
        media: '/media/page_assets/summer_2013/teamwork.png',
        imageId: '1',
      },
      {
        media: '/media/page_assets/summer_2013/icebreakers.png',
        imageId: '2',
      },
      {
        media: <ReactPlayer width="100%" controls url="https://www.youtube.com/watch?v=N_0_L4ynxr8" />,
        imageId: '3',
      },
      {
        media: <ReactPlayer width="100%" controls url="https://www.youtube.com/watch?v=7aatqhmNw9w" />,
        imageId: '4',
      },
    ]}
    imageGallery={[
      '/media/page_assets/summer_2013/other_photos/001.png',
      '/media/page_assets/summer_2013/other_photos/002.jpg',
      '/media/page_assets/summer_2013/other_photos/003.jpg',
      '/media/page_assets/summer_2013/other_photos/004.jpg',
      '/media/page_assets/summer_2013/other_photos/005.jpg',
      '/media/page_assets/summer_2013/other_photos/006.jpg',
      '/media/page_assets/summer_2013/other_photos/007.jpg',
      '/media/page_assets/summer_2013/other_photos/008.jpg',
      '/media/page_assets/summer_2013/other_photos/009.jpg',
    ].map(i => ({ original: i, thumbnail: i }))}
    backgroundImageUrl="/media/page_assets/summer_2013/teamwork.png"
    backgroundTint="orange"
  />);
}

export function Summer2014Page() {
  return (<PeriodShowcase
    messagesId="summer2014"
    season="summer"
    year={2014}
    imageDetails={[
      {
        media: '/media/page_assets/summer_2014/1.jpg',
        imageId: '0',
      },
      {
        media: '/media/page_assets/summer_2014/2.jpg',
        imageId: '1',
      },
      {
        media: '/media/page_assets/summer_2014/3.jpg',
        imageId: '2',
      },
      {
        media: '/media/page_assets/summer_2014/4.jpg',
        imageId: '3',
      },
      {
        media: '/media/page_assets/summer_2014/5.jpg',
        imageId: '4',
      },
    ]}
    imageGallery={[
      '/media/page_assets/summer_2014/other_photos/00.jpg',
      '/media/page_assets/summer_2014/other_photos/01.jpg',
      '/media/page_assets/summer_2014/other_photos/02.jpg',
      '/media/page_assets/summer_2014/other_photos/03.jpg',
      '/media/page_assets/summer_2014/other_photos/04.jpg',
      '/media/page_assets/summer_2014/other_photos/05.jpg',
      '/media/page_assets/summer_2014/other_photos/06.jpg',
      '/media/page_assets/summer_2014/other_photos/07.jpg',
      '/media/page_assets/summer_2014/other_photos/08.jpg',
    ].map(i => ({ original: i, thumbnail: i, height: 600 }))}
    backgroundImageUrl="/media/page_assets/summer_2014/main.jpg"
    backgroundTint="lightBlue"
  />);
}

export function Summer2015Page() {
  return (<PeriodShowcase
    messagesId="summer2015"
    season="summer"
    year={2015}
    imageDetails={[
      {
        media: '/media/page_assets/summer_2015/1.jpg',
        imageId: '0',
      },
      {
        media: '/media/page_assets/summer_2015/2.jpg',
        imageId: '1',
      },
      {
        media: '/media/page_assets/summer_2015/3.jpg',
        imageId: '2',
      },
      {
        media: '/media/page_assets/summer_2015/4.jpg',
        imageId: '3',
      },
      {
        media: '/media/page_assets/summer_2015/5.jpg',
        imageId: '4',
      },
      {
        media: '/media/page_assets/summer_2015/6.jpg',
        imageId: '5',
      },
      {
        media: '/media/page_assets/summer_2015/7.jpg',
        imageId: '6',
      },
    ]}
    imageGallery={[
      '/media/page_assets/summer_2015/other_photos/00.jpg',
      '/media/page_assets/summer_2015/other_photos/01.jpg',
      '/media/page_assets/summer_2015/other_photos/02.jpg',
      '/media/page_assets/summer_2015/other_photos/03.jpg',
      '/media/page_assets/summer_2015/other_photos/04.jpg',
      '/media/page_assets/summer_2015/other_photos/05.jpg',
      '/media/page_assets/summer_2015/other_photos/06.jpg',
      '/media/page_assets/summer_2015/other_photos/07.jpg',
      '/media/page_assets/summer_2015/other_photos/08.jpg',
    ].map(i => ({ original: i, thumbnail: i }))}
    backgroundImageUrl="/media/page_assets/summer_2015/main.jpg"
    backgroundTint="lightGreen"
  />);
}

export function Summer2016Page() {
  return (<PeriodShowcase
    messagesId="summer2016"
    season="summer"
    year={2016}
    imageDetails={[
      {
        media: '/media/page_assets/summer_2016/1.png',
        imageId: '0',
      },
      {
        media: '/media/page_assets/summer_2016/2.png',
        imageId: '1',
      },
      {
        media: '/media/page_assets/summer_2016/3.png',
        imageId: '2',
      },
      {
        media: '/media/page_assets/summer_2016/4.png',
        imageId: '3',
      },
      {
        media: '/media/page_assets/summer_2015/5.jpg',
        imageId: '4',
      },
      {
        media: '/media/page_assets/summer_2015/6.jpg',
        imageId: '5',
      },
      {
        media: '/media/page_assets/summer_2015/7.jpg',
        imageId: '6',
      },
    ]}
    imageGallery={[
      '/media/page_assets/summer_2016/other_photos/1.jpg',
      '/media/page_assets/summer_2016/other_photos/2.jpg',
      '/media/page_assets/summer_2016/other_photos/3.jpg',
      '/media/page_assets/summer_2016/other_photos/4.jpg',
      '/media/page_assets/summer_2016/other_photos/5.jpg',
      '/media/page_assets/summer_2016/other_photos/6.jpg',
      '/media/page_assets/summer_2016/other_photos/7.jpg',
    ].map(i => ({ original: i, thumbnail: i }))}
    backgroundImageUrl="/media/page_assets/summer_2015/main.jpg"
    backgroundTint="lightGreen"
  />);
}
