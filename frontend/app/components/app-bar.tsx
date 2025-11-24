import { useState } from 'react';
import type { JSX } from 'react';

import { faChevronUp, faChevronDown, faEnvelope, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ButtonLink } from './button-link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/dropdown-menu';
import { AppLink } from '~/components/links';
import { MenuItem } from '~/components/menu';
import { useLanguage } from '~/hooks/use-language';
import { cn } from '~/utils/tailwind-utils';

type AppBarProps = {
  name?: string;
};

export function AppBar({ name }: AppBarProps): JSX.Element {
  const { t } = useTranslation(['gcweb']);
  const { SHOW_INBOX_BUTTON } = globalThis.__appEnvironment;
  return (
    <div className="md:bg-slate-700">
      <div className="align-center container mx-auto flex flex-wrap justify-between">
        <div className="align-center order-1 flex w-full bg-slate-700 sm:w-auto">
          <span id="menu-label" className="my-auto py-2 text-white sm:text-2xl">
            <AppLink file="routes/my-dashboard.tsx" className="hover:underline">
              {t('gcweb:app.title')}
            </AppLink>
          </span>
        </div>
         {SHOW_INBOX_BUTTON && (<div className="order-3 my-2 mr-8 ml-auto w-full sm:order-2 sm:w-auto">
          <ButtonLink
            id="inbox-button-desktop"
            file="routes/inbox.tsx"
            variant="default"
            className="rounded border-2 border-[#2B4380] bg-white font-sans text-lg"
            refPageAA="ESDC-EDSC_MSCA-MDSC-SCH:Nav"
          >
            <FontAwesomeIcon icon={faEnvelope} transform="grow-2" className="mr-2" />
            <span>{t('gcweb:app.inbox')}</span>
          </ButtonLink>
        </div>)}
        <div className="ring-blue-hover order-2 flex w-full items-center text-right text-2xl ring-offset-2 focus:ring-2 focus:outline-none sm:order-3 sm:w-[260px]">
          {name && (
            <UserButton
              name={name}
              className="ring-blue-hover focus:ring-blue-hover active:ring-blue-hover ring-offset-2 focus:ring-2 active:ring-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}

type UserButtonProps = {
  className?: string;
  name?: string;
};

function UserButton({ className, name }: UserButtonProps): JSX.Element {
  const { t } = useTranslation(['gcweb']);
  const { currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'flex h-full w-full flex-nowrap space-x-2 bg-slate-200 px-2 text-slate-700 hover:bg-neutral-300 focus:bg-neutral-300 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden aria-expanded:bg-neutral-300 aria-expanded:text-slate-700 sm:space-x-4 sm:px-4',
          className,
        )}
      >
        <div className="text-md my-auto flex flex-nowrap items-center space-x-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
            <FontAwesomeIcon icon={faUser} className="size-5 text-slate-200" />
          </div>
          <span id="menu-label" className="ring-blue-hover py-2 text-lg font-bold">
            {name}
          </span>
        </div>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="my-auto ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={0} className="w-(--radix-dropdown-menu-trigger-width) focus:outline-none">
        <UserName name={name} />
        <MenuItem
          file="routes/my-dashboard.tsx"
          className="text-md text-deep-blue-dark hover:text-blue-hover flex justify-between focus:bg-white"
        >
          {t('gcweb:app.menu-dashboard')}
        </MenuItem>
        <DropdownMenuSeparator />
        <MenuItem
          file="routes/profile-and-preferences.tsx"
          className="text-md text-deep-blue-dark hover:text-blue-hover flex justify-between focus:bg-white"
        >
          {t('gcweb:app.profile')}
        </MenuItem>
        <DropdownMenuSeparator />
        <MenuItem
          file="routes/security-settings.tsx"
          className="text-md text-deep-blue-dark hover:text-blue-hover flex justify-between focus:bg-white"
        >
          {t('gcweb:app.security-settings')}
        </MenuItem>
        <DropdownMenuSeparator />
        <MenuItem
          file="routes/contact-us.tsx"
          className="text-md text-deep-blue-dark hover:text-blue-hover flex justify-between focus:bg-white"
        >
          {t('gcweb:app.contact-us')}
        </MenuItem>
        <DropdownMenuSeparator />
        <MenuItem
          to={`/auth/logout?lang=${currentLanguage}`}
          className="text-md text-deep-blue-dark hover:text-blue-hover flex justify-between focus:bg-white"
        >
          {t('gcweb:app.logout')}
          <FontAwesomeIcon icon={faRightFromBracket} className="my-auto size-8" />
        </MenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type UserNameProps = {
  name?: string;
};

function UserName({ name }: UserNameProps): JSX.Element {
  return (
    <>
      {name !== undefined && (
        <DropdownMenuLabel className="text-md flex items-center border-b-2 border-slate-600 px-3 py-2 text-gray-300 sm:hidden">
          <FontAwesomeIcon icon={faUser} className="mr-2 size-4" />
          {name}
        </DropdownMenuLabel>
      )}
    </>
  );
}