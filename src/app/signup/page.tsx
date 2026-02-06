"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Input from "../components/ui/input";

export default function Register() {
  const router = useRouter();

  // Input states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Processing and error state
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validation rules
  const isValidUsername = useMemo(
    () => /^[a-zA-Z0-9_]{5,13}$/.test(username),
    [username]
  );

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  const isValidPassword = useMemo(() => password.length >= 8, [password]);

  const isPasswordMatch = useMemo(
    () => password.length > 0 && password === repeatPassword,
    [password, repeatPassword]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isValidUsername || !isValidEmail || !isValidPassword || !isPasswordMatch) {
      return;
    }

    setIsProcessing(true);
    setServerError("");

    const data = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      confirmPassword: repeatPassword.trim(),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/");
      } else if (res.status === 409) {
        setServerError("User already exists");
      }
    } catch (err) {
      console.error(err);
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="flex flex-col items-center h-full w-full m-auto gap-16 justify-center absolute">
      <h1 className="text-6xl font-medium text-zinc-800">Postfire</h1>
      <form onSubmit={onSubmit} className="flex flex-col w-80 gap-5">
        <Input
          type="text"
          required
          placeholder="Enter your username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="text"
          required
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          required
          placeholder="Enter your password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          required
          placeholder="Repeat your password"
          name="repeatPassword"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />


        <ul className="text-sm list-disc list-inside">
          <li className={isValidUsername ? "text-green-600" : "text-red-600"}>
            Username must contain 5-13 characters (letters, numbers, underscores)
          </li>
          <li className={isValidEmail ? "text-green-600" : "text-red-600"}>
            Email must be valid (e.g., email@example.com)
          </li>
          <li className={isValidPassword ? "text-green-600" : "text-red-600"}>
            Password must be at least 8 characters long
          </li>
          <li className={isPasswordMatch ? "text-green-600" : "text-red-600"}>
            Repeat password must match the password
          </li>
        </ul>

        <p className="text-center h-5 font-medium text-red-500 m-1 my-1 text-sm">
          {serverError}
        </p>
        <button
          className={`rounded-md text-center text-white outline outline-1 text-base py-4 font-normal ${
            isProcessing ? "bg-zinc-600" : "bg-zinc-900"
          }`}
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Register"}
        </button>

        <span className="text-center my-12">
          Already have an account?{" "}
          <Link className="text-gray-600" href="/signin">
            Sign in
          </Link>
        </span>
      </form>
    </main>
  );
}
