// app/post/[id]/page.tsx
import { prisma } from "@/app/lib/client";
import { getSessionUser } from "@/app/lib/auth"; // Direct DB/JWT check
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

async function getPost(id: number): Promise<Post | null> {
  return await prisma.post.findUnique({
    where: { id },
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
}

async function getCommentaries(postId: number): Promise<any[]> {
  return await prisma.commentary.findMany({
    where: { postId },
    include: {
      userLikes: true,
      author: {
        select: { id: true, username: true, picture: true },
      },
      subcommentaries: {
        include: {
          userLikes: true,
          author: { select: { id: true, username: true, picture: true } },
          subcommentaries: {
            include: {
              userLikes: true,
              author: { select: { id: true, username: true, picture: true } },
              subcommentaries: true,
            },
          },
        },
      },
    },
  });
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Post({ params }: PageProps) {
  const sessionUser = await getSessionUser();

  const resolvedParams = await params;
  const rawId = Number(resolvedParams.id);

  const post = await getPost(rawId);

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

  const commentaries = await getCommentaries(rawId);

  return (
    <main>
      <Navbar />
      <main className="flex flex-row pt-14">
        <Sidebar user={sessionUser} userId={sessionUser?.id} />
        <div className="flex flex-col w-screen lg:ml-40 lg:mr-40 mb-32 mx-2 md:mx-10">
          <PostContent
            post={post}
            userId={sessionUser ? Number(sessionUser.id) : undefined}
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