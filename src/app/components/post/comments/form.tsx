"use client";
import Link from "next/link";
import { useState } from "react";

interface user {
  id: number;
  username: string;
  email: string;
  picture: string | null;
}

export default function Form(props: {
  postId: number;
  allowCommentaries: boolean;
  user: user | null;
  commentaryId?: number | null;
}) {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!props.allowCommentaries) {
    return (
      <div className="flex justify-center m-auto text-center text-xl font-medium py-8">
        Sorry, the comments in this post are disabled by the author
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);

      const data = !props.commentaryId
        ? {
            content: content,
            postId: props.postId,
          }
        : {
            postId: props.postId,
            content: content,
            commentaryid: props.commentaryId,
          };

      fetch(
        `${
          !props.commentaryId
            ? `/api/comments/${props.postId}`
            : `/api/comments/action/${props.postId}/comment`
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errorData) => {
              throw new Error(errorData.message || "Something went wrong");
            });
          }
          return res.json();
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }
  if (!props.user) {
    return (
      <div className="flex flex-col gap-4 justify-center align-middle m-auto min-w-4/6 lg:w-8/12 py-8 px-4 max-w-7xl">
        <textarea
          name="content"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className="resize-none w-full min-h-32 outline justify-self-center text-sm outline-1 outline-slate-400 rounded-md py-3 px-3 placeholder:italic"
          placeholder="Please sign in to comment."
          disabled
        />
        <div className="flex justify-end">
          <Link
            href={"/signin"}
            className="w-24 h-10 rounded-md bg-zinc-900 text-white outline outline-1 text-sm leading-10 text-center hover:bg-zinc-700 transition duration-200"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (props.user) {
    return (
      <div
        className={
          "flex flex-col gap-4 justify-center m-auto w-full " +
          `${props.commentaryId ? "lg:w-11/12" : "lg:w-8/12"}` +
          " py-8 px-4 max-w-7xl"
        }
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-start"> {/* Alinhamento vertical melhorado */}
            <img
              className="w-10 h-10 rounded-full"
              src={props.user.picture?props.user.picture:"/static/images/defaultprofileicon.png"}
              alt={props.user.username}
            />
            <textarea
              name="content"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              className="resize-none flex-grow min-h-24 outline justify-self-center text-sm outline-1 outline-slate-400 rounded-md py-3 px-3 placeholder:italic"
              placeholder="Share your thoughts on this post."
            />
          </div>
          <div className="flex justify-end">
            <button
              className="w-24 h-10 rounded-md bg-zinc-900 text-white outline outline-1 text-sm hover:bg-zinc-700 transition duration-200"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}