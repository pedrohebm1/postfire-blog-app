export const dynamic = "force-dynamic";
export const revalidate = 0;
import React from "react";
import Navbar from "@/app/components/navbar/navbar";
import Sidebar from "@/app/components/sidebar/sidebar";
import userPostsList from "@/app/components/lists/userPostsList";
import { authFetch } from "@/app/lib/authFetch";
import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import Link from "next/link";
import FollowButton from "@/app/components/user/followbutton";
import "@/app/styles/quillEditor.css";
import formatDate from "@/app/lib/validations/formatDate";

async function getCookieData(): Promise<any> {
  const cookieData = cookies();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData.get("Authorization")?.value.toString());
    }, 1000)
  );
}

export default async function user({
  params,
}: {
  params: { id: string; data: any };
}) {
  const token = await getCookieData();

  let sessionUser = token ? await authFetch(token) : null;

  if (!(params.id && Number(params.id))) {
    return <div>Bad request</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: {
      id: true,
      username: true,
      picture: true,
      userBanner: true,
      description: true,
      socialGithub: true,
      socialInstagram: true,
      socialWebsite: true,
      socialTwitter: true,
      createdAt: true,
      bio: true,
      _count: { select: { followedBy: true } },
      posts: { take: 4 },
    },
  });

  const isFollowing = sessionUser
    ? await prisma.user.findFirst({
        where: {
          id: sessionUser.id,
          following: {
            some: {
              id: Number(params.id),
            },
          },
        },
      })
    : null;

  return (
    <main>
      <Navbar />
      <div className="flex flex-row pt-14">
        <Sidebar user={sessionUser} />
        <div className="flex flex-col w-screen lg:ml-40 lg:mr-40 mb-32 mx-5 md:mx-10">
          {user && (
            <div className="flex flex-col gap-4 justify-center m-auto w-full lg:w-8/12 pt-10 max-w-7xl">
              <div
                id="banner"
                className="flex items-center justify-center overflow-hidden w-full h-60 md:h-56 lg:h-64 xl:h-80 rounded-t-xl"
              >
                {user.userBanner ? (
                  <img
                    className="w-full h-full object-cover"
                    src={user.userBanner}
                    alt="User banner"
                  />
                ) : (
                  <div className="w-full h-full object-cover bg-gray-600"/>
                )}
              </div>

              <div className="flex flex-col xl:flex-row mb-24">
                <div className="w-full xl:w-4/12">
                  <div className="flex flex-col justify-center gap-2">
                    <img
                      className="h-32 m-auto border-4 border-white rounded-full -mt-20 bg-white"
                      src={`${
                        user.picture
                          ? user.picture
                          : "/static/images/perfil.png"
                      }`}
                      alt=""
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-center text-2xl">
                        {user.username}
                      </span>
                      <span className="text-center text-xl text-gray-600">
                        {user.description ? user.description : ""}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {sessionUser && (
                        <FollowButton
                          followers={user._count.followedBy}
                          id={user.id}
                          isFollowingUser={!!isFollowing}
                          isSameUser={sessionUser?.id == user.id}
                        />
                      )}
                      <span className="text-center text-sm">
                        Member since {formatDate(user.createdAt, "minimal")}.
                      </span>
                    </div>
                  </div>
                  <div
                    id="contacts"
                    className="flex flex-col justify-center mt-5 gap-5"
                  >
                    {user.socialInstagram && (
                      <Link
                        href={user.socialInstagram}
                        target={"_blank"}
                        className="flex flex-row gap-2 justify-start h-4 m-auto md:m-0"
                      >
                        <img
                          className="w-4 select-none"
                          src="/static/images/instagram.png"
                          alt="Instagram icon made by Freepik - Flaticon"
                        />
                        <span className="text-xs leading-4">
                          {user.socialInstagram}
                        </span>
                      </Link>
                    )}
                    {user.socialTwitter && (
                      <Link
                        href={user.socialTwitter}
                        target={"_blank"}
                        className="flex flex-row gap-2 justify-start h-4 m-auto md:m-0"
                      >
                        <img
                          className="w-4 select-none"
                          src="/static/images/twitter.png"
                          alt="X icon made by Freepik - Flaticon"
                        />
                        <span className="text-xs leading-4">
                          {user.socialTwitter}
                        </span>
                      </Link>
                    )}
                    {user.socialGithub && (
                      <Link
                        href={user.socialGithub}
                        target={"_blank"}
                        className="flex flex-row gap-2 justify-start h-4 m-auto md:m-0"
                      >
                        <img
                          className="w-4 select-none"
                          src="/static/images/github.png"
                          alt="Github icon made by icons8"
                        />
                        <span className="text-xs leading-4">
                          {user.socialGithub}
                        </span>
                      </Link>
                    )}
                    {user.socialWebsite && (
                      <Link
                        href={user.socialWebsite}
                        target={"_blank"}
                        className="flex flex-row gap-2 justify-start h-4 m-auto md:m-0"
                      >
                        <img
                          className="w-4 select-none"
                          src="/static/images/website.png"
                          alt="Website icon made by icons8"
                        />
                        <span className="text-xs leading-4">
                          {user.socialWebsite}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="m-0 w-full md:w-8/12 md:m-5 pt-5 md:pt-0">
                  <h1 className="text-2xl font-medium">About me</h1>
                  <p className="indent-8 mt-5">
                    {user.bio == null ? "No information given." : user.bio}
                  </p>
                </div>
              </div>
              <div className="w-3/4 m-auto md:w-2/4 md:m-0">
                {user.posts.length > 0 && (
                  <h1 className="text-2xl font-medium mb-10">Posts</h1>
                )}
                {userPostsList(user.posts)}
              </div>
            </div>
          )}
          {!user && (
            <div className="absolute justify-center align-middle top-2/4 m-auto left-2/4">
              User not found
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
