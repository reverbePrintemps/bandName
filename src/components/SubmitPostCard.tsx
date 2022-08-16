import { CreatePostProps } from "../lib/submit";
import { Card, CardKind } from "./Card";

type SubmitPostCardProps = {
  uid: string;
  username: string;
  onSubmit: ({
    e,
    uid,
    title,
    genre,
    country,
    username,
  }: CreatePostProps) => void;

  onCancelSubmission: () => void;
};

export const SubmitPostCard = ({
  uid,
  username,
  onSubmit,
  onCancelSubmission,
}: SubmitPostCardProps) => {
  return (
    <Card
      kind={CardKind.Submit}
      uid={uid}
      slug={""}
      title={""}
      genre={""}
      country={""}
      clapCount={0}
      isOwner={false}
      description={""}
      postRef={undefined}
      username={username}
      onSubmit={onSubmit}
      createdAt={undefined}
      onCancelSubmission={onCancelSubmission}
    />
  );
};
