import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { getIcon } from "./material-icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InlineLink } from "./links";

export type ProfileCardProps = {
  // dataCy?: string // TODO: to add with adobe analytics 
  cardId: string
  cardName: string
  cardHref?: string
  description?: string
  // aaPrefix?: string // TODO: to add with adobe analytics 
  prefixIcon?: string
};

export function ProfileCard({
  cardId,
  cardName,
  cardHref,
 description,
 // aaPrefix,
  prefixIcon
}: ProfileCardProps) {
  return (
    <div className="border-t-2 border-y-gray-100 text-base">
      <InlineLink
                    to="http://localhost:3000/en/inbox-notification-preferences-success">
                    
                  
      <a href={cardHref}>
        <div  className="m-4 grid grid-flow-col grid-cols-[36px_1fr_36px] grid-rows-2 items-center justify-items-center gap-2">
          <div className="col-start-1 row-start-1 justify-self-center text-xl">
            {getIcon(prefixIcon)}
          </div>
          <div className="col-start-2 row-start-1 justify-self-start font-display text-xl font-bold">
            {cardName}
          </div>
          <div className="col-start-3 row-start-1 text-2xl">
            {getIcon('chevron-right')}
          </div>
          <div className="col-start-2 row-start-2 justify-self-start text-base text-[#43474e]">
            {description}
          </div>
        </div>
        </a>
        </InlineLink>
    </div>
  );
};