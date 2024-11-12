import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { getrelativeTime } from "@/utils/getrelativeTime";
import PostACtion from "../post/post-action";
import PostComment from "./post-comment";
import CommentList from "./comment-list";
import ProfileName from "../profile/profile-name";
import ProfileUsername from "../profile/profile-username";
import ProfileImage from "../profile/profile-image";
import Likes from "../post/Likes";
import { PiShareFatBold } from "react-icons/pi";
import Modal from "../ui/modal";
import { IPost } from "@/types/IPost";
import { FaRegComment } from "react-icons/fa";
import { Button } from "../ui/button";

interface CommentModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  post: IPost;
  commentCount?: number;
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  setIsOpen,
  post,
  commentCount,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      classname="overflow-y-scroll md:w-fit px-2 pb-0"
    >
      <Card>
        <CardHeader>
          <div className="flex gap-1 items-start">
            <ProfileImage
              image="http://sadasdasdasd.com"
              username={post.username}
            />
            <CardTitle>
              <div className="flex flex-wrap items-center gap-1">
                <ProfileName name={post.name} />
                <ProfileUsername username={post.username} />
                <DotFilledIcon />
                <p className="text-muted-foreground font-light">
                  {getrelativeTime(post.created_at)}
                </p>
              </div>
            </CardTitle>
            <div className="ml-auto">
              <PostACtion post={post} />
            </div>
          </div>
        </CardHeader>
        <CardContent>{post.post}</CardContent>
        <CardFooter className="flex items-center justify-between md:justify-start md:gap-10">
          <Likes post={post} />
          <div className="flex items-center">
            <Button
              type="button"
              size="icon"
              variant="link"
              onClick={() => setIsOpen(!isOpen)}
              disabled={isOpen}
            >
              <FaRegComment />
              <span className="text-xs text-muted-foreground">
                {commentCount || 0}
              </span>
            </Button>
          </div>
          <PiShareFatBold />
        </CardFooter>
      </Card>
      <CommentList post={post} />
      <PostComment post={post} />
    </Modal>
  );
};

export default CommentModal;
