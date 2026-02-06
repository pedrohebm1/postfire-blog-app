"use client";
import { useEffect, useState } from "react";
import Postcard from "../post/card";
import { useSearchParams } from "next/navigation";
import UserCard from "../search/usercard";

interface User {
  id: number;
  username: string;
  picture: string | null;
  description: string | null;
}

interface Post {
  id: number;
  bannerImage: string;
  title: string;
  createdAt: string;
  author_id: string;
  author: {
    username: string;
  };
}

export default function Searchresults() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentCategory, setCurrentCategory] = useState<
    "posts" | "users" | null
  >("posts");
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<number>(0);
  const [reachedFinal, setReachedFinal] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("category")) {
      const category = searchParams.get("category");
      if (category === "users" || category === "posts") {
        setCurrentCategory(category);
      }
    }
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    const query = searchParams.get("query");
    const category = searchParams.get("category");

    try {
      const response = await fetch(
        `/api/search?query=${query}&category=${category}&lastId=${lastId}`
      );
      const data = await response.json();

      if (category === "posts") {
        if (data.Posts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...data.Posts]);
          setLastId(data.Posts[data.Posts.length - 1].id);
          if (data.Posts.length < 10) {
            setReachedFinal(true);
          }
        } else {
          setNoResults(true);
        }
      } else if (category === "users") {
        if (data.Users.length > 0) {
          setUsers((prevUsers) => [...prevUsers, ...data.Users]);
          setLastId(data.Users[data.Users.length - 1].id);
          if (data.Users.length < 10) {
            setReachedFinal(true);
          }
        } else {
          setNoResults(true);
        }
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsFetched(true);
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      !reachedFinal
    ) {
      fetchResults();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, reachedFinal]);

  return (
    <>
      {isFetched === true && (
        <div className="flex flex-col m-auto align-middle justify-center w-full pt-10 min-w-3/6 md:6/12 lg:w-4/12 px-4 md:px-0">
          <h1 className="text-3xl mb-10">
            Search results for {currentCategory}
          </h1>
          {noResults && (
            <div className="flex flex-col justify-center m-auto items-center my-40 gap-5">
              <img
                className="w-20"
                src="/static/images/noresults.png"
                alt="No results"
              />
              <p className="text-xl font-medium">
                Sorry but we couldn&apos;t find for what you are looking
              </p>
            </div>
          )}
          <div className="flex flex-col gap-5 my-10">
            {currentCategory === "posts" &&
              posts.map((post) => (
                <Postcard
                  settings={{ allowBanner: false }}
                  key={post.id}
                  post={post}
                />
              ))}
            {currentCategory === "users" &&
              users.map((user) => <UserCard key={user.id} user={user} />)}
            {reachedFinal && (
              <div className="my-10 flex gap-5 flex-row w-full justify-center items-center m-auto">
                <img
                  className="w-10"
                  src="/static/images/roadblock.png"
                  alt="created by Ahmad Roaayala - Flaticon"
                />
                <p className="font-medium">You have reached the end</p>
                <img
                  className="w-10"
                  src="/static/images/roadblock.png"
                  alt="created by Ahmad Roaayala - Flaticon"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
