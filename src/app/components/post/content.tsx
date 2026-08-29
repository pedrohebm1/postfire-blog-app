import sanitizeHtml from "sanitize-html";
import Link from "next/link";
import Image from "next/image";
import "@/app/styles/postContent.css";

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  summary: string | null;
  bannerImage: string | null;
  author: {
    username: string;
    picture: string | null;
    description: string | null;
  };
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "u",
    "del",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height", "class"],
    a: ["href", "name", "target", "rel"],
  },
};

export default function PostContent({
  post,
  userId,
}: {
  post: Post;
  userId?: number;
}) {
  const sanitizedContent = sanitizeHtml(post.content || "", sanitizeOptions);

  return (
    <article className="flex flex-col gap-4 justify-center m-auto min-w-4/6 lg:w-8/12 pt-10 px-4 max-w-7xl">
      <h1 className="text-4xl sm:text-5xl text-left w-full self-center font-normal mb-10">
        {post.title}
      </h1>

      {post.author_id === userId && (
        <Link
          className="flex justify-end items-center gap-2 hover:opacity-80 transition-opacity"
          href={`/post/edit/${post.id}`}
        >
          <Image
            width={20}
            height={20}
            className="w-5 h-5"
            src="/static/images/pencil.png"
            alt="Edit post"
          />
          <span>Edit</span>
        </Link>
      )}

      <section className="relative h-64 sm:h-96 w-full overflow-hidden rounded-md">
        <img
          className="object-cover"
          src={post.bannerImage ?? "/static/images/owl.png"}
          alt={post.title}
        />
      </section>

      {post.summary && <i className="text-gray-700">{post.summary}</i>}

      <Link
        href={`/users/${post.author_id}`}
        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 group"
      >
        <div className="relative w-16 h-16 sm:w-12 sm:h-12 m-2 lg:ml-8">
          <img
            className="rounded-full object-cover"
            src={post.author.picture ?? "/static/images/defaultprofileicon.png"}
            alt={post.author.username}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-medium group-hover:text-slate-600 transition-colors duration-200">
            {post.author.username}
          </div>
          <span className="text-sm text-gray-600">
            {post.author.description ?? "Made by"}
          </span>
        </div>
      </Link>

      <section
        id="post-content"
        className="font-normal text-base pb-14 break-words whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  );
}