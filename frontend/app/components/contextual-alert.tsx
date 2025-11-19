import type { ReactNode } from 'react';

import { faCheckCircle, faCircleInfo, faExclamationCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '~/utils/tailwind-utils';

export type AlertType = 'warning' | 'success' | 'danger' | 'info' | 'comment';

export interface ContextualAlertProps {
  children: ReactNode;
  type: AlertType;
}

const alertBackgroundColors: Partial<Record<AlertType, string>> & { default: string } = {
  comment: 'bg-sky-50',
  default: 'bg-white',
};

const alertBorderColors: Partial<Record<AlertType, string>> & { default: string } = {
  comment: 'border-l-sky-800',
  danger: 'border-red-50b',
  default: 'border-green-50a',
  info: 'border-brighter-blue-dark',
  warning: 'border-orange-dark',
  success: 'border-l-green-700',
};

export function ContextualAlert(props: ContextualAlertProps) {
  const { children, type } = props;

  const alertBackgroundColor = alertBackgroundColors[type] ?? alertBackgroundColors.default;
  const alertBorderColor = alertBorderColors[type] ?? alertBorderColors.default;

  return (
    <div className={cn('relative pl-4 sm:pl-6', alertBackgroundColor)}>
      <div className={cn('absolute top-3 left-1.5 pt-1 pb-1 sm:left-3.5', alertBackgroundColor)}>
        <Icon type={type} />
      </div>
      <div className={cn('overflow-auto border-l-6 pt-3 pb-4.5 pl-6', alertBorderColor)}>{children}</div>
    </div>
  );
}

function Icon({ type }: { type: string }) {
  switch (type) {
    case 'warning': {
      return <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-dark h-6 w-6" />;
    }
    case 'success': {
      return <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-700" />;
    }
    case 'danger': {
      return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-50b h-6 w-6" />;
    }
    case 'info': {
      return <FontAwesomeIcon icon={faCircleInfo} className="text-brighter-blue-dark h-6 w-6" />;
    }
    default: {
      break;
    }
  }
}
