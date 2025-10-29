import type { ReactNode } from 'react';
import Markdown from 'markdown-to-jsx';

export interface ContextualAlertProps {
  id: string
  type?: string
  alert_icon_id: string
  alert_icon_alt_text: string
  alertHeading: string | ReactNode
  alertBody: string
  whiteBG?: boolean
  className?: string
}

const ContextualAlert = ({
  id,
  type,
  alert_icon_id,
  alert_icon_alt_text,
  alertHeading,
  alertBody,
  whiteBG,
  className,
}: ContextualAlertProps) => {
  const alert_type =
    type === 'warning'
      ? "/assets/warning_img.svg"
      : type === 'danger'
        ? "/assets/danger_img.svg"
        : type === 'information'
          ? "/assets/info_img.svg"
          : "/assets/success_img.svg"

  const alert_color =
    type === 'warning'
      ? 'border-orange-dark'
      : type === 'danger'
        ? 'border-red-50b'
        : type === 'information'
          ? 'border-brighter-blue-dark'
          : 'border-green-50a'

  const white_BG = whiteBG ? 'bg-white' : ' '

  return (
    <li
      id={id}
      className={`relative min-w-72 pl-4 sm:pl-6 ${white_BG} ${className}`}
      role="alert"
    >
      <div
        data-testid="alert-icon"
        className="absolute left-1.5 top-3 bg-white py-1 sm:left-3.5"
      >
        <img
          src={alert_type}
          width={28}
          height={28}
          alt={alert_icon_alt_text}
          id={alert_icon_id}
        ></img>
      </div>
      <div
        className={`overflow-auto border-l-[6px] ${alert_color} py-3 pl-6 leading-8`}
      >
        <div className="ml-1 font-display text-2xl font-bold leading-[26px] text-deep-blue-dark">
          {alertHeading}
        </div>

        <div className="ml-0.5 font-body text-20px text-gray-darker">
          <Markdown
            options={{
              overrides: {
                h2: {
                  props: {
                    className:
                      'text-3xl text-gray-darker font-display font-bold mt-10 mb-3',
                  },
                },
                p: {
                  props: {
                    className: 'mb-3 text-gray-darker',
                  },
                },
                ul: {
                  props: {
                    className: 'list-disc ml-4 sm:mx-8 mb-3 text-gray-darker',
                  },
                },
                a: {
                  props: {
                    className: 'underline text-deep-blue-dark cursor-pointer',
                    rel: 'noopener noreferrer', // Security, avoids external site opened through this site to have control over this site
                    target: '_blank',
                  },
                },
              },
            }}
          >
            {alertBody}
          </Markdown>
        </div>
      </div>
    </li>
  )
}

export default ContextualAlert
