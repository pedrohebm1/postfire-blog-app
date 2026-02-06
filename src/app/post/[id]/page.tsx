import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import { authFetch } from "@/app/lib/authFetch";
import CommentaryForm from "@/app/components/post/comments/form";
import PostContent from "@/app/components/post/content";
import Navbar from "@/app/components/navbar/navbar";
import Sidebar from "@/app/components/sidebar/sidebar";
import Card from "@/app/components/post/comments/card";

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

async function getPost(id: number): Promise<Post | null> {
  const post: Post | null = await prisma.post.findUnique({
    where: {
      id: Number(id),
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

  return post;
}

async function getCommentaries(postId: number): Promise<any[]> {
  const commentaries = await prisma.commentary.findMany({
    where: {
      postId: postId,
    },
    include: {
      userLikes: true,
      author: {
        select: {
          id: true,
          username: true,
          picture: true,
        },
      },
      subcommentaries: {
        include: {
          userLikes: true,
          author: {
            select: {
              id: true,
              username: true,
              picture: true,
            },
          },
          subcommentaries: {
            include: {
              userLikes: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  picture: true,
                },
              },
              subcommentaries: true,
            },
          },
        },
      },
    },
  });

  return commentaries;
}

export default async function Post({ params }: { params: { id: number } }) {
  const token = await getCookieData();

  let sessionUser = token ? await authFetch(token) : null;

  const post = await getPost(Number(params.id));
  if (!post) {
    return (
      <main>
        <Navbar />
        <div className="pt-14">
          <Sidebar user={sessionUser} userId={sessionUser?.id} />
          <p className="absolute justify-center align-middle top-2/4 m-auto left-2/4">
            Sorry but we couldn&apos;t find the post.
          </p>
        </div>
      </main>
    );
  }

  const commentaries = await getCommentaries(Number(params.id));

  return (
    <main>
      <Navbar />
      <main className="flex flex-row pt-14">
        <Sidebar user={sessionUser} userId={sessionUser?.id} />
        <div className="flex flex-col w-screen lg:ml-40 lg:mr-40 mb-32 mx-2 md:mx-10">
          <PostContent
            post={post}
            userId={sessionUser ? sessionUser.id : null}
          />

          <CommentaryForm
            allowCommentaries={post.allowCommentaries}
            postId={post.id}
            user={
              sessionUser
                ? {
                    id: sessionUser.id,
                    username: sessionUser.username,
                    email: sessionUser.email,
                    picture: sessionUser.picture,
                  }
                : null
            }
            commentaryId={undefined}
          />
          {post.allowCommentaries && (
            <section className="flex m-auto flex-col w-full lg:w-8/12 gap-10 px-4 max-w-7xl">
              <h2 className="text-2xl font-medium">Comments</h2>
              {commentaries
                .filter((commentary) => !commentary.parentCommentId)
                .map((commentary) => (
                  <Card
                    key={commentary.id}
                    commentary={commentary}
                    postAuthorId={post.author_id}
                    isLikingComment={
                      sessionUser
                        ? commentary.userLikes.some(
                            (user: any) => user.id === sessionUser.id
                          )
                        : false
                    }
                    user={sessionUser}
                  />
                ))}
            </section>
          )}
        </div>
      </main>
    </main>
  );
}
