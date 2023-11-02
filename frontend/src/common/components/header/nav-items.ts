import { APP_ROUTES } from '~/common/constants';

import type { NavItem } from './types';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: APP_ROUTES.HOME,
  },
  {
    label: 'About',
    href: APP_ROUTES.ABOUT,
  },
];

export { NAV_ITEMS };

// NAV STRUCTURE EXAMPLE WITH SUBMENU
// const NAV_ITEMS: NavItem[] = [
//   {
//     label: 'Inspiration',
//     subItems: [
//       {
//         label: 'Explore Design Work',
//         subLabel: 'Trending Design to inspire you',
//         href: '#',
//       },
//       {
//         label: 'New & Noteworthy',
//         subLabel: 'Up-and-coming Designers',
//         href: '#',
//       },
//     ],
//   },
//   {
//     label: 'Find Work',
//     subItems: [
//       {
//         label: 'Job Board',
//         subLabel: 'Find your dream design job',
//         href: '#',
//       },
//       {
//         label: 'Freelance Projects',
//         subLabel: 'An exclusive list for contract work',
//         href: '#',
//       },
//     ],
//   },
//   {
//     label: 'Learn Design',
//     href: '#',
//   },
//   {
//     label: 'Hire Designers',
//     href: '#',
//   },
// ];
