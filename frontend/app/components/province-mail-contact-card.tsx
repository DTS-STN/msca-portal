type ProvinceMailContactCardProps = {
  addrs: {
    summary: string;
    forReports: {
      title: string;
      addr: string[];
    };
    forDocs: {
      title: string;
      addr: string[];
    };
  };
};

export default function ProvinceMailContactCard({ addrs }: ProvinceMailContactCardProps) {
  return (
    <>
      <div className="py-2">
        <details className="mb-5px font-body text-20px text-gray-darker">
          <summary className="border-gray-40 px-15px py-5px text-deep-blue-60d hover:text-blue-hover cursor-pointer rounded border outline-none select-none hover:underline">
            {addrs.summary}
          </summary>
          <div className="border-gray-40 px-18px py-5px cursor-pointer rounded-b border outline-none select-none">
            <div className="grid grid-cols-2 text-xl">
              <div className="font-display col-span-2 cursor-default py-3 select-text md:col-span-1">
                <p className="font-bold">{addrs.forReports.title}</p>
                {addrs.forReports.addr.map((addrLine, _index) => (
                  <p key={_index}>{addrLine}</p>
                ))}
              </div>
              <div className="font-display col-span-2 cursor-default py-3 select-text md:col-span-1">
                <p className="font-bold">{addrs.forDocs.title}</p>
                {addrs.forDocs.addr.map((addrLine, _index) => (
                  <p key={_index}>{addrLine}</p>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}
