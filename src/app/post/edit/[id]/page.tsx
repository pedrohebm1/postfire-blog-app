import Navbar from "@/app/components/navbar/navbar";
import Sidebar from "@/app/components/sidebar/sidebar";
import PostEdit from "@/app/components/post/editsection";
import { authFetch } from "@/app/lib/authFetch";
import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  summary: string | null;
  bannerImage: string | null;
  allowCommentaries: boolean;
  author: {
    username: string;
    picture: string | null;
    description: string | null;
  };
}

async function getCookieData(): Promise<any> {
  const cookieData = cookies();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData.get("Authorization")?.value.toString());
    }, 1000)
  );
}

export default async function Edit({ params }: { params: { id: number } }) {
  const token = await getCookieData();

  let sessionUser = token ? await authFetch(token) : null;

  if (!sessionUser) {
    redirect("/signin");
  }

  const post: Post | null = await prisma.post.findUnique({
    where: {
      id: Number(params.id),
    },
    select: {
      id: true,
      title: true,
      content: true,
      author_id: true,
      summary: true,
      bannerImage: true,
      allowCommentaries: true,
      author: {
        select: {
          username: true,
          picture: true,
          description: true,
        },
      },
    },
  });

  if (sessionUser.id !== post?.author_id) {
    return (
      <div>
        <span>Access unauthorized.</span>
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }
  return (
    <main>
      <Navbar />
      <div className="flex flex-row pt-14">
        <Sidebar user={sessionUser} />
        <div className="flex flex-col w-screen lg:ml-40 lg:mr-40 mb-32 mx-10">
          <PostEdit post={post} />
        </div>
      </div>
    </main>
  );
}
