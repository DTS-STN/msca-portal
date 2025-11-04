import { ReactNode } from 'react';

const tableRowStyle = 'grid grid-cols-1 py-2 md:grid-cols-12';
const dtStyle = 'text-2xl font-bold text-gray-darker md:col-span-4 md:pl-3';
const ddStyle = 'md:col-span-8 font-body text-xl px-2';

interface ContactTableRowProps {
  dtElement: ReactNode;
  ddElement: ReactNode;
  bgStyle?: string;
}

export default function ContactTableRow({ dtElement, ddElement, bgStyle = '' }: ContactTableRowProps) {
  return (
    <>
      <div className={tableRowStyle}>
        <dt className={dtStyle + ' ' + bgStyle}>{dtElement}</dt>
        <dd className={ddStyle + ' ' + bgStyle}>{ddElement}</dd>
      </div>
    </>
  );
}
