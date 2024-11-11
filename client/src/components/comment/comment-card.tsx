import { IComment } from "@/types/IComment";
import ProfileImage from "../profile/profile-image";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import { Link } from "@tanstack/react-router";
import CommentAction from "./comment-action";

const CommentCard = ({ comment }: { comment: IComment }) => {
  const renderCommentWithMentions = (text: string) => {
    // Regular expression to detect words that start with "@"
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        // Style the mention with blue color
        return (
          <Link key={index} className="text-sky-600" to={`/${part.slice(1, part.length)}`}>
            {part}
          </Link>
        );
      }
      return part; // Regular text remains unstyled
    });
  };

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
            <CommentAction comment={comment}/>
          </div>
          <p className="break-all text-sm">{renderCommentWithMentions(comment.comment)}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
