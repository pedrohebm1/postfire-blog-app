"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import User from "./user";

interface user {
  id: number;
  username: string;
  email: string;
  picture: string;
}

export default function Sidebar({ user }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="lg:hidden p-2 fixed top-2 left-2 z-50 bg-white"
        onClick={toggleSidebar}
      >
        <img src="/static/images/menu.png" alt="Menu" className="w-6 h-6" />
      </button>
      <div
        className={`fixed inset-0 z-0 mt-14 ml-60 bg-gray-800 bg-opacity-75 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <aside
        className={`fixed flex flex-col justify-between border-r-1 h-full pb-10 bg-white border-slate-300 w-60 transition-width transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col ml-5 gap-5 mt-10">
        <Link
            href="/post/create"
            className="flex gap-5 items-center cursor-pointer hover:text-slate-600 hover:bg-gray-900 transition-colors bg-black duration-200 w-40 p-2 rounded-full"
          >
            <div className="rounded-full bg-white w-5 h-5 text-center leading-5 text-xl">+</div>
            <span className="text-lg leading-4 font-light h-4 text-white">Create</span>
          </Link>
          <Link
            href="/"
            className="flex gap-5 items-center cursor-pointer hover:text-slate-600 transition-colors duration-200"
          >
            <Image
              src={"/static/images/home.png"}
              width={23}
              height={23}
              alt={"Home icon"}
            />
            <span className="text-lg leading-5 font-light h-4">Home</span>
          </Link>
        </div>
        <div className="flex flex-col gap-5 mb-5">
          <User user={user} />
        </div>
      </aside>
    </>
  );
}
