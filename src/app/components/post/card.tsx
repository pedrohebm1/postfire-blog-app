import Link from "next/link";

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

type Settings = {
    allowBanner: boolean;
}

export default function Postcard({ post, settings }: { post: Post; settings: Settings }) {
  return (
    <div className="flex flex-col rounded-md overflow-hidden shadow-lg outline outline-1 outline-slate-200 pb-5">
    {settings.allowBanner === true && (
      <div className="h-64 overflow-hidden cursor-pointer max-w-3xl w-full">
        <img
          className="w-full h-full object-cover"
          src={post.bannerImage || "/static/images/owl.png"}
          alt={post.title}
        />
      </div>
    )}
    <div className="mt-4 w-5/6 m-auto">
      <Link
        className="hover:text-slate-700 text-2xl transition-colors duration-200 cursor-pointer"
        href={`post/${post.id}`}
      >
        {post.title}
      </Link>
      <br />
      <span className="text-sm">
        by
        <Link
          className="hover:text-slate-700 transition-colors duration-200 cursor-pointer ml-1"
          href={`users/${post.author_id}`}
        >
          {post.author.username}
        </Link>
      </span>
    </div>
  </div>
  
  );
}
