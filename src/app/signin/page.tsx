"use client";
import Link from "next/link";
import { useState } from "react";
import Input from "@/app/components/ui/input";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleLogin = async () => {
    try {
      const data = {
        username: username.trim(),
        email: username.trim(),
        password: password.trim(),
      };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Something went wrong");
      }
  
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
      handleLogin()
    }
  };

  return (
    <main className="flex flex-col items-center h-full w-full m-auto gap-16 justify-center absolute">
      <h1 className="text-6xl font-medium text-zinc-800">Postfire</h1>
      <form onSubmit={onSubmit} className="flex flex-col w-80 gap-5">
        <div>
          <Input
            type="text"
            required={true}
            placeholder="Enter your username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            required={true}
            placeholder="Enter your Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="whitespace-pre-wrap font-medium text-red-500 m-1 text-base text-center">
            {error}
          </p>
        )}
        <button
          className={`rounded-md ${
            isProcessing ? "bg-zinc-600" : "bg-zinc-900"
          } text-center text-white outline outline-1 text-base mt-14 py-4 font-normal`}
          type="submit"
          disabled={isProcessing}
        >
          Login
        </button>
        <span className="text-center my-20">
          Don&apos;t have an account?{" "}
          <Link className="text-gray-600" href="/signup">
            Sign up
          </Link>
        </span>
      </form>
    </main>
  );
}