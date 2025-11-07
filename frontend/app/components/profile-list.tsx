import { ProfileCard  } from "./profile-card";
import type {ProfileCardProps} from "./profile-card";


type ProfileListProps = {
  sectionName: string
  profileCard: ProfileCardProps
  // aaPrefix?: string
};

export function ProfileList({
  sectionName,
  profileCard
}: ProfileListProps) {

  return (
    <div className="max-w-3xl">
      <h2 className="mb-4 mt-8 font-display text-3xl font-bold">
        {sectionName}
      </h2>
      <div className="col-start-1 row-start-1 justify-self-center text-xl">
          <ProfileCard
            key={profileCard.cardId}
            cardName={profileCard.cardName} cardId={"101"} 
            prefixIcon={profileCard.prefixIcon}
            description={profileCard.description}
            cardHref={profileCard.cardHref}/>

      </div>
      <div className="border-t-2 border-y-gray-100" />
    </div>
  );
};
