// react-material-symbols currently does not work with the current react 19
// using svg icons until we find a better replacement
import type { JSX } from 'react';

import { faCircleInfo, faEnvelope, faBell, faLock, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TODO: replace icons with more accurate ones.
// using the currently avaliable icons as substitutes for now
const MaterialIcon: Record<string, JSX.Element> = {
  'chevron-right': <FontAwesomeIcon icon={faChevronRight} />,
  'demography': <FontAwesomeIcon icon={faCircleInfo} />,
  'lock': <FontAwesomeIcon icon={faLock} />,
  'mail': <FontAwesomeIcon icon={faEnvelope} />,
  'notifications-active': <FontAwesomeIcon icon={faBell} />,
};

export function getIcon(icon?: string) {
  if (!icon || !(icon in MaterialIcon)) {
    return <></>;
  }
  return MaterialIcon[icon];
}

