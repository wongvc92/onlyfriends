import { IComment } from "@/types/IComment";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";

const CommentCard = ({ comment }: { comment: IComment }) => {
  return (
    <div className="w-full border-none">
      <div className="flex gap-2">
        <div className="flex gap-2">
          <ProfileImage image="https://github.com/shadcn.png" username={comment.username} />
        </div>

        <div className="bg-muted p-2 rounded-md space-y-1">
          <div className="flex items-center gap-2">
            <ProfileName name={comment.name} />
            <ProfileUsername username={comment.username} />
          </div>
          <p className="text-xs">{comment.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
