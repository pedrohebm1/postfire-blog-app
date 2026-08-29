"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/navbar/navbar";
import PostCreateForm from "../../components/post/form";
import { useRouter } from "next/navigation";
import postValidation from "../../lib/validations/postValidation";

export default function Create() {
  const router = useRouter();
  const [state, setState] = useState<any>({
    error: [] as string[],
    isFetching: false,
    title: "",
    summary: "",
    content: "",
    bannerImage: null as File | null,
    previewImage: null as string | null,
    allowComments: true,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.isFetching) return;

    const validation = postValidation({
      title: state.title,
      summary: state.summary,
      content: state.content,
      bannerImage: state.bannerImage,
    });

    if (!validation.valid) {
      setState((prev: any) => ({ ...prev, error: validation.errors }));
      return;
    }

    setState((prev: any) => ({ ...prev, error: [], isFetching: true }));

    const formData = new FormData();
    formData.append("title", state.title);
    formData.append("summary", state.summary);
    formData.append("content", state.content);
    formData.append("allowcomments", `${state.allowComments}`);

    if (state.bannerImage) {
      formData.append("bannerImage", state.bannerImage);
    }

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        router.push(`/signin`);
        return;
      }

      if (res.status === 400) {
        const errorData = await res.json();
        const backendErrors = Array.isArray(errorData.message) 
          ? errorData.message 
          : [errorData.message];
          
        setState((prev: any) => ({ ...prev, error: backendErrors }));
        return;
      }

      if (!res.ok) {
        throw new Error("An unexpected error occurred");
      }

      const data = await res.json();
      router.push(`/post/${data.id}`);
    } catch (error) {
      console.error(error);
      setState((prev: any) => ({ ...prev, error: [(error as Error).message] }));
    } finally {
      setState((prev: any) => ({ ...prev, isFetching: false }));
    }
  };

  return (
    <main>
      <Navbar responsiveTitle={false} allowSearchbar={false} />
      <form
        onSubmit={onSubmit}
        className="pt-28 px-4 lg:px-0 mx-10 sm:mx-20 lg:mx-64"
      >
        <PostCreateForm state={state} setState={setState} />
        
        {state.error.length > 0 && (
          <div className="mt-4 text-red-500">
            {state.error.map((err: string, index: number) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={state.isFetching}
          className="mt-10 bg-zinc-900 text-white py-2 px-4 rounded-md mx-auto flex justify-center disabled:opacity-50"
        >
          {state.isFetching ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}