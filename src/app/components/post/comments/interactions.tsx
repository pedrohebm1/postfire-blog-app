"use client";

import { useState } from "react";
import CommentaryForm from "./form";
import { useRouter } from "next/navigation";
import Alert from "@/app/components/ui/alert";

export default function Interactions({
  id,
  likes,
  depth,
  isLikingComment,
  user,
  allowDeleteAction,
}: {
  id: number;
  likes: number;
  depth: number;
  isLikingComment?: boolean;
  user: any;
  allowDeleteAction: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(isLikingComment);
  const [isFetching, setIsFetching] = useState(false);
  const [followerCount, setFollowerCount] = useState(likes);
  const [openCommentForm, setOpenCommentForm] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const router = useRouter();

  const handleLike = () => {
    if (!user) {
      return router.push("/signin");
    }
    if (isFetching) return;

    setIsFetching(true);

    fetch(`/api/comments/action/${id}/like`, {
      method: "POST",
      cache: "no-cache",
    })
      .then((res) => {
        if (res.status !== 201) return false;
        return res.json();
      })
      .then((data: { isLiking: boolean }) => {
        if (data) {
          setIsFollowing(data.isLiking);
          setFollowerCount((prev) => prev + (data.isLiking ? 1 : -1));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const handleDelete = () => {
    if (!user) {
      return router.push("/signin");
    }
    if (isFetching) return;

    setIsFetching(true);

    fetch(`/api/comments/action/${id}/delete`, {
      method: "DELETE",
      cache: "no-cache",
    })
      .then((res) => {
        if (res.status !== 201) {
          router.refresh();
          return false
        }
        return res.json();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }

  const showButton = () => {
    if (!user) {
      return router.push("/signin");
    }
    setOpenCommentForm(!openCommentForm);
  };

  return (
    <>
      <span className="text-center text-sm flex flex-row items-center justify-end gap-2">
        <div className="flex flex-row items-center gap-2">
          <button onClick={handleLike}>
            {!isFollowing && (
              <img
                className="w-6 h-6"
                src="/static/images/thumbsup.png"
                alt="Icon made by Icons8"
              />
            )}
            {isFollowing && (
              <img
                className="w-6 h-6"
                src="/static/images/thumbsupfilled.png"
                alt="Icon made by Icons8"
              />
            )}
          </button>
          <span>{followerCount}</span>
        </div>
        {depth < 2 && (
          <button onClick={showButton}>
            <img
              className="w-6 h-6"
              src="/static/images/comment.png"
              alt="Icon made by Icons8"
            />
          </button>
        )}
        { allowDeleteAction &&
          <button className="cursor-pointer" onClick={() => setOpenDeleteAlert(true)}>
            <img className="w-6 h-6" src="/static/images/trashcan.svg" />
          </button>
        }
      </span>
      {openCommentForm && (
        <CommentaryForm
          postId={1}
          allowCommentaries={true}
          user={user}
          commentaryId={id}
        />
      )}
      {openDeleteAlert && 
      <Alert
        message="Delete this commentary?"
        submessage="This action cannot be undone."
        action={handleDelete}
        setState={setOpenDeleteAlert}
      />}
    </>
  )
}
