"use client";

import { useState, useEffect } from "react";
import AccountSection from "../components/ui/accountsection";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "../components/ui/loading";
import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";

export default function Settings() {
  const [currentSection, setCurrentSection] = useState<string>("account");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/authenticate", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/signin");
          return false;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser({
            ...data.user,
          });
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSectionChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentSection(e.currentTarget.name);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen m-auto">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar/>
     <div className="pt-14">
             <Sidebar user={user}/>
       <div className="mt-10">
         <div className="flex flex-col items-center w-5/6 lg:w-3/6 m-auto max-lg:mt-10">
         <h1 className="p-5 mb-5 self-start text-4xl">Settings</h1>
           <aside className="flex content-between flex-row w-full justify-between mb-14">
             <button
               name="account"
               onClick={handleSectionChange}
               className={`text-xl text-center w-1/3 border-b-2 m-0 p-0 ${
                 currentSection === "account"
                   ? " border-slate-800"
                   : "border-slate-400"
               }`}
             >
               Account
             </button>
             <button
               name="privacy"
               onClick={handleSectionChange}
               className={`text-xl text-center w-1/3 border-b-2 m-0 p-0 ${
                 currentSection === "privacy"
                   ? " border-slate-800"
                   : "border-slate-400"
               }`}
             >
               Privacy
             </button>
             <button
               name="security"
               onClick={handleSectionChange}
               className={`text-xl text-center w-1/3 border-b-2 m-0 p-0 ${
                 currentSection === "security"
                   ? " border-slate-800"
                   : "border-slate-400"
               }`}
             >
               Security
             </button>
           </aside>
           {currentSection === "account" && user != null && (
             <AccountSection user={user} />
           )}
         </div>
       </div>
     </div>
    </div>
  );
}
