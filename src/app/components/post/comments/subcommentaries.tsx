import Card from "./card";

export default function Subcommentaries({
  subcommentaries,
  depth,
  user,
  postAuthorId,
}: any) {
  if (!subcommentaries || subcommentaries.length === 0) {
    return null;
  }

  return (
    <div className={`ml-4 sm:ml-6 mt-4 pl-6 sm:pl-10 ${depth > 0 ? "border-l border-gray-300" : ""}`}>
      {subcommentaries.map((sub: any) => (
        <Card
          key={sub.id}
          commentary={sub}
          isLikingComment={user ? sub.userLikes.some((u: any) => u.id === user.id) : false}
          user={user}
          postAuthorId={postAuthorId}
        />
      ))}
    </div>
  );
}
