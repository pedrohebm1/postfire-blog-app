"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Alert from "../ui/alert";
import Form from "./form";
import postValidation from "@/app/lib/validations/postValidation";

interface Author {
  username: string;
  picture: string | null;
  description: string | null;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  summary: string | null;
  bannerImage: string | null;
  allowCommentaries: boolean;
  author: Author;
}

interface State {
  title: string;
  summary: string | null;
  content: string;
  bannerImage: File | string | null;
  previewImage: string | null;
  allowComments: boolean;
}

export default function EditSection({ post }: { post: Post }) {
  const initialState: State = {
    title: post.title,
    summary: post.summary,
    content: post.content,
    bannerImage: "",
    previewImage: post.bannerImage,
    allowComments: post.allowCommentaries,
  };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAlertMessage, setShowDeleteAlertMessage] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [state, setState] = useState<State>(initialState);

  async function handleDelete() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/posts/delete/${post.id}`, {
        method: "DELETE",
      });
      if (res.status === 401) return router.push("/signin");
      if (!res.ok) throw new Error("Failed to delete post");

      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      setErrors([]);

      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("summary", state.summary || "");
      formData.append("content", state.content);
      formData.append("bannerimage", state.bannerImage as Blob);
      formData.append("allowcomments", state.allowComments.toString());

      const validation = postValidation({
        title: state.title,
        summary: state.summary,
        content: state.content,
        bannerImage: state.bannerImage as File | null,
      });
      if (!validation.valid) {
        console.error(validation.errors);
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 401) return router.push("/signin");

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update post");
      }
      window.location.href = `/post/${post.id}`;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 justify-center m-auto min-w-4/6 lg:w-8/12 pt-10 px-4 max-w-7xl"
      encType="multipart/form-data"
    >
      <h1 className="text-4xl w-full pb-10">Post edit</h1>
      {showDeleteAlertMessage && (
        <Alert
          message="Are you sure you want to delete?"
          submessage="This will delete this post permanently. You cannot undo this action."
          action={handleDelete}
          setState={setShowDeleteAlertMessage}
        />
      )}

      <Form state={state} setState={setState} />
      <div className="flex justify-end gap-5">
        <button
          type="submit"
          className="mt-10 bg-zinc-900 text-white py-2 px-4 rounded-md disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>

        <input
          className="mt-10 border-2 text-black py-2 px-4 rounded-md cursor-pointer"
          onClick={() => setShowDeleteAlertMessage(true)}
          disabled={isLoading}
          type="button"
          value="Delete"
        />
      </div>
      {errors.length > 0 && (
        <div className=" border border-red-400 px-4 py-3 rounded mb-4">
          <div className="inline-flex items-center gap-2 align-middle">
            <img className="w-5 h-5" src="/static/images/alert.svg"/>
            <strong className="font-bold">Error </strong>
          </div>
          <ul className="list-disc ml-5">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
