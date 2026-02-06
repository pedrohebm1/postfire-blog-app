import sanitizeHtml from 'sanitize-html';
import Link from "next/link";
import "@/app/styles/postContent.css";

interface Post {
  id: number;
  title: string;
  content: any;
  author_id: number;
  summary: string | null;
  bannerImage: string | null;
  author: {
    username: string;
    picture: string | null;
    description: string | null;
  }
}

export default function PostContent({ post, userId }: { post: Post, userId?: number }) {
  const sanitizedContent = sanitizeHtml(post.content)

  return (
    <article className="flex flex-col gap-4 justify-center m-auto min-w-4/6 lg:w-8/12 pt-10 px-4 max-w-7xl"> 
      <h1 className="text-4xl sm:text-5xl text-left w-full self-center font-normal mb-10">{post.title}</h1>
      {post.author_id === userId && <Link className="flex justify-end items-center gap-2" href={`/post/edit/${post.id}`}><img className="w-5 h-5" src={'/static/images/pencil.png'}/> Edit</Link>}
      <section className="max-h-96 overflow-hidden rounded-md">
        <img
          className="w-full object-cover"
          src={post.bannerImage === null ? "/static/images/owl.png" : post.bannerImage}
          alt="Banner Image"
        />
      </section>
      <i>{post.summary}</i>
      <Link href={`/users/${post.author_id}`} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 p-auto">
        <img
          className="rounded-full w-16 h-16 sm:w-12 sm:h-12 m-2 lg:ml-8 cursor-pointer"
          src={post.author.picture ? post.author.picture : "/static/images/defaultprofileicon.png"}
          alt={post.author.username}
        />
        <div className="flex flex-col cursor-pointer">
          <div
            className="text-lg font-medium cursor-pointer hover:text-slate-600 transition-colors duration-200"
          >
            {post.author.username}
          </div>
          <span className="text-sm text-gray-600">{post.author.description ? post.author.description : "Made by"}</span>
        </div>
      </Link>
      <section id="post-content" className="font-normal text-base pb-14 break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </article>
  );
}
