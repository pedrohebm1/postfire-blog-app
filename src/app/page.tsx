import Navbar from "@/app/components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import PostCards from "./components/post/postcards";
import { cookies } from "next/headers";
import { authFetch } from "./lib/authFetch";
import { getSessionUser } from "./lib/auth";

type Post = {
  postId: number;
  bannerImage: string;
  title: string;
  createAt: string;
  creator: {
    id: number;
    name: string;
  };
};

export default async function Home() {
  const sessionUser = await getSessionUser();

  return (
    <div>
      <Navbar />
      <main className="flex flex-row pt-14">
        <Sidebar user={sessionUser}/>
        <div className="flex flex-col w-screen lg:ml-40 lg:mr-40 mb-32 mx-5 md:mx-10">
          <PostCards />
        </div>
      </main>
    </div>
  );
}
