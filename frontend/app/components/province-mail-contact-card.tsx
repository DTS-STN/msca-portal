type SingleProvContactCard = {
  prov: string;
  addressList: {
    title?: string;
    addr: string[];
  }[];
};
interface ProvinceMailContactAltCardProps {
  card: SingleProvContactCard;
}

export function ProvinceMailContactCard({ card }: ProvinceMailContactAltCardProps) {
  return (
    <>
      <div className="py-2">
        <details className="mb-5px font-body text-20px text-gray-darker">
          <summary className="border-gray-40 px-15px py-5px text-deep-blue-60d hover:text-blue-hover cursor-pointer rounded border outline-none select-none hover:underline">
            {card.prov}
          </summary>
          <div className="border-gray-40 px-18px py-5px cursor-pointer rounded-b border outline-none select-none">
            <div className="grid grid-cols-2 text-xl">
              {card.addressList.map((address, _index) => (
                <div
                  key={address.addr.join()}
                  className="font-display col-span-2 cursor-default py-3 select-text md:col-span-1"
                >
                  {address.title ? <p className="font-bold">{address.title}</p> : <></>}
                  {address.addr.map((addrLine, _index) => (
                    <p key={_index}>{addrLine}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </>
  );
}

interface AllProvinceContactCardsProps {
  props: {
    cards: SingleProvContactCard[];
  };
}

export function AllProvinceContactCards({ props }: AllProvinceContactCardsProps) {
  return (
    <>
      {props.cards.map((card, _index) => (
        <ProvinceMailContactCard key={card.prov} card={card} />
      ))}
    </>
  );
}
