export default function Alert({message, submessage, action, setState}: {message: string, submessage: string, action: any, setState: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <div className="absolute top-0 w-full left-0">
        <div className="fixed flex items-center justify-center h-screen w-full opacity-70 bg-black z-20"></div>
        <div className="fixed flex items-center justify-center h-screen w-full opacity-100 z-20">
        <div className="flex flex-col h-64 rounded-md p-5 outline outline-1 outline-slate-200 bg-white gap-3 z-10">
            <span className="text-3xl">{message}</span>
            <span className="text-lg">{submessage}</span>
            <div className="flex self-end gap-10 mr-5 mt-16">
                <input className="border-2 w-28 h-14 rounded-md bg-black text-center text-white outline outline-1 py-2 cursor-pointer" type="button" value="Delete" onClick={action}/>
                <input className="border-2 outline-offset-0 w-28 h-14 rounded-md text-center py-2 cursor-pointer" type="button" value="Cancel" onClick={() => setState(false)}/>
            </div>
        </div>
      </div>
    </div>
  );
}
