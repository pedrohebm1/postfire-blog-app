import Link from "next/link";

export default function UserCard({user}: any) {
  console.log(user.user)
  return (
    <Link
      href={`/users/${user.id}`}
      key={user.id}
      className="flex flex-row gap-5 shadow-lg outline outline-1 outline-slate-200 rounded-md p-5"
    >
      <img
        className="w-14 rounded-full"
        src={user.picture ? user.picture : "static/images/perfil.png"}
        alt=""
      />
      <div className="flex flex-col align-middle">
        <span className="text-xl">{user.username}</span>
        <span className="text-gray-600 text-sm">{user.description}</span>
      </div>
    </Link>
  );
}
