import Searchbar from "../ui/searchbar";
import Link from "next/link";

export default function Navbar({ allowSearchbar = true, responsiveTitle = true }: { allowSearchbar?: boolean, responsiveTitle?: boolean }) {
  return (
    <div className="fixed flex h-14 w-full m-0 p-0 outline outline-1 items-center outline-slate-300 bg-white -outline-offset-1 z-10">
      <Link translate="no" href="/" className={`ml-14 text-2xl absolute ${responsiveTitle===true?"hidden":""} md:block`}>Postfire</Link>
      {allowSearchbar && <Searchbar/>}
    </div>
  )
}