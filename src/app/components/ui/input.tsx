import Image from "next/image";
import { useState } from "react";

interface InputProps {
  name: string;
  type: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ name, type, required, placeholder, value, onChange }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="h-12 outline outline-1 outline-slate-300 rounded-ms bg-gray-100 w-full flex flex-row">
      <input
        name={name}
        type={showPassword ? "text" : type}
        required={required}
        placeholder={placeholder}
        className="flex-[5] mx-5 bg-inherit outline-none autofill-fix"
        autoComplete="off"
        value={value || ""}
        onChange={onChange}
      />
      {type === "password" && (
        <div className="flex items-center justify-center w-10 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
          <Image
            src={showPassword ? "/static/images/visible.png" : "/static/images/notvisible.png"}
            alt="Toggle visibility"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </div>
      )}
    </div>
  );
}
