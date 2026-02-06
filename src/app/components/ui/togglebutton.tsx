import { SetStateAction } from "react";

export default function ToggleButton({
  state,
  setState,
}: {
  state: boolean;
  setState: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`flex items-center w-16 h-8 outline outline-1 outline-slate-200 rounded-full cursor-pointer duration-200 ${
        state ? "bg-zinc-900" : "bg-gray-200"
      }`}
      onClick={() => setState(!state)}
    >
      <div
        className={`duration-200 ease-in-out transition-transform w-6 h-6 bg-white mx-1 rounded-full transform ${
          state ? "translate-x-0" : "translate-x-8"
        }`}
      />
    </div>
  );
}
