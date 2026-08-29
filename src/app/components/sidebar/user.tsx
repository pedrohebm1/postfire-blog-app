"use client";

import { useState, useEffect, useRef } from "react";
import UserDropdown from "./userdropdown";
import Link from "next/link";

interface User {
  id: number;
  username: string;
  email: string;
  picture: string;
}

export default function User(props: { user: any}) {
  const [isDroppedMenu, setDroppedMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Optional chaining ensures we don't throw if the ref becomes null mid-click
    const targetNode = event.target as Node;
    if (dropdownRef.current?.contains(targetNode) === false) {
      setDroppedMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  if (props.user) {
    return (
      <div className="relative flex flex-row ml-3 my-auto">
        <div className="flex gap-5">
          <img
            className="rounded-full"
            src={props.user.picture?props.user.picture:"/static/images/perfil.png"}
            width={40}
            height={40}
            alt="Profile Icon"
          />
          <span className="m-auto p-auto">{props.user.username}</span>
        </div>
        <div
          className="w-10 ml-auto mr-5 flex justify-center relative"
          onMouseEnter={() => setDroppedMenu(true)}
          onMouseLeave={() => setDroppedMenu(false)}
        >
          <img
            onClick={() => setDroppedMenu(!isDroppedMenu)}
            className="text-center opacity-90 h-7 pb-1 pt-1 mt-1 m-auto cursor-pointer"
            src="/static/images/threedots.png"
            alt="Menu"
          />
          {isDroppedMenu && (
            <div ref={dropdownRef} className="absolute right-0 mt-2">
              <UserDropdown user={props.user} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Link href={"/signup"} className="border-2 outline-offset-0 w-4/6 rounded-md text-center text-xs py-2">
        Register now
      </Link>
      <span className="text-xs">or</span>
      <Link
        href="/signin"
        className="border-2 w-4/6 rounded-md bg-zinc-900 text-center text-white outline outline-1 text-xs py-2"
      >
        Login
      </Link>
    </div>
  );
}