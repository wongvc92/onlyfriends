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
import ImageSlider from "../image/image-slider";

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
      classname="h-[90vh] overflow-y-scroll"
    >

    </Modal>
  );
};

export default CommentModal;
