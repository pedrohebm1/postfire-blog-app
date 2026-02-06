import Navbar from "@/app/components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import PostCards from "./components/post/postcards";
import { cookies } from "next/headers";
import { authFetch } from "./lib/authFetch";

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

async function getCookieData(): Promise<any> {
  const cookieData = cookies()
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData.get("Authorization")?.value.toString())
    }, 1000)
  )
}

export default async function Home() {
  const token = await getCookieData();
  
    let sessionUser = token ? await authFetch(token) : null;
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
