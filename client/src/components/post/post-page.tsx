import { useGetPostById } from "@/hooks/post/useGetPostById";
import { useParams } from "@tanstack/react-router";
import Spinner from "../ui/spinner";
import PostCard from "./post-card";
import CommentList from "../comment/comment-list";
import { useState } from "react";
import ProfileImage from "../profile/profile-image";
import { useAuth } from "@/context/auth";
import AddCommentModal from "../comment/add-comment-modal";

const PostPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { postId } = useParams({ strict: false });
  const { data: post, isLoading, error } = useGetPostById({ postId });
  const { user } = useAuth();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Something went wrong please try again.</div>;
  }

  if (!post) {
    return <div>Data not found</div>;
  }

  return (
    <div className="pb-40">
      <PostCard post={post} />
      <div className="pl-4 py-5 flex gap-4 items-center border-b">
        <ProfileImage username={user?.username as string} image={user?.display_image || ""} />
        <p onClick={openModal} className="text-xs">
          Add comment...
        </p>
      </div>
      <CommentList post={post} />
      <AddCommentModal closeModal={closeModal} isOpen={isOpen} post={post} />
    </div>
  );
};
export default PostPage;
