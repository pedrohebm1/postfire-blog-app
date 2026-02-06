import formatDate from "@/app/lib/validations/formatDate";
import Link from "next/link";
import Interactions from "./interactions";
import Subcommentaries from "./subcommentaries";

export default function Card({
  commentary,
  isLikingComment,
  user,
  postAuthorId,
}: {
  commentary: any;
  isLikingComment: boolean;
  user: any;
  postAuthorId: any;
}) {
  return (
    <div className="my-5 flex flex-col w-full">
      <div className="flex items-start gap-4 sm:gap-5">
        <Link href={"/users/"+commentary.author.id}>
          <img
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
            src={
              commentary.isDeletedContent === false
                ? commentary.author.picture ?? "/static/images/perfil.png"
                : "/static/images/perfil.png"
            }
            alt=""
          />
        </Link>
        <div className="flex-1">
          <Link
            href={`/users/${commentary.author_id}`}
            className="text-sm sm:text-lg font-medium"
          >
            {commentary?.isDeletedContent === false
              ? commentary.author.username
              : "[Deleted user]"}
          </Link>
          {commentary?.isDeletedContent === false && (
            <p className="text-xs sm:text-sm text-gray-600">
              {formatDate(commentary.createdAt, "relative")}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm sm:text-lg mt-3 sm:mt-5 break-words">
        {commentary.content}
      </p>
      {commentary?.isDeletedContent === false && (
        <Interactions
          id={commentary.id}
          depth={commentary.depth}
          likes={commentary.userLikes?.length || 0}
          isLikingComment={isLikingComment}
          user={user}
          allowDeleteAction={
            user
              ? user.id === commentary.author_id || user.id === postAuthorId
              : false
          }
        />
      )}
      <Subcommentaries
        subcommentaries={commentary.subcommentaries || []}
        depth={commentary.depth}
        user={user}
        postAuthorId={postAuthorId}
      />
    </div>
  );
}
