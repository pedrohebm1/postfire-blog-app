"use client";
import Image from "next/image";
import Link from "next/link";

export default function UserDropdown(props : { user: any }) {
  function logout() {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" })
      .then((res) => {
        if (res.ok) {
          window.location.reload()
        }
      });
  }

  return (
    <div className="font-medium fixed bottom-16 left-50 w-48 outline outline-1  outline-slate-400 bg-white rounded-md overflow-visible">
      <div className="flex h-14 justify-start pl-3 items-center gap-2 border-b border-neutral-400 ">
        <img
          className="rounded-full"
          src={props.user.picture?props.user.picture:"/static/images/perfil.png"}
          width={40}
          height={40}
          alt="Profile Icon"
        />
        <div>
          <span className="leading-3 text-start text-sm">{props.user.username}</span>
          <p className="leading-3 text-start text-xxs truncate">{props.user.email}</p>
        </div>
      </div>

      <Link
        href={`/users/${props.user.id}`}
        className="h-8 flex flex-row justify-start gap-4 pl-3.5 items-center hover:bg-gray-100 cursor-pointer transition-colors duration-300"
      >
        <Image src="/static/images/perfil.png" width={20} height={20} alt="Profile icon" />
        <span className="text-xs text-nowrap">Your profile</span>
      </Link>

      <Link
        href="/settings"
        className="h-8 flex flex-row justify-start gap-4 pl-3.5 items-center hover:bg-gray-100 cursor-pointer transition-colors duration-300"
      >
        <Image src="/static/images/config.png" width={20} height={20} alt="Settings icon" />
        <span className="text-xs text-nowrap">Settings</span>
      </Link>

      <div
        onClick={logout}
        className="h-8 flex flex-row justify-start gap-4 pl-3.5 items-center hover:bg-gray-100 cursor-pointer transition-colors duration-300"
      >
        <Image src="/static/images/logout.png" width={20} height={20} alt="Logout icon" />
        <span className="text-xs text-nowrap">Log out</span>
      </div>
    </div>
  );
}