"use client";
import { useEffect, useRef, useState } from "react";
import Postcard from "./card";

type Post = {
  id: number;
  bannerImage: string;
  title: string;
  createdAt: string;
  author_id: string;
  author: {
    username: string;
  };
};

export default function PostCards() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReachedFinal, setReachedFinal] = useState<boolean>(false);
  const [lastPostId, setLastPostId] = useState<number>(0);
  const effectRan = useRef(false);

  const loadFromSessionStorage = () => {
    const savedPosts = sessionStorage.getItem("posts");
    const savedLastPostId = sessionStorage.getItem("lastPostId");
    const savedIsReachedFinal = sessionStorage.getItem("isReachedFinal");

    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedLastPostId) setLastPostId(Number(savedLastPostId));
    if (savedIsReachedFinal) setReachedFinal(savedIsReachedFinal === "true");
  };

  const saveToSessionStorage = () => {
    sessionStorage.setItem("posts", JSON.stringify(posts));
    sessionStorage.setItem("lastPostId", lastPostId.toString());
    sessionStorage.setItem("isReachedFinal", isReachedFinal.toString());
  };

  const shouldUpdateSessionStorage = (newPosts: Post[]) => {
    const savedPosts = sessionStorage.getItem("posts");
    if (!savedPosts) return true;

    const parsedSavedPosts = JSON.parse(savedPosts);
    return JSON.stringify(parsedSavedPosts) !== JSON.stringify(newPosts);
  };

  useEffect(() => {
    if (shouldUpdateSessionStorage(posts)) {
      saveToSessionStorage();
    }
  }, [posts, lastPostId, isReachedFinal]);

  const fetchPosts = async () => {
    if (isReachedFinal) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/range/${lastPostId}`);
      if (!response.ok) {
        throw new Error(`Error fetching posts: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.Posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.Posts]);
        setLastPostId(data.Posts[data.Posts.length - 1].id);

        if (data.Posts[data.Posts.length - 1].id === 1) {
          setReachedFinal(true);
        }
      } else {
        setReachedFinal(true);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFromSessionStorage();
    if (posts.length === 0) fetchPosts();
    effectRan.current = true;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !isReachedFinal) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    const lastPost = document.querySelector(".postcard:last-child");
    if (lastPost) {
      observer.observe(lastPost);
    }

    return () => {
      if (lastPost) {
        observer.unobserve(lastPost);
      }
    };
  }, [loading, isReachedFinal]);

  return (
    <section className="flex flex-col gap-4 justify-center m-auto min-w-4/6 lg:w-7/12 pt-10 max-w-[700px]">
      {posts.map((post) => (
        <Postcard settings={{ allowBanner: true }} key={post.id} post={post} />
      ))}
    </section>
  );
}