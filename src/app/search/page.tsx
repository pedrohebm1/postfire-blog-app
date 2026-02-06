import Navbar from "../components/navbar/navbar";
import Sidebar from "../components/sidebar/sidebar";
import { cookies } from "next/headers";
import { authFetch } from "../lib/authFetch";
import Searchresults from "../components/ui/searchresults";


async function getCookieData(): Promise<any> {
  const cookieData = cookies()
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData.get("Authorization")?.value.toString())
    }, 1000)
  )
}

export default async function Search() {
  const token = await getCookieData();
  
    let sessionUser = token ? await authFetch(token) : null;
  return (
    <div>
      <Navbar />
      <div className="pt-14">
        <Sidebar user={sessionUser}/>
        <div className="md:ml-20 md:mr-20 mb-32">
          <Searchresults/>
        </div>
      </div>
    </div>
  );
}
