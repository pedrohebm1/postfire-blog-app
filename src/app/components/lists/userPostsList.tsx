import Link from "next/link";
import formatDate from "@/app/lib/validations/formatDate";

interface Post {
  id: number;
  title: string;
  createdAt: Date;
}

export default function userPostsList(posts: Post[]) {
  return (
    <>
      {posts.map((post: Post, key) => (
        <div key={key} className="flex flex-col justify-end">
          <Link href={"/post/" + post.id} className="text-lg self-end text-end cursor-pointer hover:text-slate-600 transition-colors duration-200">
            {post.title}
          </Link>
          <span className="text-gray-500 text-sm self-end">
            Created in {formatDate(post.createdAt, "minimal")}
          </span>
        </div>
      ))}
      {posts.length > 3 && <span>See all</span>}
    </>
  );
}
