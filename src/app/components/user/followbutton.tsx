"use client";

import { useState } from "react";

export default function FollowButton({
  followers,
  id,
  isFollowingUser,
  isSameUser
}: {
  followers: number;
  id: number;
  isFollowingUser: boolean;
  isSameUser: boolean
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowingUser);
  const [isFetching, setIsFetching] = useState(false);
  const [followerCount, setFollowerCount] = useState(followers);

  const onClick = () => {
    if (isFetching) return;

    setIsFetching(true);

    fetch(`/api/user/follow/${id}`, {
      method: "POST",
      cache: "no-cache",
    })
      .then((res) => {
        if (res.status !== 200) return false;
        return res.json();
      })
      .then((data: { isFollowing: boolean }) => {
        if (data) {
          setIsFollowing(data.isFollowing);
          setFollowerCount((prev) => prev + (data.isFollowing ? 1 : -1));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return (
    <section className="text-center text-sm">
      <span className="flex flex-col items-center gap-2">
        {followerCount} followers{" "}
        {!isSameUser && <input
          className={"cursor-pointer w-20 h-8 mb-5 " + (isFollowing ? "bg-white text-zinc-900 border-1 border-zinc-900" : "bg-zinc-900 text-white") + " rounded-md px-2 py-1"}
          type="button"
          value={isFollowing ? "Unfollow" : " Follow "}
          onClick={onClick}
          disabled={isFetching}
        />}
      </span>
    </section>
  );
}
